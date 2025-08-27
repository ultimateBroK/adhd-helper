"use client";
import { Markdown } from "@/components/ui/markdown";
import ThinkingBlock from './ThinkingBlock';

export default function MessageContent({ content, role, thinking }: { content: string; role: 'user' | 'assistant'; thinking?: string }) {
  if (role === 'user') {
    return <span className="whitespace-pre-wrap">{content}</span>;
  }
  return (
    <div className="message-content">
      <Markdown>
        {content}
      </Markdown>
      {thinking ? <ThinkingBlock text={thinking} /> : null}
    </div>
  );
}


