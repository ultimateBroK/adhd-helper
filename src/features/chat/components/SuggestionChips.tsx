"use client";
import { useEffect } from "react";
import { animateStaggerChildren } from "@/lib/animations/anime";

export default function SuggestionChips({ onPick }: { onPick: (text: string) => void }) {
  const suggestions: string[] = [
    "Tóm tắt giúp tôi nội dung này",
    "Lập kế hoạch làm việc theo Pomodoro",
    "Gợi ý checklist để bắt đầu một dự án",
  ];

  useEffect(() => {
    animateStaggerChildren('.suggestion-bar', '.chip', { distance: 10, duration: 400 });
  }, []);

  return (
    <div className="suggestion-bar mt-4 flex flex-wrap gap-3 justify-center">
      {suggestions.map((s) => (
        <button
          key={s}
          type="button"
          className="chip text-sm px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
          onClick={() => onPick(s)}
        >
          {s}
        </button>
      ))}
    </div>
  );
}


