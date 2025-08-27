"use client";
import { useEffect, useRef, useState } from "react";
import { animateEnter } from "@/lib/animations/anime";

export default function ThinkingBlock({ text }: { text?: string }) {
  const [open, setOpen] = useState(false);
  const thinkRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open && thinkRef.current) {
      animateEnter(thinkRef.current, { distance: 6, duration: 300, opacityFrom: 0 });
    }
  }, [open]);
  if (!text) return null;
  return (
    <div className="mt-2 pt-2 border-t border-emerald-100 dark:border-emerald-800">
      <button
        type="button"
        className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Ẩn suy nghĩ" : "Hiển thị suy nghĩ"}
      </button>
      {open ? (
        <div ref={thinkRef} className="mt-2 text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
          {text}
        </div>
      ) : null}
    </div>
  );
}


