"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { clamp, easeOutCubic, seg, useScrollFrame } from "@/lib/scroll";
import styles from "./Hero.module.css";

export default function Hero() {
  const introRef = useRef<HTMLElement>(null);
  const pcRef = useRef<HTMLDivElement>(null);
  const introducingRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const reduzir = useRef(false);

  useEffect(() => {
    reduzir.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useScrollFrame(() => {
    const intro = introRef.current,
      pc = pcRef.current,
      a1 = introducingRef.current,
      tb = titleRef.current,
      hint = hintRef.current;
    if (!intro || !pc || !a1 || !tb || !hint) return;
    const rect = intro.getBoundingClientRect(),
      vh = window.innerHeight;
    let p = clamp(-rect.top / (rect.height - vh));
    if (reduzir.current) p = Math.max(p, 0.6);
    const estreito = window.innerWidth < 700;
    const inicio = estreito ? 62 : 42,
      fim = estreito ? 100 : 85;
    pc.style.setProperty("--cw", inicio + (fim - inicio) * easeOutCubic(seg(p, 0, 0.55)) + "%");
    const a = seg(p, 0.08, 0.22);
    a1.style.opacity = String(1 - a);
    a1.style.transform = `translateY(${-a * 30}px)`;
    const b = easeOutCubic(seg(p, 0.22, 0.5));
    tb.style.opacity = String(b);
    tb.style.transform = `translateY(${(1 - b) * 40}px) scale(${0.96 + 0.04 * b})`;
    tb.style.visibility = b < 0.02 ? "hidden" : "visible";
    hint.style.opacity = String(1 - seg(p, 0, 0.1));
  });

  return (
    <section className={styles.intro} id="top" ref={introRef}>
      <div className={styles.stage}>
        <div className={styles.panel}>
          <Image
            src="/img/hero/hero-esquerda.webp"
            alt="Ilustração das Três Caixas d'Água de Porto Velho sobre papel amarelo"
            width={1024}
            height={1536}
            loading="eager"
            style={{ objectPosition: "50% 40%" }}
          />
        </div>
        <div className={`${styles.panel} ${styles.c}`} ref={pcRef}>
          <Image
            src="/img/hero/hero-centro.webp"
            alt="Pôr do sol sobre o Rio Madeira, em Porto Velho"
            width={1672}
            height={941}
            loading="eager"
            fetchPriority="high"
          />
          <div className={styles.heroCopy}>
            <p className={styles.introducing} ref={introducingRef}>
              Apresentando
            </p>
            <div className={styles.titleblock} ref={titleRef}>
              <p className={styles.date}>23 de setembro de 2026</p>
              <h1>SISConforme</h1>
              <ol className={styles.toc}>
                <li>
                  <a href="#introducao">
                    <span className={styles.n}>(1)</span>
                    <span className={styles.dots}></span>
                    <span className={styles.t}>Introdução</span>
                  </a>
                </li>
                <li>
                  <a href="#cruzamento">
                    <span className={styles.n}>(2)</span>
                    <span className={styles.dots}></span>
                    <span className={styles.t}>Cruzamento e custo</span>
                  </a>
                </li>
                <li>
                  <a href="#seguranca">
                    <span className={styles.n}>(3)</span>
                    <span className={styles.dots}></span>
                    <span className={styles.t}>Segurança</span>
                  </a>
                </li>
                <li>
                  <a href="#disponibilidade">
                    <span className={styles.n}>(4)</span>
                    <span className={styles.dots}></span>
                    <span className={styles.t}>Disponibilidade</span>
                  </a>
                </li>
              </ol>
            </div>
          </div>
          <p className={styles.hint} ref={hintRef}>
            Role para baixo
          </p>
        </div>
        <div className={styles.panel}>
          <Image
            src="/img/hero/hero-direita.webp"
            alt="Detalhe de uma locomotiva da Estrada de Ferro Madeira-Mamoré"
            width={1024}
            height={1536}
            loading="eager"
            style={{ objectPosition: "25% 50%" }}
          />
        </div>
      </div>
    </section>
  );
}
