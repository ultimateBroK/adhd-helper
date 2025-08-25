export type AnimeTarget = Element | Element[] | NodeList | string;

export type EnterAnimationOptions = {
  duration?: number;
  delay?: number;
  distance?: number;
  opacityFrom?: number;
  easing?: string;
};

export const defaultEnterAnimation: Required<EnterAnimationOptions> = {
  duration: 600,
  delay: 0,
  distance: 12,
  opacityFrom: 0,
  easing: "outCubic",
};

export async function animateEnter(target: AnimeTarget, options: EnterAnimationOptions = {}): Promise<void> {
  if (typeof window === "undefined") return;
  const { animate, eases } = await import("animejs");
  const opts = { ...defaultEnterAnimation, ...options };
  animate(target, {
    translateY: [opts.distance, 0],
    opacity: [opts.opacityFrom, 1],
    duration: opts.duration,
    delay: opts.delay,
    ease: eases.outCubic,
  });
}

export async function animateStaggerChildren(
  containerSelector: AnimeTarget,
  childSelector: string,
  options: EnterAnimationOptions & { stagger?: number } = {}
) : Promise<void> {
  if (typeof window === "undefined") return;
  const { animate, eases, stagger } = await import("animejs");
  const { stagger: staggerMs = 80, ...rest } = options;
  const opts = { ...defaultEnterAnimation, ...rest };
  animate(`${containerSelector} ${childSelector}`, {
    translateY: [opts.distance, 0],
    opacity: [opts.opacityFrom, 1],
    duration: opts.duration,
    delay: stagger(staggerMs),
    ease: eases.outCubic,
  });
}

export async function animateElement(
  element: Element,
  options: Partial<{ translateY: [number, number]; opacity: [number, number]; duration: number; delay: number }>
): Promise<void> {
  if (typeof window === "undefined") return;
  const { animate, eases } = await import("animejs");
  animate(element, {
    duration: 450,
    ease: eases.outCubic,
    ...options,
  });
}


