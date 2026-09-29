"use client";

import { type SyntheticEvent, useRef } from "react";
import { useScrollFrame } from "@/lib/scroll";
import BrandMark from "./BrandMark";
import styles from "./Nav.module.css";

export default function Nav() {
  const ref = useRef<HTMLElement>(null);

  useScrollFrame(() => {
    const topo = document.getElementById("top");
    const nav = ref.current;
    if (!topo || !nav) return;
    nav.classList.toggle(styles.solid, topo.getBoundingClientRect().bottom < 70);
  });

  /** Recomeça a montagem da logo (a classe sai e volta para a animação CSS rodar de novo). */
  const remontar = (e: SyntheticEvent<HTMLAnchorElement>) => {
    const logo = e.currentTarget;
    logo.classList.remove(styles.monta);
    void logo.offsetWidth;
    logo.classList.add(styles.monta);
  };

  return (
    <header className={styles.nav} ref={ref}>
      <div className={styles.navIn}>
        <a
          className={`${styles.logo} ${styles.monta}`}
          href="#top"
          aria-label="SISConforme, início"
          onMouseEnter={remontar}
          onFocus={remontar}
        >
          <BrandMark size={30} />
          <span className={styles.nome}>SISConforme</span>
        </a>
        <ul>
          <li>
            <a className={styles.dd} href="#introducao">
              Portal
            </a>
          </li>
          <li>
            <a href="#seguranca">Privacidade</a>
          </li>
          <li>
            <a className={styles.dd} href="#cruzamento">
              Legislação
            </a>
          </li>
          <li>
            <a className={styles.dd} href="#comunicacao">
              Ajuda
            </a>
          </li>
          <li>
            <a href="#disponibilidade">Novidades</a>
          </li>
        </ul>
        <div className={styles.split}>
          <a href="#disponibilidade">Acessar portal</a>
          <span aria-hidden="true"></span>
        </div>
      </div>
    </header>
  );
}
