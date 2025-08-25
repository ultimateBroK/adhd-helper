"use client";
import { Bot, User } from "lucide-react";
import MessageContent from "./MessageContent";
import type { Message } from "@/features/chat/types";

export default function MessageItem({ msg }: { msg: Message }) {
  return (
    <div className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
      {msg.role === "assistant" && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
            <Bot className="w-4 h-4 text-white" />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1 min-w-0 flex-1">
        {msg.role === "typing" ? (
          <div className="message-bubble message-typing">
            <div className="typing-indicator">
              <span className="text-sm text-slate-500 dark:text-slate-400 mr-2">AI đang trả lời</span>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        ) : (
          <div className={`message-bubble ${msg.role === "user" ? "message-user" : "message-ai"}`}>
            <MessageContent content={msg.content} role={msg.role === 'user' ? 'user' : 'assistant'} thinking={msg.thinking} />
          </div>
        )}

        {msg.role !== "typing" && (
          <span className={`text-xs text-slate-500 px-2 flex-shrink-0 ${msg.role === "user" ? "text-right self-end" : "text-left self-start"}`}>
            {new Date(msg.timestamp).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
      </div>

      {msg.role === "user" && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
    </div>
  );
}


