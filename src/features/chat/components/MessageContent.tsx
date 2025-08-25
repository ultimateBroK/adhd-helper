"use client";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ThinkingBlock from './ThinkingBlock';

export default function MessageContent({ content, role, thinking }: { content: string; role: 'user' | 'assistant'; thinking?: string }) {
  if (role === 'user') {
    return <span className="whitespace-pre-wrap">{content}</span>;
  }
  return (
    <div className="message-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
          h1: ({ children }) => <h1 className="text-2xl font-bold mb-2 mt-4 first:mt-0">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-bold mb-2 mt-4 first:mt-0">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h3>,
          h4: ({ children }) => <h4 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h4>,
          h5: ({ children }) => <h5 className="text-sm font-bold mb-2 mt-3 first:mt-0">{children}</h5>,
          h6: ({ children }) => <h6 className="text-xs font-bold mb-2 mt-3 first:mt-0">{children}</h6>,
          ul: ({ children }) => <ul className="list-disc ml-4 mb-2 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal ml-4 mb-2 space-y-1">{children}</ol>,
          code: ({ children }) => (
            <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
          ),
          pre: ({ children }) => (
            <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md overflow-x-auto mb-2 text-sm">{children}</pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-emerald-400 pl-4 italic mb-2 text-slate-700 dark:text-slate-300">{children}</blockquote>
          ),
          strong: ({ children }) => <strong className="font-bold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 underline hover:no-underline">{children}</a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
      {thinking ? <ThinkingBlock text={thinking} /> : null}
    </div>
  );
}


