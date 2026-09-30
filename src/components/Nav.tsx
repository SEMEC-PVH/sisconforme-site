"use client";

import { type PointerEvent, type SyntheticEvent, useRef } from "react";
import { useScrollFrame } from "@/lib/scroll";
import BrandMark from "./BrandMark";
import styles from "./Nav.module.css";

/** Luminância relativa (0 = preto, 1 = branco) de uma cor `rgb(a)` computada. */
function luminancia(cor: string): number | null {
  const m = cor.match(/[\d.]+/g);
  if (!m || m.length < 3) return null;
  if (m.length >= 4 && parseFloat(m[3]) < 0.5) return null; // quase transparente: olha a camada de baixo
  const [r, g, b] = m.slice(0, 3).map((v) => {
    const c = parseFloat(v) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** O que está atrás do vidro é escuro? Olha as camadas sob o centro da barra, de cima para baixo. */
function fundoEscuro(nav: HTMLElement): boolean {
  const r = nav.getBoundingClientRect();
  const camadas = document.elementsFromPoint(window.innerWidth / 2, r.top + r.height / 2);
  for (const el of camadas) {
    if (nav.contains(el)) continue;
    if (el instanceof HTMLImageElement || el instanceof HTMLVideoElement) return true; // fotos do hero
    const l = luminancia(getComputedStyle(el).backgroundColor);
    if (l !== null) return l < 0.35;
  }
  return false;
}

export default function Nav() {
  const ref = useRef<HTMLElement>(null);
  const vidroRef = useRef<HTMLDivElement>(null);
  const listaRef = useRef<HTMLUListElement>(null);

  useScrollFrame(() => {
    const nav = ref.current;
    if (!nav) return;
    nav.classList.toggle(styles.escuro, fundoEscuro(nav));
    nav.classList.toggle(styles.rolou, window.scrollY > 8);
  });

  /** Recomeça a montagem da logo (a classe sai e volta para a animação CSS rodar de novo). */
  const remontar = (e: SyntheticEvent<HTMLAnchorElement>) => {
    const logo = e.currentTarget;
    logo.classList.remove(styles.monta);
    void logo.offsetWidth;
    logo.classList.add(styles.monta);
  };

  /** Brilho do vidro acompanha o ponteiro. */
  const moverBrilho = (e: PointerEvent<HTMLDivElement>) => {
    const vidro = vidroRef.current;
    if (!vidro) return;
    const r = vidro.getBoundingClientRect();
    vidro.style.setProperty("--mx", `${e.clientX - r.left}px`);
    vidro.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  /** A pílula de vidro desliza até o link sob o ponteiro ou em foco. */
  const marcar = (e: SyntheticEvent<HTMLAnchorElement>) => {
    const lista = listaRef.current;
    if (!lista) return;
    const a = e.currentTarget.getBoundingClientRect();
    const l = lista.getBoundingClientRect();
    lista.style.setProperty("--px", `${a.left - l.left}px`);
    lista.style.setProperty("--pw", `${a.width}px`);
    lista.classList.add(styles.comPilula);
  };
  const soltar = () => listaRef.current?.classList.remove(styles.comPilula);

  const links = [
    { href: "#introducao", txt: "Portal", dd: true },
    { href: "#seguranca", txt: "Privacidade" },
    { href: "#cruzamento", txt: "Legislação", dd: true },
    { href: "#comunicacao", txt: "Ajuda", dd: true },
    { href: "#disponibilidade", txt: "Novidades" },
  ];

  return (
    <header className={styles.nav} ref={ref}>
      <div className={styles.vidro} ref={vidroRef} onPointerMove={moverBrilho}>
        <a
          className={`${styles.logo} ${styles.monta}`}
          href="#top"
          aria-label="SISConforme, início"
          onMouseEnter={remontar}
          onFocus={remontar}
        >
          <BrandMark size={28} />
          <span className={styles.nome}>SISConforme</span>
        </a>
        <ul ref={listaRef} onMouseLeave={soltar} onBlur={soltar}>
          {links.map((l) => (
            <li key={l.txt}>
              <a className={l.dd ? styles.dd : undefined} href={l.href} onMouseEnter={marcar} onFocus={marcar}>
                {l.txt}
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.split}>
          <a href="#disponibilidade">Acessar portal</a>
          <span aria-hidden="true"></span>
        </div>
      </div>
    </header>
  );
}
