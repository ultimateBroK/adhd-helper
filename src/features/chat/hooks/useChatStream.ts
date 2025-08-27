"use client";

import { useCallback, useRef, useState } from "react";
import { Message } from "../types";

/**
 * Configuration constants for the chat stream
 */
const CHAT_CONFIG = {
  /** API endpoint for chat requests */
  API_ENDPOINT: "/api/chat",
  /** Batch interval for UI updates during streaming (ms) */
  BATCH_INTERVAL: 100,
  /** Error message for failed requests */
  ERROR_MESSAGE: "Sorry, there was an error processing your message. Please try again.",
  /** Typing message ID */
  TYPING_ID: "typing",
} as const;

/**
 * Custom hook for managing chat streaming functionality
 * Handles message sending, streaming responses, and state management
 */
export function useChatStream() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const lastAnimatedIdRef = useRef<string | null>(null);

  /**
   * Creates a user message object
   */
  const createUserMessage = useCallback((text: string): Message => ({
    id: Date.now().toString(),
    role: "user",
    content: text,
    timestamp: new Date(),
  }), []);

  /**
   * Adds user message and typing indicator to the messages list
   */
  const addUserMessage = useCallback((userMessage: Message) => {
    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        id: CHAT_CONFIG.TYPING_ID,
        role: "typing",
        content: "",
        timestamp: new Date()
      }
    ]);
  }, []);

  /**
   * Fetches the chat response from the API
   */
  const fetchChatResponse = useCallback(async (model: string, userMessage: Message) => {
    const res = await fetch(CHAT_CONFIG.API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: userMessage.content }]
      }),
    });

    if (!res.body) {
      throw new Error("No response body");
    }

    return res;
  }, []);

  /**
   * Parses a streaming chunk and extracts content and thinking
   */
  const parseStreamingChunk = useCallback((
    delta: string,
    currentContent: string,
    currentThinking: string
  ): { content: string; thinking: string } => {
    let content = currentContent;
    let thinking = currentThinking;
    let inThinking = false;
    let cursor = 0;

    while (cursor < delta.length) {
      if (inThinking) {
        const closeIdx = delta.indexOf("</think>", cursor);
        if (closeIdx === -1) {
          thinking += delta.slice(cursor);
          cursor = delta.length;
        } else {
          thinking += delta.slice(cursor, closeIdx);
          inThinking = false;
          cursor = closeIdx + 8;
        }
      } else {
        const openIdx = delta.indexOf("<think>", cursor);
        if (openIdx === -1) {
          content += delta.slice(cursor);
          cursor = delta.length;
        } else {
          content += delta.slice(cursor, openIdx);
          const closeIdx = delta.indexOf("</think>", openIdx + 7);
          if (closeIdx === -1) {
            inThinking = true;
            cursor = openIdx + 7;
          } else {
            thinking += delta.slice(openIdx + 7, closeIdx);
            cursor = closeIdx + 8;
          }
        }
      }
    }

    return { content, thinking };
  }, []);

  /**
   * Updates the assistant message with new content and thinking
   */
  const updateAssistantMessage = useCallback((aiId: string, content: string, thinking: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === aiId ? { ...m, content, thinking } : m
      )
    );
  }, []);

  /**
   * Processes the streaming response from the AI
   */
  const processStreamingResponse = useCallback(async (response: Response) => {
    const reader = response.body!.getReader();
    const aiId = (Date.now() + 1).toString();

    // Replace typing indicator with AI message
    setMessages((prev) => [
      ...prev.filter((m) => m.id !== CHAT_CONFIG.TYPING_ID),
      {
        id: aiId,
        role: "assistant",
        content: "",
        timestamp: new Date()
      }
    ]);

    let content = "";
    let thinking = "";
    let lastUpdateTime = 0;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const delta = new TextDecoder().decode(value);
        if (!delta) continue;

        ({ content, thinking } = parseStreamingChunk(delta, content, thinking));

        const now = Date.now();
        if (now - lastUpdateTime > CHAT_CONFIG.BATCH_INTERVAL) {
          updateAssistantMessage(aiId, content, thinking);
          lastUpdateTime = now;
        }
      }

      // Final update to ensure the last chunk is rendered
      updateAssistantMessage(aiId, content, thinking);
    } finally {
      reader.releaseLock();
    }
  }, [parseStreamingChunk, updateAssistantMessage]);

  /**
   * Handles errors that occur during streaming
   */
  const handleStreamingError = useCallback((error: unknown) => {
    console.error("Streaming error:", error);
    setMessages((prev) => [
      ...prev.filter((m) => m.id !== CHAT_CONFIG.TYPING_ID),
      {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: CHAT_CONFIG.ERROR_MESSAGE,
        timestamp: new Date(),
      },
    ]);
  }, []);

  /**
   * Sends a message to the AI model and handles the streaming response
   */
  const send = useCallback(async (model: string, userText: string) => {
    if (!userText.trim()) return;

    const userMessage = createUserMessage(userText.trim());
    addUserMessage(userMessage);
    setIsTyping(true);

    try {
      const response = await fetchChatResponse(model, userMessage);
      await processStreamingResponse(response);
    } catch (error) {
      handleStreamingError(error);
    } finally {
      setIsTyping(false);
    }
  }, [createUserMessage, addUserMessage, fetchChatResponse, processStreamingResponse, handleStreamingError]);

  return { messages, isTyping, send, lastAnimatedIdRef, setMessages } as const;
}


