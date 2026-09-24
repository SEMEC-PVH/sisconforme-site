"use client";

import { useRef } from "react";
import { useScrollFrame } from "@/lib/scroll";
import styles from "./SideNav.module.css";

const IDS = ["introducao", "cruzamento", "seguranca", "disponibilidade"];

export default function SideNav() {
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  useScrollFrame(() => {
    const topo = document.getElementById("top");
    const nav = navRef.current;
    if (!topo || !nav) return;
    nav.classList.toggle(styles.on, topo.getBoundingClientRect().bottom < 70);

    const vh = window.innerHeight;
    let atual = 0;
    IDS.forEach((id, i) => {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top < vh * 0.4) atual = i;
    });
    linkRefs.current.forEach((link, i) => {
      link?.classList.toggle(styles.active, i === atual);
    });
  });

  return (
    <nav className={styles.side} ref={navRef} aria-label="Seções">
      <a href="#introducao" ref={(el) => { linkRefs.current[0] = el; }}>
        <i></i>
        <span>Introdução</span>
      </a>
      <a href="#cruzamento" ref={(el) => { linkRefs.current[1] = el; }}>
        <i></i>
        <span>Cruzamento e custo</span>
      </a>
      <a href="#seguranca" ref={(el) => { linkRefs.current[2] = el; }}>
        <i></i>
        <span>Segurança</span>
      </a>
      <a href="#disponibilidade" ref={(el) => { linkRefs.current[3] = el; }}>
        <i></i>
        <span>Disponibilidade</span>
      </a>
    </nav>
  );
}
