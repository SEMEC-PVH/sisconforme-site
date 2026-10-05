"use client";

import {
  BRANCO, LINHA_FINA, TINTA, S, aperto, avaliar, cameraECursor, clamp, construir, fade, janela, num, pegar, pintar,
  type Geo,
} from "./motion";
import Palco, { Check, Icone } from "./Palco";

/* Card 01 · Acesso seguro: a empresa entra só pela conta gov.br (loop de 12 s, 120 BPM). */
const T = 12;
/* o cursor para no alvo pelo menos 1 s antes; a forma muda exatamente no aperto */
const CLK = { botao: 2.0, continuar: 6.0 };
const BOTAO = { l: 220, r: 1220, top: 630, bot: 810, rad: 90, bg: TINTA, bc: TINTA, bw: 0 };

const TB = construir([
  { t: 0, set: BOTAO },
  { t: CLK.botao, set: { top: 630, bot: 810, l: 630, r: 810, rad: 90, bg: BRANCO, bc: TINTA, bw: 3 } }, // loader
  { t: 3.0, set: { l: 220, r: 1220, top: 650, bot: 790, rad: 70 } },                                    // check
  { t: 4.0, set: { top: 520, bot: 920, rad: 40, bc: LINHA_FINA } },                                      // conta
  { t: CLK.continuar, set: { top: 640, bot: 800, rad: 80, bg: TINTA, bc: TINTA, bw: 0 } },              // pílula final
  { t: 8.0, set: BOTAO },
]);
const TC = construir(
  [
    { t: 0, set: { x: 1130, y: 1150 } },
    { t: 0.4, set: { x: 860, y: 760 } },  // alvo: botão      (clique 2.0)
    { t: 2.4, set: { x: 1080, y: 990 } },
    { t: 4.6, set: { x: 1025, y: 835 } }, // alvo: Continuar  (clique 6.0)
    { t: 6.4, set: { x: 1130, y: 1150 } },
  ],
  "cursor",
);
const CLIQUES = Object.values(CLK);
const CONTEUDO: [string, number, number, number?][] = [
  ["botao", -1, CLK.botao, 8.3],
  ["spin", CLK.botao + 0.3, 3.0],
  ["check", 3.25, 4.0],
  ["conta", 4.3, CLK.continuar],
  ["final", CLK.continuar + 0.3, 8.0],
];

function criar(raiz: HTMLElement) {
  const forma = pegar(raiz, "forma");
  const partes = { cam: pegar(raiz, "cam"), cursor: pegar(raiz, "cursor"), ripple: pegar(raiz, "ripple") };
  const itens = CONTEUDO.map(([n, a, b, a2]) => ({ el: pegar(raiz, n), a, b, a2 }));
  const cks = [pegar(raiz, "ck-check"), pegar(raiz, "ck-final")];
  const arcos = raiz.querySelectorAll<SVGElement>("[data-m='arco']");

  return (tempo: number) => {
    const t = ((tempo % T) + T) % T;
    pintar(forma, avaliar<Geo>(TB, t), 1 - 0.04 * CLIQUES.reduce((s, c) => s + aperto(t, c), 0));
    for (const c of itens) fade(c.el, clamp(janela(t, c.a, c.b) + (c.a2 ? S(t, c.a2) : 0)));
    cks[0].setAttribute("stroke-dashoffset", (1 - clamp(S(t, 3.35, "ck"))).toFixed(4));
    cks[1].setAttribute("stroke-dashoffset", (1 - clamp(S(t, CLK.continuar + 0.4, "ck"))).toFixed(4));
    arcos.forEach((a) => (a.style.transform = `rotate(${(t * 420) % 360}deg)`));
    cameraECursor(partes, t, num(TC, "x", t), num(TC, "y", t), CLIQUES);
  };
}

function Spinner() {
  return (
    <svg viewBox="0 0 100 100" width="96" height="96" aria-hidden="true">
      <circle cx="50" cy="50" r="38" fill="none" stroke="#DEDBD2" strokeWidth={8} />
      <circle
        data-m="arco"
        cx="50" cy="50" r="38" fill="none" stroke="#141413" strokeWidth={8} strokeLinecap="round"
        pathLength={1} strokeDasharray="0.28 0.72" style={{ transformOrigin: "50px 50px" }}
      />
    </svg>
  );
}

export default function MotionGovBr() {
  return (
    <Palco duracao={T} cena="govbr" criar={criar} parado={6.8} rotulo="Animação: a empresa entra no SISConforme somente pela conta gov.br">
      <div className="forma" data-m="forma">
        <div className="c" data-m="botao" style={{ color: "#fff", fontSize: 46, fontWeight: 600, gap: 18 }}>
          <Icone nome="pessoa" />
          <span>Entrar com gov.br</span>
          <span style={{ fontWeight: 400, opacity: 0.72 }}>· Login Único</span>
        </div>
        <div className="c" data-m="spin"><Spinner /></div>
        <div className="c" data-m="check" style={{ fontSize: 48, fontWeight: 600 }}>
          <Check tamanho={64} m="ck-check" />
          <span>Identidade confirmada</span>
        </div>
        <div className="c" data-m="conta">
          <div className="conta">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 28, color: "#6F6D66", fontWeight: 500 }}>
                <span style={{ color: "#141413", display: "flex" }}><Icone nome="pessoa" tamanho={44} /></span>
                Conta gov.br · Login Único
              </div>
              <div style={{ fontSize: 46, fontWeight: 600, letterSpacing: "-.015em" }}>Maria Exemplo</div>
              <div className="tab" style={{ fontSize: 30, color: "#3D3D3A" }}>CPF •••.000.000-•• · Empresa Exemplo Ltda</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="tab" style={{ fontSize: 28, color: "#6F6D66" }}>CNPJ 00.000.000/0001-00</span>
              <span style={{ background: "#141413", color: "#fff", fontSize: 32, fontWeight: 600, padding: "0 40px", height: 80, borderRadius: 40, display: "flex", alignItems: "center" }}>
                Continuar
              </span>
            </div>
          </div>
        </div>
        <div className="c" data-m="final" style={{ color: "#fff", fontSize: 46, fontWeight: 600, gap: 20 }}>
          <Check tamanho={60} m="ck-final" />
          <span>Acesso por identidade verificada</span>
        </div>
      </div>
    </Palco>
  );
}
