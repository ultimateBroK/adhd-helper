import { cn } from "@/lib/utils"
import { marked } from "marked"
import {
  memo,
  useId,
  useMemo,
  useRef,
  useEffect,
  useState,
  isValidElement,
  type ReactNode,
  type ReactElement,
  type ComponentPropsWithoutRef,
} from "react"
import ReactMarkdown, { Components } from "react-markdown"
import remarkBreaks from "remark-breaks"
import remarkGfm from "remark-gfm"
import { CodeBlock, CodeBlockCode } from "./code-block"

export type MarkdownProps = {
  children: string
  id?: string
  className?: string
  components?: Partial<Components>
}

function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown)
  return tokens.map((token) => token.raw)
}

function extractLanguage(className?: string): string {
  if (!className) return "plaintext"
  const match = className.match(/language-(\w+)/)
  return match ? match[1] : "plaintext"
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

function extractTextFromChildren(children: ReactNode): string {
  if (typeof children === "string") return children
  if (Array.isArray(children))
    return (children as ReactNode[]).map(extractTextFromChildren).join("")
  if (isValidElement(children)) {
    const el = children as ReactElement<{ children?: ReactNode }>
    return extractTextFromChildren(el.props?.children)
  }
  return ""
}

const INITIAL_COMPONENTS: Partial<Components> = {
  p: function Paragraph({ children, className, ...props }: ComponentPropsWithoutRef<"p"> & { children?: ReactNode }) {
    return (
      <p className={cn("mb-2 last:mb-0 leading-relaxed", className)} {...props}>
        {children}
      </p>
    )
  },
  h1: function H1({ children, className, ...props }: ComponentPropsWithoutRef<"h1"> & { children?: ReactNode }) {
    const id = slugify(extractTextFromChildren(children))
    return (
      <h1 id={id} className={cn("text-2xl font-bold mb-2 mt-4 first:mt-0", className)} {...props}>
        {children}
      </h1>
    )
  },
  h2: function H2({ children, className, ...props }: ComponentPropsWithoutRef<"h2"> & { children?: ReactNode }) {
    const id = slugify(extractTextFromChildren(children))
    return (
      <h2 id={id} className={cn("text-xl font-bold mb-2 mt-4 first:mt-0", className)} {...props}>
        {children}
      </h2>
    )
  },
  h3: function H3({ children, className, ...props }: ComponentPropsWithoutRef<"h3"> & { children?: ReactNode }) {
    const id = slugify(extractTextFromChildren(children))
    return (
      <h3 id={id} className={cn("text-lg font-bold mb-2 mt-3 first:mt-0", className)} {...props}>
        {children}
      </h3>
    )
  },
  h4: function H4({ children, className, ...props }: ComponentPropsWithoutRef<"h4"> & { children?: ReactNode }) {
    const id = slugify(extractTextFromChildren(children))
    return (
      <h4 id={id} className={cn("text-base font-bold mb-2 mt-3 first:mt-0", className)} {...props}>
        {children}
      </h4>
    )
  },
  h5: function H5({ children, className, ...props }: ComponentPropsWithoutRef<"h5"> & { children?: ReactNode }) {
    const id = slugify(extractTextFromChildren(children))
    return (
      <h5 id={id} className={cn("text-sm font-bold mb-2 mt-3 first:mt-0", className)} {...props}>
        {children}
      </h5>
    )
  },
  h6: function H6({ children, className, ...props }: ComponentPropsWithoutRef<"h6"> & { children?: ReactNode }) {
    const id = slugify(extractTextFromChildren(children))
    return (
      <h6 id={id} className={cn("text-xs font-bold mb-2 mt-3 first:mt-0", className)} {...props}>
        {children}
      </h6>
    )
  },
  ul: function UnorderedList({ children, className, ...props }: ComponentPropsWithoutRef<"ul"> & { children?: ReactNode }) {
    return (
      <ul className={cn("list-disc ml-4 mb-2 space-y-1", className)} {...props}>
        {children}
      </ul>
    )
  },
  ol: function OrderedList({ children, className, ...props }: ComponentPropsWithoutRef<"ol"> & { children?: ReactNode }) {
    return (
      <ol className={cn("list-decimal ml-4 mb-2 space-y-1", className)} {...props}>
        {children}
      </ol>
    )
  },
  li: function ListItem({
    children,
    className,
    checked,
    ...props
  }: ComponentPropsWithoutRef<"li"> & { checked?: boolean }) {
    if (typeof checked === "boolean") {
      return (
        <li className={cn("list-none flex items-start gap-2", className)} {...props}>
          <input
            type="checkbox"
            checked={checked}
            readOnly
            aria-label="Task item"
            className="mt-0.5 accent-emerald-600 dark:accent-emerald-400"
          />
          <span>{children}</span>
        </li>
      )
    }
    return (
      <li className={className} {...props}>
        {children}
      </li>
    )
  },
  code: function CodeComponent({ className, children, ...props }: ComponentPropsWithoutRef<"code"> & {
    children?: ReactNode
    node?: { position?: { start?: { line?: number } | null; end?: { line?: number } | null } }
  }) {
    const isInline =
      !props.node?.position?.start?.line ||
      props.node?.position?.start?.line === props.node?.position?.end?.line

    if (isInline) {
      return (
        <span
          className={cn(
            "bg-primary-foreground rounded-sm px-1 font-mono text-sm",
            className
          )}
          {...props}
        >
          {children}
        </span>
      )
    }

    const language = extractLanguage(className)

    return (
      <CodeBlock className={className}>
        <CodeBlockCode code={children as string} language={language} />
      </CodeBlock>
    )
  },
  pre: function PreComponent({ children }: { children?: ReactNode }) {
    return <>{children}</>
  },
  a: function Anchor({ children, href, className, ...props }: ComponentPropsWithoutRef<"a"> & { children?: ReactNode }) {
    return (
      <a
        href={href as string}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className={cn("text-emerald-600 dark:text-emerald-400 underline hover:no-underline", className)}
        {...props}
      >
        {children}
      </a>
    )
  },
  blockquote: function BlockQuote({ children, className, ...props }: ComponentPropsWithoutRef<"blockquote"> & { children?: ReactNode }) {
    return (
      <blockquote
        className={cn(
          "border-l-4 border-emerald-400 pl-4 italic mb-2 text-slate-700 dark:text-slate-300",
          className
        )}
        {...props}
      >
        {children}
      </blockquote>
    )
  },
  hr: function ThematicBreak({ className, ...props }: ComponentPropsWithoutRef<"hr">) {
    return <hr className={cn("my-4 border-slate-200 dark:border-slate-700", className)} {...props} />
  },
  table: function Table({ children, className, ...props }: ComponentPropsWithoutRef<"table"> & { children?: ReactNode }) {
    return (
      <div className="w-full overflow-x-auto mb-2">
        <table className={cn("w-full border-collapse text-sm", className)} {...props}>
          {children}
        </table>
      </div>
    )
  },
  th: function TableHeaderCell({ children, className, ...props }: ComponentPropsWithoutRef<"th"> & { children?: ReactNode }) {
    return (
      <th className={cn("border px-2 py-1 bg-slate-50 dark:bg-slate-800", className)} {...props}>
        {children}
      </th>
    )
  },
  td: function TableCell({ children, className, ...props }: ComponentPropsWithoutRef<"td"> & { children?: ReactNode }) {
    return (
      <td className={cn("border px-2 py-1 align-top", className)} {...props}>
        {children}
      </td>
    )
  },
  img: function ImageComponent({
    src,
    alt,
    className,
    ...props
  }: ComponentPropsWithoutRef<"img">) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt ?? ""} className={cn("max-w-full rounded-md", className)} {...props} />
    )
  },
}

