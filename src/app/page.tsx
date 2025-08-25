"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  role: "user" | "assistant" | "typing";
  content: string;
  timestamp: Date;
}

// Component để render nội dung tin nhắn với markdown
const MessageContent = ({ content, role }: { content: string; role: "user" | "assistant" }) => {
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
    </div>
  );
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: "typing",
      role: "typing",
      content: "",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, typingMessage]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "hf.co/unsloth/gemma-3-270m-it-GGUF:Q8_K_XL",
          messages: [{ role: "user", content: userMessage.content }],
          stream: true,
        }),
      });

      if (!res.body) {
        throw new Error("No response body");
      }

      const reader = res.body.getReader();
      let aiResponse = "";
      const aiMessageId = (Date.now() + 1).toString();

      // Remove typing indicator and add AI message
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== "typing");
        return [...filtered, {
          id: aiMessageId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
        }];
      });

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split("\n");

                          for (const line of lines) {
                  if (line.trim()) {
                    try {
                      const json = JSON.parse(line);
                      aiResponse += json.message.content;

                      setMessages((prev) =>
                        prev.map((msg) =>
                          msg.id === aiMessageId
                            ? { ...msg, content: aiResponse }
                            : msg
                        )
                      );
                    } catch {
                      console.warn("Failed to parse line:", line);
                    }
                  }
                }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove typing indicator and add error message
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== "typing");
        return [...filtered, {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Xin lỗi, có lỗi xảy ra khi xử lý tin nhắn của bạn. Vui lòng thử lại.",
          timestamp: new Date(),
        }];
      });
    } finally {
      setIsTyping(false);
    }
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
        <div className="text-center mb-8">
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
                    <MessageContent content={msg.content} role={msg.role} />
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
            <div className="flex-1">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn của bạn..."
                disabled={isTyping}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-slate-500 resize-none"
              />
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