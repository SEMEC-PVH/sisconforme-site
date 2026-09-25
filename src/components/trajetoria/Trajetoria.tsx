"use client";

import { Fragment, useEffect, useRef } from "react";
import { progressoDoScroll } from "@/lib/scroll";
import {
  claridade,
  contorno,
  curva,
  deslocamento,
  FRASES,
  fraseAtiva,
  fusao,
  larguraAperto,
  LEGENDA,
  onda,
  presencaMaos,
  progressoAperto,
  QUADROS_APERTO,
  quadroAperto,
  TEXTO_CORRIDO,
  TITULO,
  visibilidade,
} from "./roteiro";
import styles from "./Trajetoria.module.css";

const dois = (n: number) => String(n).padStart(2, "0");

/** Quebra o texto em palavras (que não se partem) e letras (que ondulam). */
function Letras({ texto }: Readonly<{ texto: string }>) {
  const palavras = texto.split(" ");
  return (
    <>
      {palavras.map((palavra, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span className={styles.palavra}>
            {[...palavra].map((c, j) => (
              <span key={j} className={styles.ch} data-ch="">
                {c}
              </span>
            ))}
          </span>
        </Fragment>
      ))}
    </>
  );
}

function ondular(letras: HTMLElement[], amplitude: number, fase: number) {
  letras.forEach((l, i) => {
    const { y, r } = onda(i, amplitude, fase);
    l.style.transform = `translateY(${y.toFixed(2)}px) rotate(${r.toFixed(2)}deg)`;
  });
}

/**
 * "Uma nova relação": título que ondula ao entrar na tela e uma sequência fixa em que as frases
 * sobem, o fundo clareia em "Hoje", as mãos do auditor e da empresa se aproximam (quadros de um
 * vídeo, escolhidos pela rolagem) e se apertam sobre o fundo marfim em "os dois.". Com "reduzir movimento", vira um bloco estático (só CSS).
 */
