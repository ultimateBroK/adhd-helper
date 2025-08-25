"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useChatStream } from "@/features/chat/hooks/useChatStream";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAnimeEnter } from "@/lib/animations/hooks";
import { animateEnter, animateStaggerChildren } from "@/lib/animations/anime";

import type { Message } from "@/features/chat/types";

// Component để render nội dung tin nhắn với markdown
const MessageContent = ({ content, role, thinking }: { content: string; role: "user" | "assistant"; thinking?: string }) => {
  if (role === "user") {
    return <span className="whitespace-pre-wrap">{content}</span>;
  }

  return (
    <div className="message-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Override default components để tối ưu styling
          p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
          h1: ({ children }) => <h1 className="text-2xl font-bold mb-2 mt-4 first:mt-0">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-bold mb-2 mt-4 first:mt-0">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h3>,
          h4: ({ children }) => <h4 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h4>,
          h5: ({ children }) => <h5 className="text-sm font-bold mb-2 mt-3 first:mt-0">{children}</h5>,
          h6: ({ children }) => <h6 className="text-xs font-bold mb-2 mt-3 first:mt-0">{children}</h6>,
          ul: ({ children }) => <ul className="list-disc ml-4 mb-2 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal ml-4 mb-2 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed" key={Math.random()}>{children}</li>,
          code: ({ children }) => (
            <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md overflow-x-auto mb-2 text-sm">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-emerald-400 pl-4 italic mb-2 text-slate-700 dark:text-slate-300">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => <strong className="font-bold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 dark:text-emerald-400 underline hover:no-underline"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
      {thinking ? <ThinkingBlock text={thinking} /> : null}
    </div>
  );
};

const ThinkingBlock = ({ text }: { text: string }) => {
  const [open, setOpen] = useState(false);
  const thinkRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open && thinkRef.current) {
      animateEnter(thinkRef.current, { distance: 6, duration: 300, opacityFrom: 0 });
    }
  }, [open]);
  return (
    <div className="mt-2 pt-2 border-t border-emerald-100 dark:border-emerald-800">
      <button
        type="button"
        className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Ẩn suy nghĩ" : "Hiển thị suy nghĩ"}
      </button>
      {open ? (
        <div ref={thinkRef} className="mt-2 text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
          {text}
        </div>
      ) : null}
    </div>
  );
};

export default function Home() {
  const [message, setMessage] = useState("");
  const { messages, isTyping, send, lastAnimatedIdRef, setMessages } = useChatStream();
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("hf.co/unsloth/gemma-3-270m-it-GGUF:Q8_K_XL");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const suggestions: string[] = [
    "Tóm tắt giúp tôi nội dung này",
    "Lập kế hoạch làm việc theo Pomodoro",
    "Gợi ý checklist để bắt đầu một dự án",
    "Biến ghi chú này thành bullet rõ ràng",
  ];

  useAnimeEnter(headerRef, { distance: 16, duration: 700 });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load available models from Ollama
    const loadModels = async () => {
      try {
        const res = await fetch('/api/models');
        const data = await res.json();
        type OllamaModel = { name: string };
        const list = ((data?.models as OllamaModel[] | undefined) ?? []).map((m) => m.name).filter(Boolean);
        if (list.length) {
          setModels(list);
          setSelectedModel((prev) => (prev && list.includes(prev) ? prev : list[0]));
        }
      } catch (e) {
        console.warn('Failed to load models', e);
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (!messagesContainerRef.current) return;
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
    if (!lastAssistant) return;
    if (lastAnimatedIdRef.current === lastAssistant.id) return;
    const bubbles = messagesContainerRef.current.querySelectorAll(".message-bubble");
    if (!bubbles.length) return;
    const lastBubble = bubbles[bubbles.length - 1] as Element;
    animateEnter(lastBubble, { distance: 8, duration: 450, opacityFrom: 0 });
    lastAnimatedIdRef.current = lastAssistant.id;
  }, [messages]);

  useEffect(() => {
    // Animate suggestion chips on first render
    animateStaggerChildren('.suggestion-bar', '.chip', { distance: 10, duration: 400 });
  }, []);

  useEffect(() => {
    // Add welcome message with markdown example
    const welcomeMessage: Message = {
      id: "welcome",
      role: "assistant",
      content: `👋 **Chào bạn!** Tôi là trợ lý AI thông minh của bạn.

Tôi có thể giúp bạn:
- 📝 **Quản lý công việc** và lập kế hoạch
- 🧠 **Hỗ trợ tập trung** với các kỹ thuật ADHD
- 💡 **Tạo ý tưởng** và brainstorming
- 📊 **Phân tích thông tin** và tổng hợp

**Cách sử dụng:**
- Gửi tin nhắn bình thường để trò chuyện
- Sử dụng markdown để format text: **in đậm**, *in nghiêng*, \`code\`
- Tạo danh sách, bảng biểu và nhiều hơn nữa!

Hãy bắt đầu bằng cách hỏi tôi bất cứ điều gì bạn cần hỗ trợ nhé! 🚀`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  const sendMessage = async () => {
    const text = message;
    setMessage("");
    await send(selectedModel, text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="chat-container">
      <div className="chat-wrapper">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
              ADHD Helper
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Trợ lý AI thông minh cho mọi nhu cầu
          </p>
        </div>

        {/* Messages Container */}
        <div
          ref={messagesContainerRef}
          className="chat-messages"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
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
                      <span className="text-sm text-slate-500 dark:text-slate-400 mr-2">
                        AI đang trả lời
                      </span>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`message-bubble ${
                      msg.role === "user" ? "message-user" : "message-ai"
                    }`}
                  >
                    <MessageContent content={msg.content} role={msg.role} thinking={msg.thinking} />
                  </div>
                )}

                {msg.role !== "typing" && (
                  <span className={`text-xs text-slate-500 px-2 flex-shrink-0 ${
                    msg.role === "user" ? "text-right self-end" : "text-left self-start"
                  }`}>
                    {formatTime(msg.timestamp)}
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
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Container */}
        <div className="input-container">
          <div className="flex gap-3 items-end">
            <div className="min-w-[220px] max-w-[320px]">
              <Select
                value={selectedModel}
                onChange={setSelectedModel}
                className="w-full truncate"
                options={(models.length ? models : [selectedModel]).map((m) => ({ label: compactModelName(m), value: m }))}
                placeholder="Chọn model"
                disabled={isTyping}
              />
            </div>
            <div className="flex-1">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn của bạn..."
                disabled={isTyping}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-slate-500 resize-none"
              />
              <div ref={suggestionsRef} className="suggestion-bar mt-2 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="chip text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition"
                    onClick={() => setMessage(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <Button
              onClick={sendMessage}
              disabled={!message.trim() || isTyping}
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>

          {/* Tips */}
          <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 text-center">
            Nhấn Enter để gửi • Shift + Enter để xuống dòng
          </div>
        </div>
      </div>
    </div>
  );
}

function compactModelName(m: string) {
  // Examples:
  // "hf.co/unsloth/gemma-3-270m-it-GGUF:Q8_K_XL" -> "gemma-3-270m-it (Q8_K_XL)"
  // "qwen2.5:3b" -> "qwen2.5 (3b)"
  const parts = m.split('/')
  const last = parts[parts.length - 1]
  const [name, tag] = last.split(':')
  const cleaned = name.replace(/-GGUF$/i, '')
  return tag ? `${cleaned} (${tag})` : cleaned
}