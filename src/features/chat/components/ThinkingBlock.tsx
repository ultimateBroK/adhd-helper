"use client";

import { useEffect, useRef, useState } from "react";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ui/reasoning";

/**
 * Props for the ThinkingBlock component
 */
interface ThinkingBlockProps {
  /** The thinking content to display */
  text?: string;
  /** Whether the thinking content is currently being streamed */
  isStreaming?: boolean;
}

/**
 * A collapsible block that displays AI thinking content with streaming support
 * Uses the reasoning UI components to provide a smooth, animated experience
 */
export default function ThinkingBlock({ text, isStreaming = false }: ThinkingBlockProps) {
  const [displayText, setDisplayText] = useState("");
  const [isStreamComplete, setIsStreamComplete] = useState(false);
  const streamingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle streaming text updates with better performance
  useEffect(() => {
    if (text && isStreaming) {
      setIsStreamComplete(false);
      setDisplayText("");

      // Clear any existing timeout
      if (streamingTimeoutRef.current) {
        clearTimeout(streamingTimeoutRef.current);
      }

      // Simulate character-by-character streaming for better UX
      const streamText = async () => {
        const chars = text.split("");

        for (let i = 0; i < chars.length; i++) {
          setDisplayText(text.slice(0, i + 1));

          // Dynamic delay based on character type for more natural feel
          const delay = chars[i] === '\n' ? 50 : chars[i] === ' ' ? 5 : 8;
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        setIsStreamComplete(true);
      };

      streamText();
    } else if (text) {
      setDisplayText(text);
      setIsStreamComplete(true);
    } else {
      setDisplayText("");
      setIsStreamComplete(false);
    }

    // Cleanup timeout on unmount
    return () => {
      if (streamingTimeoutRef.current) {
        clearTimeout(streamingTimeoutRef.current);
      }
    };
  }, [text, isStreaming]);

  // Don't render if there's no thinking content
  if (!text && !isStreaming) {
    return null;
  }

  const getTriggerText = () => {
    return "Show AI reasoning";
  };

  const getContentText = () => {
    if (isStreaming && !displayText) return "Analyzing your request...";
    if (isStreaming && displayText) return displayText;
    return displayText || "No thinking content available";
  };

  return (
    <div className="mt-2">
      <Reasoning isStreaming={isStreaming}>
        <ReasoningTrigger className="text-sm text-slate-700 dark:text-slate-200">
          {getTriggerText()}
        </ReasoningTrigger>
        <ReasoningContent
          markdown
          className="ml-2 border-l-2 border-l-slate-200 px-2 pb-1 dark:border-l-slate-700"
          contentClassName="text-[13px] leading-6 text-slate-700 dark:text-slate-300"
        >
          {getContentText()}
        </ReasoningContent>
      </Reasoning>
    </div>
  );
}


