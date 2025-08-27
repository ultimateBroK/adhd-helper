"use client";

import { useTextStream } from "@/components/ui/response-stream";
import { StreamingMarkdown } from "@/components/ui/markdown";
import ThinkingBlock from './ThinkingBlock';
import type { Role } from "../types";

/**
 * Props for the MessageContent component
 */
interface MessageContentProps {
  /** The text content of the message */
  content: string;
  /** The role of the message sender */
  role: 'user' | 'assistant';
  /** Optional thinking content for assistant messages */
  thinking?: string;
}

/**
 * Renders the content of a chat message with appropriate formatting
 * Handles different display modes for user vs assistant messages
 */
export default function MessageContent({ content, role, thinking }: MessageContentProps) {
  const { displayedText } = useTextStream({
    textStream: content,
    mode: "fade"
  });

  // User messages are displayed as plain text
  if (role === 'user') {
    return (
      <span className="whitespace-pre-wrap">
        {content}
      </span>
    );
  }

  // Assistant messages include streaming markdown and optional thinking content
  return (
    <div className="message-content">
      <StreamingMarkdown text={displayedText} />
      {thinking && <ThinkingBlock text={thinking} />}
    </div>
  );
}


