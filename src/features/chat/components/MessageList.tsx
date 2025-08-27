"use client";

import { useEffect } from "react";
import MessageItem from "./MessageItem";
import type { Message } from "@/features/chat/types";
import { animateEnter } from "@/lib/animations/anime";

/**
 * Props for the MessageList component
 */
interface MessageListProps {
  /** Array of messages to display */
  messages: Message[];
  /** Reference to the container element for animations */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Reference to track the last animated message ID */
  lastAnimatedIdRef: React.MutableRefObject<string | null>;
}

/**
 * Configuration for message list animations
 */
const ANIMATION_CONFIG = {
  distance: 8,
  duration: 450,
  opacityFrom: 0,
} as const;

/**
 * Displays a list of chat messages with smooth enter animations
 * Automatically animates the last assistant message when new messages arrive
 */
export default function MessageList({
  messages,
  containerRef,
  lastAnimatedIdRef
}: MessageListProps) {

  /**
   * Handles animation of new assistant messages
   */
  useEffect(() => {
    if (!containerRef.current) return;

    const lastAssistant = findLastAssistantMessage(messages);
    if (!lastAssistant) return;

    if (lastAnimatedIdRef.current === lastAssistant.id) return;

    const bubbles = containerRef.current.querySelectorAll(".message-bubble");
    if (!bubbles.length) return;

    const lastBubble = bubbles[bubbles.length - 1] as Element;
    animateEnter(lastBubble, ANIMATION_CONFIG);
    lastAnimatedIdRef.current = lastAssistant.id;
  }, [messages, containerRef, lastAnimatedIdRef]);

  return (
    <div className="chat-messages" ref={containerRef}>
      {messages.map((msg) => (
        <MessageItem key={msg.id} msg={msg} />
      ))}
      {/* Spacer div for layout */}
      <div />
    </div>
  );
}

/**
 * Finds the last assistant message in the messages array
 */
function findLastAssistantMessage(messages: Message[]): Message | undefined {
  return [...messages].reverse().find((message) => message.role === "assistant");
}