export default function Trajetoria() {
  const secRef = useRef<HTMLElement>(null);
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const palcoRef = useRef<HTMLDivElement>(null);
  const inundacaoRef = useRef<HTMLDivElement>(null);
  const maosRef = useRef<HTMLDivElement>(null);
  const maosCanvasRef = useRef<HTMLCanvasElement>(null);
  const frasesRef = useRef<HTMLDivElement>(null);
  const legendaRef = useRef<HTMLParagraphElement>(null);
  const marcasRef = useRef<HTMLDivElement>(null);
  const contadorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const sec = secRef.current;
    const titulo = tituloRef.current;
    const pin = pinRef.current;
    const palco = palcoRef.current;
    const inundacao = inundacaoRef.current;
    const maos = maosRef.current;
    const maosCanvas = maosCanvasRef.current;
    const frasesWrap = frasesRef.current;
    const legenda = legendaRef.current;
    const marcasWrap = marcasRef.current;
    const contador = contadorRef.current;
    if (!sec || !titulo || !pin || !palco || !inundacao || !maos || !maosCanvas) return;
    if (!frasesWrap || !legenda || !marcasWrap || !contador) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const frases = [...frasesWrap.children] as HTMLElement[];
    const letrasFrase = frases.map((f) => [...f.querySelectorAll<HTMLElement>("[data-ch]")]);
    const letrasTitulo = [...titulo.querySelectorAll<HTMLElement>("[data-ch]")];
    const marcas = [...marcasWrap.children] as HTMLElement[];
    const rotulosMaos = [...maos.querySelectorAll<HTMLElement>(`.${styles.rotulo}`)];
    const ctxMaos = maosCanvas.getContext("2d");

    // quadros do aperto de mãos: carregam só quando a seção chega perto da tela
    const quadros: HTMLImageElement[] = [];
    let quadrosPedidos = false;
    let quadroDesenhado = -1;
    const carregarQuadros = () => {
      if (quadrosPedidos) return;
      quadrosPedidos = true;
      // a resolução é decidida uma vez, pelo tamanho da tela na hora de carregar
      const largura = larguraAperto(maos.clientWidth, window.devicePixelRatio || 1);
      maosCanvas.width = largura;
      maosCanvas.height = Math.round((largura * 387) / 1280);
      for (let i = 0; i < QUADROS_APERTO; i++) {
        const img = new Image();
        img.decoding = "async";
        img.src = quadroAperto(i, largura);
        quadros.push(img);
      }
    };
    /** Desenha o quadro pedido ou, enquanto ele carrega, o mais próximo já pronto. */
    const desenharMaos = (alvo: number) => {
      if (!ctxMaos) return;
      for (let d = 0; d < QUADROS_APERTO; d++) {
        for (const k of [alvo - d, alvo + d]) {
          const img = quadros[k];
          if (img?.complete && img.naturalWidth) {
            if (k !== quadroDesenhado) {
              ctxMaos.clearRect(0, 0, maosCanvas.width, maosCanvas.height);
              ctxMaos.drawImage(img, 0, 0, maosCanvas.width, maosCanvas.height);
              quadroDesenhado = k;
            }
            return;
          }
        }
      }
    };

    let atual = progressoDoScroll(pin);
    let ativaAnterior = -1;
    let raf = 0;
    let visivel = false;
    const t0 = performance.now();

    const quadro = (agora: number) => {
      const alvo = progressoDoScroll(pin);
      atual += (alvo - atual) * 0.12;
      if (Math.abs(alvo - atual) < 1e-4) atual = alvo;
      const p = atual;
      const t = (agora - t0) / 1000;
      const vw = palco.clientWidth;
      const vh = palco.clientHeight;

      // título: ondula enquanto está longe do centro da tela
      const r = titulo.getBoundingClientRect();
      const d = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      ondular(letrasTitulo, Math.min(1, Math.abs(d) * 1.6 + 0.12) * Math.min(56, vw * 0.06), d * 5 + t * 0.8);

      // fundo claro sobe de baixo para cima em "Hoje"
      const luz = claridade(p);
      inundacao.style.clipPath = `inset(${((1 - luz) * 100).toFixed(2)}% 0 0 0)`;

      const m = fusao(p);
      const c = contorno(p);

      frases.forEach((el, k) => {
        const x = deslocamento(k, p);
        const vis = visibilidade(x);
        el.style.transform = `translateY(calc(-50% + ${(curva(x) * vh * 0.62).toFixed(1)}px))`;
        el.style.opacity = vis.toFixed(3);
        el.style.visibility = vis <= 0 ? "hidden" : "visible";
        if (vis > 0) ondular(letrasFrase[k], Math.min(Math.abs(x), 1) * Math.min(44, vw * 0.045), x * 4 + t * 0.6);
      });
      // enquanto o marfim sobe, o texto inverte com o fundo; depois fica em tinta (sem brigar com as mãos)
      frasesWrap.classList.toggle(styles.mistura, luz < 0.999);
      legenda.style.opacity = c.toFixed(3);

      // aperto de mãos: a rolagem escolhe o quadro do vídeo
      const presenca = presencaMaos(p);
      maos.style.opacity = presenca.toFixed(3);
      if (presenca > 0) desenharMaos(Math.round(progressoAperto(p) * (QUADROS_APERTO - 1)));
      // os nomes só aparecem em "os dois.", para não brigar com "o SISConforme une"
      rotulosMaos.forEach((r) => (r.style.opacity = m.toFixed(3)));

      palco.classList.toggle(styles.claro, luz > 0.5);
      const ativa = fraseAtiva(p);
      if (ativa !== ativaAnterior) {
        marcas.forEach((mk, i) => mk.classList.toggle(styles.marcaAtiva, i === ativa));
        contador.textContent = `${dois(ativa + 1)} / ${dois(FRASES.length)}`;
        ativaAnterior = ativa;
      }

      if (visivel) raf = requestAnimationFrame(quadro);
    };

    // só anima enquanto a seção está perto da tela
    const observador = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !visivel) {
          visivel = true;
          carregarQuadros();
          raf = requestAnimationFrame(quadro);
        } else if (!e.isIntersecting) {
          visivel = false;
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: "25% 0px" },
    );
    observador.observe(sec);

    return () => {
      observador.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className={styles.secao} id="nova-relacao" ref={secRef} aria-labelledby="nova-relacao-titulo">
      <div className={styles.entrada}>
        <h2 className={styles.titulo} id="nova-relacao-titulo" ref={tituloRef} aria-label={TITULO}>
          <span aria-hidden="true">
            <Letras texto={TITULO} />
          </span>
        </h2>
      </div>

      <p className={styles.leitor}>{TEXTO_CORRIDO}</p>

      <div className={styles.pin} ref={pinRef} aria-hidden="true">
        <div className={styles.palco} ref={palcoRef}>
          <div className={styles.inundacao} ref={inundacaoRef} />
          <div className={styles.maos} ref={maosRef}>
            <canvas className={styles.maosCanvas} ref={maosCanvasRef} width={1280} height={387} />
            {/* com "reduzir movimento" aparece só o aperto já fechado */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.maosEstatico}
              src={quadroAperto(QUADROS_APERTO - 1, 1280)}
              srcSet={`${quadroAperto(QUADROS_APERTO - 1, 1280)} 1280w, ${quadroAperto(QUADROS_APERTO - 1, 2560)} 2560w`}
              sizes="max(104vw, 560px)"
              alt=""
              width={1280}
              height={387}
              loading="lazy"
            />
            <span className={`${styles.rotulo} ${styles.rotuloFisco}`}>Auditor fiscal</span>
            <span className={`${styles.rotulo} ${styles.rotuloEmpresa}`}>Empresa</span>
          </div>

          <div className={`${styles.frases} ${styles.mistura}`} ref={frasesRef}>
            {FRASES.map((f, k) => (
              <p key={k} className={styles.frase}>
                {f.linhas.map((linha, j) => (
                  <span key={j} className={styles.linha}>
                    <span className={styles.texto}>
                      <Letras texto={linha} />
                    </span>
                  </span>
                ))}
              </p>
            ))}
          </div>
          <p className={styles.legenda} ref={legendaRef}>
            {LEGENDA}
          </p>

          <div className={styles.marcas} ref={marcasRef}>
            {FRASES.map((_, k) => (
              <i key={k} className={`${styles.marca} ${k === 0 ? styles.marcaAtiva : ""}`} />
            ))}
          </div>
          <span className={styles.contador} ref={contadorRef}>
            {`01 / ${dois(FRASES.length)}`}
          </span>
        </div>
      </div>
    </section>
  );
}
