"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { aoMudarPreferencia, preferenciaLigada } from "./preferencias";

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

/** Animações em laço infinito (enfeites que voltam sozinhos). Param quando a pessoa pede "Pausar animações". */
const lacos = new Set<gsap.core.Animation>();

/** Registra um laço: com a pausa ligada ele termina a volta atual e para; ao retomar, volta a girar. */
export function emLaco<T extends gsap.core.Animation>(anim: T): T {
  lacos.add(anim);
  anim.eventCallback("onInterrupt", () => lacos.delete(anim));
  if (preferenciaLigada("pausado")) anim.repeat(0);
  return anim;
}

if (typeof window !== "undefined") {
  aoMudarPreferencia((p, ligada) => {
    if (p !== "pausado") return;
    lacos.forEach((a) => {
      a.repeat(ligada ? 0 : -1);
      // um laço que já parou recomeça; os pausados de propósito (fora da tela) seguem pausados
      if (!ligada && a.progress() === 1 && !a.paused()) a.restart(true);
    });
  });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
