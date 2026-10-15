"use client";

import { useRef } from "react";
import { aoEntrar, COM_MOVIMENTO, gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Textos e blocos do artigo que surgem com um leve deslize ao entrar na tela.
 * Blocos que não são texto marcam-se com `data-revelar` (gráfico, carrossel, comparativo).
 */
const REVELAVEIS = ".col > p, .col > h2, .col > h3, .caption, .tabs, [data-revelar]";

/** Envolve o <article> e dá às seções de conteúdo a entrada "suave" (uma vez por elemento). */
export default function RevelarAoRolar({ children }: Readonly<{ children: React.ReactNode }>) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const artigo = ref.current;
      if (!artigo) return;
      const mm = gsap.matchMedia();
      mm.add(COM_MOVIMENTO, () => {
        const alvos = artigo.querySelectorAll<HTMLElement>(REVELAVEIS);
        // opacity (e não autoAlpha/visibility): o que ainda não apareceu continua na ordem do Tab; ao receber foco
        // o navegador rola até ele e o ScrollTrigger revela
        gsap.set(alvos, { opacity: 0, y: 24 });
        ScrollTrigger.batch(alvos, {
          start: "top 88%",
          once: true,
          onEnter: (grupo) =>
            gsap.to(grupo, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.08, overwrite: true }),
        });

        const tabela = artigo.querySelector("table");
        if (tabela) {
          aoEntrar(
            tabela,
            gsap.from(tabela.querySelectorAll("tbody tr"), { opacity: 0, y: 16, duration: 0.5, ease: "power2.out", stagger: 0.1 }),
            "top 80%",
          );
        }
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <article ref={ref} className="prose">
      {children}
    </article>
  );
}
