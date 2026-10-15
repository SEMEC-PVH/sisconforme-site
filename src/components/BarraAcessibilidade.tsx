"use client";

import Link from "next/link";
import { useEffect } from "react";
import { definirPreferencia, usePreferencia } from "@/lib/preferencias";
import styles from "./BarraAcessibilidade.module.css";

type Props = Readonly<{
  /** Atalhos para esta página; o padrão é o da página inicial. */
  atalhos?: readonly { href: string; txt: string; tecla: string }[];
}>;

const ATALHOS = [
  { href: "#conteudo", txt: "Ir para o conteúdo", tecla: "1" },
  { href: "#menu", txt: "Ir para o menu", tecla: "2" },
  { href: "#rodape", txt: "Ir para o rodapé", tecla: "3" },
] as const;

/** Leva o foco para o destino do atalho (só rolar não basta para quem navega pelo teclado ou leitor de tela). */
function focar(hash: string): boolean {
  const alvo = document.getElementById(hash.slice(1));
  if (!alvo) return false;
  if (!alvo.hasAttribute("tabindex")) alvo.setAttribute("tabindex", "-1");
  alvo.scrollIntoView();
  alvo.focus({ preventScroll: true });
  history.replaceState(null, "", hash);
  return true;
}

function irPara(e: React.MouseEvent<HTMLAnchorElement>) {
  if (focar(e.currentTarget.hash)) e.preventDefault();
}

/**
 * Barra de acessibilidade no padrão do eMAG (governo federal): atalhos de teclado numerados (Alt+1, Alt+2, Alt+3),
 * link para a página de acessibilidade, alto contraste e pausa das animações. Fica no topo e sai ao rolar.
 */
export default function BarraAcessibilidade({ atalhos = ATALHOS }: Props) {
  const contraste = usePreferencia("contraste");
  const pausado = usePreferencia("pausado");

  // o accesskey sozinho varia de navegador para navegador; Alt+número (com ou sem Shift) funciona em todos
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (!e.altKey || e.ctrlKey || e.metaKey) return;
      const a = atalhos.find((x) => e.code === `Digit${x.tecla}` || e.code === `Numpad${x.tecla}`);
      if (a && focar(a.href)) e.preventDefault();
    };
    document.addEventListener("keydown", tecla);
    return () => document.removeEventListener("keydown", tecla);
  }, [atalhos]);

  return (
    <nav className={styles.barra} id="barra-acessibilidade" aria-label="Acessibilidade">
      <div className={styles.dentro}>
        <ul className={styles.atalhos} aria-label="Atalhos de teclado">
          {atalhos.map((a) => (
            <li key={a.tecla}>
              <a href={a.href} accessKey={a.tecla} onClick={irPara}>
                {a.txt} <kbd>{a.tecla}</kbd>
              </a>
            </li>
          ))}
        </ul>
        <ul className={styles.controles} aria-label="Recursos de acessibilidade">
          <li>
            <Link href="/acessibilidade">Acessibilidade</Link>
          </li>
          <li>
            <button type="button" aria-pressed={contraste} onClick={() => definirPreferencia("contraste", !contraste)}>
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 1.5a6.5 6.5 0 0 1 0 13z" fill="currentColor" />
              </svg>
              Alto contraste
            </button>
          </li>
          <li>
            <button type="button" aria-pressed={pausado} onClick={() => definirPreferencia("pausado", !pausado)}>
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                {pausado ? <path d="M4 2.5v11l9-5.5z" fill="currentColor" /> : <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="currentColor" />}
              </svg>
              {pausado ? "Retomar animações" : "Pausar animações"}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
