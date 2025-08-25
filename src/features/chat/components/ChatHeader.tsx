"use client";
import { useRef } from "react";
import { Sparkles } from "lucide-react";
import { useAnimeEnter } from "@/lib/animations/hooks";

export default function ChatHeader() {
  const headerRef = useRef<HTMLDivElement>(null);
  useAnimeEnter(headerRef, { distance: 16, duration: 700 });
  return (
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
  );
}


