"use client";
import { useCallback, useRef, useState } from "react";
import { Message } from "../types";

export function useChatStream() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const lastAnimatedIdRef = useRef<string | null>(null);

  const send = useCallback(async (model: string, userText: string) => {
    if (!userText.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userText.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage, { id: "typing", role: "typing", content: "", timestamp: new Date() }]);
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, messages: [{ role: "user", content: userMessage.content }] }),
      });
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      let content = "";
      let thinking = "";
      let inThinking = false;
      const aiId = (Date.now() + 1).toString();
      setMessages((prev) => [...prev.filter((m) => m.id !== "typing"), { id: aiId, role: "assistant", content: "", timestamp: new Date() }]);

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const delta = new TextDecoder().decode(value);
          if (!delta) continue;

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

          setMessages((prev) => prev.map((m) => (m.id === aiId ? { ...m, content, thinking } : m)));
        }
      } finally {
        reader.releaseLock();
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== "typing"),
        { id: (Date.now() + 1).toString(), role: "assistant", content: "Xin lỗi, có lỗi xảy ra khi xử lý tin nhắn của bạn. Vui lòng thử lại.", timestamp: new Date() },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  return { messages, isTyping, send, lastAnimatedIdRef, setMessages } as const;
}