const MemoizedMarkdownBlock = memo(
  function MarkdownBlock({
    content,
    components = INITIAL_COMPONENTS,
  }: {
    content: string
    components?: Partial<Components>
  }) {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    )
  },
  function propsAreEqual(prevProps, nextProps) {
    return prevProps.content === nextProps.content
  }
)

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock"

function MarkdownComponent({
  children,
  id,
  className,
  components = INITIAL_COMPONENTS,
}: MarkdownProps) {
  const generatedId = useId()
  const blockId = id ?? generatedId
  const blocks = useMemo(() => parseMarkdownIntoBlocks(children), [children])

  return (
    <div className={className}>
      {blocks.map((block, index) => (
        <MemoizedMarkdownBlock
          key={`${blockId}-block-${index}`}
          content={block}
          components={components}
        />
      ))}
    </div>
  )
}

const Markdown = memo(MarkdownComponent)
Markdown.displayName = "Markdown"

export { Markdown }

// Streaming-friendly Markdown that fades in new blocks as text grows
export function StreamingMarkdown({
  text,
  className,
  fadeDuration,
  segmentDelay,
  components = INITIAL_COMPONENTS,
}: {
  text: string
  className?: string
  fadeDuration?: number
  segmentDelay?: number
  components?: Partial<Components>
}) {
  const [blocks, setBlocks] = useState<string[]>([])
  const prevTextRef = useRef("")
  const fadeStartIndexRef = useRef(0)

  const getFadeDuration = () => {
    if (typeof fadeDuration === "number") return Math.max(10, fadeDuration)
    // default consistent with response streaming
    return 600
  }

  const getSegmentDelay = () => {
    if (typeof segmentDelay === "number") return Math.max(0, segmentDelay)
    return 80
  }

  useEffect(() => {
    const prev = prevTextRef.current
    const isAppend = text.startsWith(prev)
    const newBlocks = parseMarkdownIntoBlocks(text)
    if (!isAppend) {
      fadeStartIndexRef.current = 0
    } else {
      const prevBlocks = parseMarkdownIntoBlocks(prev)
      fadeStartIndexRef.current = prevBlocks.length
    }
    setBlocks(newBlocks)
    prevTextRef.current = text
  }, [text])

  const fadeStyle = `
    @keyframes fadeInMd {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .md-fade-segment { opacity: 0; display: block; animation: fadeInMd ${getFadeDuration()}ms ease-out forwards; }
  `

  return (
    <div className={className}>
      <style>{fadeStyle}</style>
      {blocks.map((block, index) => (
        <span
          key={`md-block-${index}`}
          className="md-fade-segment"
          style={{ animationDelay: `${Math.max(0, index - fadeStartIndexRef.current) * getSegmentDelay()}ms` }}
        >
          <MemoizedMarkdownBlock content={block} components={components} />
        </span>
      ))}
    </div>
  )
}
