"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/** Só anima quem não pediu movimento reduzido ao sistema. */
export const COM_MOVIMENTO = "(prefers-reduced-motion: no-preference)";

/**
 * Toca `anim` uma única vez quando `trigger` cruza `start`.
 *
 * Use isto em vez de `scrollTrigger: { once: true }` dentro de um tween/timeline. Esse trigger embutido só fica
 * pronto um tick depois; se outro ScrollTrigger for criado nesse meio-tempo (ex.: o batch do RevelarAoRolar, que roda
 * depois dos filhos), o GSAP força o refresh dos pendentes — e os que já passaram da tela disparam, se matam no meio do
 * laço e ele quebra com "Cannot read properties of undefined (reading 'end')". `ScrollTrigger.create` fica pronto na hora.
 */
export function aoEntrar(trigger: Element | null | undefined, anim: gsap.core.Animation, start = "top 85%") {
  anim.pause();
  if (!trigger) return;
  ScrollTrigger.create({ trigger, start, once: true, onEnter: () => anim.play() });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
