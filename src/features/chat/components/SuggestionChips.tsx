"use client";
import { useEffect } from "react";
import { animateStaggerChildren } from "@/lib/animations/anime";

export default function SuggestionChips({ onPick }: { onPick: (text: string) => void }) {
  const suggestions: string[] = [
    "Tóm tắt giúp tôi nội dung này",
    "Lập kế hoạch làm việc theo Pomodoro",
    "Gợi ý checklist để bắt đầu một dự án",
    "Biến ghi chú này thành bullet rõ ràng",
  ];

  useEffect(() => {
    animateStaggerChildren('.suggestion-bar', '.chip', { distance: 10, duration: 400 });
  }, []);

  return (
    <div className="suggestion-bar mt-2 flex flex-wrap gap-2">
      {suggestions.map((s) => (
        <button
          key={s}
          type="button"
          className="chip text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition"
          onClick={() => onPick(s)}
        >
          {s}
        </button>
      ))}
    </div>
  );
}


