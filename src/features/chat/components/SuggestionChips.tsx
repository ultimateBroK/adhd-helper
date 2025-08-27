"use client";

import { useEffect } from "react";
import { animateStaggerChildren } from "@/lib/animations/anime";

/**
 * Props for the SuggestionChips component
 */
interface SuggestionChipsProps {
  /** Callback when a suggestion chip is clicked */
  onPick: (text: string) => void;
}

/**
 * Configuration for suggestion chips
 */
const SUGGESTION_CONFIG = {
  /** Predefined suggestion texts */
  suggestions: [
    "Summarize this content for me",
    "Create a Pomodoro work plan",
    "Suggest a checklist to start a project",
  ],
  /** Animation configuration */
  animation: {
    distance: 10,
    duration: 400,
  },
} as const;

/**
 * Interactive suggestion chips component
 * Displays clickable suggestion buttons with staggered animation
 */
export default function SuggestionChips({ onPick }: SuggestionChipsProps) {
  useEffect(() => {
    animateStaggerChildren('.suggestion-bar', '.chip', SUGGESTION_CONFIG.animation);
  }, []);

  return (
    <div className="suggestion-bar mt-4 flex flex-wrap gap-3 justify-center">
      {SUGGESTION_CONFIG.suggestions.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          className="chip text-sm px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
          onClick={() => onPick(suggestion)}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}


