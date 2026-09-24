"use client";

import { useEffect, useEffectEvent } from "react";

export const clamp = (v: number, a = 0, b = 1): number => Math.min(b, Math.max(a, v));

export const seg = (p: number, a: number, b: number): number => clamp((p - a) / (b - a));

/** `ease` do hero (site/index.html, linha 474). */
export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

/** `ease` da história (linha 550). */
export const easeInOutQuad = (t: number): number =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

/** `easeIn` da história (linha 550). */
export const easeInCubic = (t: number): number => t * t * t;

/** `back` da história (linha 551). */
export const easeOutBack = (t: number): number => {
  const c = 1.70158;
  const c3 = c + 1;
  return t <= 0 ? 0 : 1 + c3 * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};

/** Quanto de uma seção "pinada" já foi rolado: 0 no topo, 1 no fim. */
export function progressoDoScroll(el: HTMLElement): number {
  const r = el.getBoundingClientRect();
  const alcance = r.height - window.innerHeight;
  return alcance <= 0 ? 0 : clamp(-r.top / alcance);
}

/** Chama `onFrame` na montagem e, no máximo uma vez por frame, a cada scroll ou resize. */
export function useScrollFrame(onFrame: () => void): void {
  const tick = useEffectEvent(onFrame);
  useEffect(() => {
    let pendente = false;
    const rodar = () => {
      pendente = false;
      tick();
    };
    const agendar = () => {
      if (!pendente) {
        pendente = true;
        requestAnimationFrame(rodar);
      }
    };
    rodar();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    return () => {
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
    };
  }, []);
}
