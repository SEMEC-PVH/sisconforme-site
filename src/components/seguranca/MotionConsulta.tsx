"use client";

import { BRANCO, LINHA_FINA, S, aperto, avaliar, cameraECursor, clamp, construir, fade, num, pegar, pintar, type Geo } from "./motion";
import Palco, { Check, Icone } from "./Palco";

/* Card 04 · Somente consulta: a pergunta vira um "Não." e se desdobra em três pontos (loop de 11 s). */
const T = 11;
const CLK = { pergunta: 1.5, nao: 3.5 };
const LINHAS = [4.0, 4.5, 5.0]; // os três pontos entram um por tempo
const FECHA = 8.0;
const PILULA = { l: 220, r: 1220, top: 650, bot: 790, rad: 70, bg: BRANCO, bc: LINHA_FINA, bw: 3 };

const TQ = construir([
  { t: 0, set: PILULA },
  { t: CLK.pergunta, set: { top: 490, bot: 950, rad: 60 } }, // a pergunta abre espaço para o "Não."
  { t: CLK.nao, set: { top: 389, bot: 589, rad: 50 } },      // e o "Não." sobe para dar lugar aos pontos
  { t: FECHA, set: PILULA },
]);
const TR = [0, 1, 2].map((i) =>
  construir([
    { t: 0, set: { l: 220, r: 1220, top: 589, bot: 589, rad: 60, bg: BRANCO, bc: LINHA_FINA, bw: 3 } },
    { t: LINHAS[i], set: { top: 613 + 154 * i, bot: 743 + 154 * i } },
    { t: FECHA, set: { top: 650, bot: 790 } },
  ]),
);
const TC = construir(
  [
    { t: 0, set: { x: 1130, y: 1150 } },
    { t: 0.2, set: { x: 1010, y: 728 } }, // alvo: a pergunta   (clique 1.5)
    { t: 1.9, set: { x: 800, y: 760 } },  // alvo: o "Não."     (clique 3.5)
    { t: 3.9, set: { x: 1130, y: 1150 } },
  ],
  "cursor",
);
const CLIQUES = Object.values(CLK);

function criar(raiz: HTMLElement) {
  const Q = pegar(raiz, "q"), perg = pegar(raiz, "perg"), lado = pegar(raiz, "lado"), nao = pegar(raiz, "nao");
  const R = [0, 1, 2].map((i) => pegar(raiz, `r${i}`)), Rc = [0, 1, 2].map((i) => pegar(raiz, `r${i}c`));
  const ck = pegar(raiz, "ck-r0");
  const partes = { cam: pegar(raiz, "cam"), cursor: pegar(raiz, "cursor"), ripple: pegar(raiz, "ripple") };

  return (tempo: number) => {
    const t = ((tempo % T) + T) % T;
    const sai = clamp(1 - S(t, FECHA - 0.1, "sai")); // os pontos saem rápido antes de recolher
    pintar(Q, avaliar<Geo>(TQ, t), 1 - 0.03 * CLIQUES.reduce((s, c) => s + aperto(t, c), 0));
    R.forEach((el, i) => pintar(el, avaliar<Geo>(TR[i], t), 1, clamp(S(t, LINHAS[i]) * sai)));
    Rc.forEach((el, i) => fade(el, clamp(S(t, LINHAS[i] + 0.2) * sai)));
    ck.setAttribute("stroke-dashoffset", (1 - clamp(S(t, LINHAS[0] + 0.4, "ck"))).toFixed(4));

    // a pergunta sai no aperto; o "Não." entra grande e, no segundo aperto, encolhe para a esquerda
    fade(perg, clamp(1 - S(t, CLK.pergunta) + S(t, FECHA + 0.4)));
    fade(nao, clamp(S(t, CLK.pergunta + 0.2) * sai));
    fade(lado, clamp(S(t, CLK.nao + 0.4) * sai));
    const k = S(t, CLK.nao, "shape");
    const dx = (64 + (nao.offsetWidth * 0.5) / 2 - 500) * k;
    nao.style.transform = `translate(calc(-50% + ${dx.toFixed(2)}px), -50%) scale(${(1 - 0.5 * k).toFixed(4)})`;

    cameraECursor(partes, t, num(TC, "x", t), num(TC, "y", t), CLIQUES);
  };
}

export default function MotionConsulta() {
  return (
    <Palco
      duracao={T}
      criar={criar}
      parado={6.5}
      rotulo="Animação: à pergunta se o sistema pode alterar os dados, a resposta é Não: o portal consulta dados já validados, não altera as bases e alterações seguem no sistema oficial"
    >
      <div className="forma" data-m="r0">
        <div className="c j4" data-m="r0c"><Check tamanho={56} m="ck-r0" /><span>Consulta dados já validados</span></div>
      </div>
      <div className="forma" data-m="r1">
        <div className="c j4" data-m="r1c"><Icone nome="cadeado" tamanho={56} /><span>Não altera as bases consultadas</span></div>
      </div>
      <div className="forma" data-m="r2">
        <div className="c j4" data-m="r2c"><Icone nome="saida" tamanho={56} /><span>Emissão e alteração: sistema oficial</span></div>
      </div>
      <div className="forma" data-m="q">
        <div className="c" data-m="perg" style={{ fontSize: 46, fontWeight: 600, letterSpacing: "-.015em" }}>
          O sistema pode alterar os dados?
        </div>
        <div className="c" data-m="lado" style={{ justifyContent: "flex-end", paddingRight: 64, fontSize: 38, color: "#6F6D66" }}>
          O portal só consulta
        </div>
        <b className="nao" data-m="nao">Não.</b>
      </div>
    </Palco>
  );
}
