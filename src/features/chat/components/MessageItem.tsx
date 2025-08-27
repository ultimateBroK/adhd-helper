"use client";

import { Bot, User } from "lucide-react";
import MessageContent from "./MessageContent";
import type { Message } from "@/features/chat/types";

/**
 * Props for the MessageItem component
 */
interface MessageItemProps {
  /** The message to display */
  msg: Message;
}

/**
 * Configuration for message display
 */
const MESSAGE_CONFIG = {
  /** Text to show when AI is typing */
  typingText: "AI is responding...",
  /** Time format locale */
  timeLocale: "en-US",
  /** Time format options */
  timeOptions: {
    hour: "2-digit" as const,
    minute: "2-digit" as const
  }
} as const;

/**
 * Renders a single chat message with avatar, content, and timestamp
 * Handles different message types: user, assistant, and typing indicator
 */
export default function MessageItem({ msg }: MessageItemProps) {
  const isUserMessage = msg.role === "user";
  const isAssistantMessage = msg.role === "assistant";
  const isTypingMessage = msg.role === "typing";

  return (
    <div className={`flex gap-3 ${isUserMessage ? "justify-end" : "justify-start"}`}>
      {/* Assistant avatar */}
      {isAssistantMessage && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
            <Bot className="w-4 h-4 text-white" />
          </div>
        </div>
      )}

      {/* Message content */}
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        {isTypingMessage ? (
          <TypingIndicator />
        ) : (
          <div className={`message-bubble ${isUserMessage ? "message-user" : "message-ai"}`}>
            <MessageContent
              content={msg.content}
              role={isUserMessage ? 'user' : 'assistant'}
              thinking={msg.thinking}
            />
          </div>
        )}

        {/* Timestamp */}
        {!isTypingMessage && (
          <span className={`text-xs text-slate-500 px-2 flex-shrink-0 ${
            isUserMessage ? "text-right self-end" : "text-left self-start"
          }`}>
            {new Date(msg.timestamp).toLocaleTimeString(
              MESSAGE_CONFIG.timeLocale,
              MESSAGE_CONFIG.timeOptions
            )}
          </span>
        )}
      </div>

      {/* User avatar */}
      {isUserMessage && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Typing indicator component for when AI is generating a response
 */
function TypingIndicator() {
  return (
    <div className="message-bubble message-typing">
      <div className="typing-indicator">
        <span className="text-sm text-slate-500 dark:text-slate-400 mr-2">
          {MESSAGE_CONFIG.typingText}
        </span>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
      </div>
    </div>
  );
}


