"use client";
import { useEffect, RefObject } from "react";
import { animateEnter } from "./anime";

export function useAnimeEnter(ref: RefObject<HTMLElement | null>, options?: Parameters<typeof animateEnter>[1]) {
  useEffect(() => {
    if (!ref?.current) return;
    animateEnter(ref.current, options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, JSON.stringify(options)]);
}


