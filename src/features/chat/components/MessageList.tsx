"use client";
import { useEffect } from "react";
import MessageItem from "./MessageItem";
import type { Message } from "@/features/chat/types";
import { animateEnter } from "@/lib/animations/anime";

export default function MessageList({ messages, containerRef, lastAnimatedIdRef }: {
  messages: Message[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  lastAnimatedIdRef: React.MutableRefObject<string | null>;
}) {
  useEffect(() => {
    if (!containerRef.current) return;
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
    if (!lastAssistant) return;
    if (lastAnimatedIdRef.current === lastAssistant.id) return;
    const bubbles = containerRef.current.querySelectorAll(".message-bubble");
    if (!bubbles.length) return;
    const lastBubble = bubbles[bubbles.length - 1] as Element;
    animateEnter(lastBubble, { distance: 8, duration: 450, opacityFrom: 0 });
    lastAnimatedIdRef.current = lastAssistant.id;
  }, [messages, containerRef, lastAnimatedIdRef]);

  return (
    <div className="chat-messages" ref={containerRef}>
      {messages.map((msg) => (
        <MessageItem key={msg.id} msg={msg} />
      ))}
      <div />
    </div>
  );
}


