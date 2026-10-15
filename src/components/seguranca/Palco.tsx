"use client";

import { Geist } from "next/font/google";
import { useEffect, useRef, type ReactNode } from "react";
import styles from "./Motion.module.css";

const geist = Geist({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-geist", display: "swap" });

export type Seek = (t: number) => void;

type Props = Readonly<{
  /** duração do loop, em segundos */
  duracao: number;
  /** monta a animação sobre o palco e devolve seek(t) */
  criar: (raiz: HTMLElement) => Seek;
  /** quadro mostrado a quem pediu movimento reduzido */
  parado: number;
  rotulo: string;
  /** nome do vídeo; sem JS, o CSS usa para montar o quadro estático */
  cena: string;
  children: ReactNode;
}>;

/** Quadro 1440x1440 escalado para a largura do card. Só roda enquanto está na tela. */
export default function Palco({ duracao, criar, parado, rotulo, cena, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raiz = ref.current;
    if (!raiz) return;
    const mundo = raiz.querySelector<HTMLElement>("[data-m='mundo']")!;
    const seek = criar(raiz);

    const ro = new ResizeObserver(() => {
      mundo.style.transform = `scale(${raiz.clientWidth / 1440})`;
    });
    ro.observe(raiz);

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      seek(parado);
      raiz.dataset.pronto = "";
      return () => ro.disconnect();
    }

    // o relógio só anda com o palco visível; o tempo é sempre levado a seek(t), que é puro
    let t = 0, ultimo = 0, raf = 0, visivel = false;
    const passo = (agora: number) => {
      t = (t + (agora - ultimo) / 1000) % duracao;
      ultimo = agora;
      seek(t);
      raf = visivel ? requestAnimationFrame(passo) : 0;
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visivel = e.isIntersecting;
        if (visivel && !raf) {
          ultimo = performance.now();
          raf = requestAnimationFrame(passo);
        }
      },
      { rootMargin: "120px" },
    );
    seek(0);
    raiz.dataset.pronto = "";
    io.observe(raiz);
    return () => {
      ro.disconnect();
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [criar, duracao, parado]);

  return (
    <div ref={ref} className={`${styles.palco} ${geist.variable}`} role="img" aria-label={rotulo} data-cena={cena}>
      <div className="mundo" data-m="mundo">
        <div className="cam" data-m="cam">
          {children}
        </div>
        <span className="ripple" data-m="ripple" />
        <svg className="cursor" data-m="cursor" viewBox="0 0 46 46" aria-hidden="true">
          <path
            d="M5 3 L5 36 L14 28 L20 42 L26 39.5 L20 26 L32 26 Z"
            fill="#141413"
            stroke="#fff"
            strokeWidth={2.6}
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

/* ---------- ícones: mesmo viewBox 48, mesmo traço 3.5; só <path> e <circle> ---------- */
const TRACOS = {
  pessoa: <><circle cx="24" cy="17" r="7.5" /><path d="M9 41c2.2-8.5 8-12.5 15-12.5s12.8 4 15 12.5" /></>,
  predio: <path d="M9 42V9.5A2.5 2.5 0 0 1 11.5 7h17A2.5 2.5 0 0 1 31 9.5V42M31 20h6a2 2 0 0 1 2 2v20M5 42h38M16 15h8M16 23h8M16 31h8" />,
  documento: <><path d="M12 5h17l9 9v27a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" /><path d="M29 5v9h9M17 24h14M17 31h10" /></>,
  cadeado: <path d="M14 21h20a4 4 0 0 1 4 4v13a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V25a4 4 0 0 1 4-4zM16 21v-6a8 8 0 0 1 16 0v6" />,
  saida: <path d="M20 10H10a2 2 0 0 0-2 2v26a2 2 0 0 0 2 2h26a2 2 0 0 0 2-2V28M28 8h12v12M40 8 22 26" />,
};

export function Icone({ nome, tamanho = 52 }: Readonly<{ nome: keyof typeof TRACOS; tamanho?: number }>) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={tamanho}
      height={tamanho}
      fill="none"
      stroke="currentColor"
      strokeWidth={3.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flex: "none" }}
      aria-hidden="true"
    >
      {TRACOS[nome]}
    </svg>
  );
}

/** Check azul; o traço branco se desenha a partir de t (data-m informado). */
export function Check({ tamanho = 56, m }: Readonly<{ tamanho?: number; m?: string }>) {
  return (
    <svg viewBox="0 0 48 48" width={tamanho} height={tamanho} style={{ flex: "none" }} aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="#223F99" />
      <path
        data-m={m}
        d="M14 24.5l6.5 6.5L34 17.5"
        fill="none"
        stroke="#fff"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1 1"
      />
    </svg>
  );
}
