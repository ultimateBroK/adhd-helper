"use client";
import { useEffect, useState, useRef } from "react";
import { useChatStream } from "@/features/chat/hooks/useChatStream";
import ChatHeader from "@/features/chat/components/ChatHeader";
import MessageList from "@/features/chat/components/MessageList";
import ModelSelect from "@/features/chat/components/ModelSelect";
import InputBar from "@/features/chat/components/InputBar";

import type { Message } from "@/features/chat/types";

export default function Home() {
  const [message, setMessage] = useState("");
  const { messages, isTyping, send, lastAnimatedIdRef, setMessages } = useChatStream();
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("hf.co/unsloth/gemma-3-270m-it-GGUF:Q8_K_XL");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  

  useEffect(() => {
    messagesContainerRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
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
    // trigger CSS transition already present; anime handled inside MessageList previously
    lastBubble.classList.add('shimmer');
    lastAnimatedIdRef.current = lastAssistant.id;
  }, [messages]);

  // suggestion animation handled inside SuggestionChips

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

  

  return (
    <div className="chat-container">
      <div className="chat-wrapper">
        <div className="flex-shrink-0">
          <ChatHeader />
        </div>

        <div className="flex-1 min-h-0">
          <MessageList messages={messages} containerRef={messagesContainerRef} lastAnimatedIdRef={lastAnimatedIdRef} />
        </div>

        <div className="flex-shrink-0">
          <InputBar 
            value={message} 
            onChange={setMessage} 
            onSubmit={sendMessage} 
            disabled={isTyping}
            models={models}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
        </div>
      </div>
    </div>
  );
}