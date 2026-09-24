"use client";

import { useEffect, useRef } from "react";
import type { Visualizador } from "./visualizador";
import styles from "./SedeEm3D.module.css";

/** Começa a carregar o 3D quando a seção está a esta distância da tela. */
const ANTECEDENCIA = "600px 0px";

function webglDisponivel(): boolean {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

/**
 * Seção "Conheça a sede": o prédio em 3D, que a pessoa gira arrastando.
 * Até o 3D carregar (ou se o navegador não suportar), aparece uma imagem do prédio.
 * O estado fica em `data-estado` no palco: imagem → carregando → pronto | indisponivel.
 */
export default function SedeEm3D() {
  const palcoRef = useRef<HTMLDivElement>(null);
  const visualizador = useRef<Visualizador | null>(null);

  useEffect(() => {
    const palco = palcoRef.current;
    if (!palco) return;
    if (!webglDisponivel()) {
      palco.dataset.estado = "indisponivel";
      return;
    }
    let desmontado = false;
    const observador = new IntersectionObserver(
      async ([entrada]) => {
        if (!entrada.isIntersecting) return;
        observador.disconnect();
        palco.dataset.estado = "carregando";
        const { criarVisualizador } = await import("./visualizador");
        if (desmontado) return;
        visualizador.current = criarVisualizador(palco, {
          url: "/models/sede.glb",
          girarSozinho: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
          aoCarregar: () => (palco.dataset.estado = "pronto"),
          aoFalhar: () => (palco.dataset.estado = "indisponivel"),
          aoMover: (azimute, distancia) => {
            palco.dataset.azimute = azimute.toFixed(1);
            palco.dataset.distancia = distancia.toFixed(2);
          },
        });
      },
      { rootMargin: ANTECEDENCIA },
    );
    observador.observe(palco);
    return () => {
      desmontado = true;
      observador.disconnect();
      visualizador.current?.destruir();
      visualizador.current = null;
    };
  }, []);

  return (
    <section className={styles.sede} id="sede" aria-labelledby="sede-titulo">
      <div className="col">
        <h2 id="sede-titulo">Conheça a sede</h2>
        <p>
          O SISConforme é operado pela Secretaria, a partir da sua sede em Porto Velho. Arraste para girar o prédio e
          conhecê-lo por todos os lados.
        </p>
      </div>
      <div className="wide block" data-revelar>
        <div
          ref={palcoRef}
          className={styles.palco}
          data-palco
          data-estado="imagem"
          role="img"
          aria-label="Modelo 3D do prédio da sede da Secretaria, em Porto Velho"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- imagem estática de reserva, sem otimização (export estático) */}
          <img className={styles.imagem} src="/img/sede/predio.png" alt="" width={1600} height={1000} />
        </div>
        <div className={styles.controles}>
          <span className={styles.dica}>Arraste para girar</span>
          <div className={styles.botoes}>
            <button type="button" aria-label="Aproximar" onClick={() => visualizador.current?.aproximar()}>
              +
            </button>
            <button type="button" aria-label="Afastar" onClick={() => visualizador.current?.afastar()}>
              −
            </button>
            <button type="button" onClick={() => visualizador.current?.voltarAoInicio()}>
              Voltar à vista inicial
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
