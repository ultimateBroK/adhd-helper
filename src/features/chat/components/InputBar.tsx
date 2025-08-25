"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import SuggestionChips from "./SuggestionChips";

export default function InputBar({
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="input-container">
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn của bạn..."
            disabled={disabled}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-slate-500 resize-none"
          />
          <SuggestionChips onPick={onChange} />
        </div>
        <Button
          onClick={onSubmit}
          disabled={!value.trim() || disabled}
          size="lg"
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
      <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 text-center">
        Nhấn Enter để gửi • Shift + Enter để xuống dòng
      </div>
    </div>
  );
}


