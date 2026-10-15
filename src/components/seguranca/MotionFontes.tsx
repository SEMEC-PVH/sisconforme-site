"use client";

import {
  BRANCO, LINHA_FINA, TINTA, S, aperto, avaliar, cameraECursor, clamp, construir, fade, num, pegar, pintar,
  type Geo,
} from "./motion";
import Palco, { Check } from "./Palco";

/* Card 03 · Dados utilizados: três fontes se juntam numa mesma competência (loop de 12 s). */
const T = 12;
const CLK = [1.5, 3.0, 4.5]; // NFS-e, PGDAS, Cartão e Pix: um clique a cada 3 tempos
const JUNTA = 6.0, DIF = 6.5, FECHA = 8.0, ABRE = 10.0;
const PILULA = { l: 220, r: 1220, top: 650, bot: 790, rt: 70, rb: 70 };
const base = (i: number) => ({ l: 220, r: 1220, top: 470 + 180 * i, bot: 610 + 180 * i, rt: 70, rb: 70, bg: BRANCO, bc: LINHA_FINA, bw: 3 });
const linha = (i: number) => ({ l: 223, r: 1217, top: 520 + 120 * i, bot: 640 + 120 * i, rt: 0, rb: 0, bw: 0 });

const TP = [0, 1, 2].map((i) =>
  construir([
    { t: 0, set: base(i) },
    { t: CLK[i], set: { bc: TINTA } },
    { t: JUNTA, set: linha(i) },
    { t: FECHA, set: PILULA },
    { t: ABRE, set: base(i) },
  ]),
);
const TF = construir([ // moldura da tabela, que vira a pílula final
  { t: 0, set: { l: 220, r: 1220, top: 470, bot: 970, rt: 44, rb: 44, bg: BRANCO, bc: LINHA_FINA, bw: 3 } },
  { t: JUNTA, set: { top: 400, bot: 880 } },
  { t: DIF, set: { bot: 1040 } },
  { t: FECHA, pf: { bg: "sai", bc: "sai" }, set: { ...PILULA, bg: TINTA, bc: TINTA } }, // escurece de uma vez e encolhe
  { t: 11.0, p: "jump", set: { l: 220, r: 1220, top: 470, bot: 970, rt: 44, rb: 44, bg: BRANCO, bc: LINHA_FINA, bw: 3 } },
]);
const TH = construir([ // cabeçalho "Competência 04/2026"
  { t: 0, set: { l: 223, r: 1217, top: 470, bot: 470, rt: 41, rb: 0, bg: BRANCO, bc: LINHA_FINA, bw: 0 } },
  { t: JUNTA, set: { top: 403, bot: 520 } },
  { t: FECHA, set: { ...PILULA, l: 223, r: 1217 } },
  { t: 11.0, p: "jump", set: { top: 470, bot: 470, rt: 41, rb: 0 } },
]);
const TD = construir([ // linha da diferença
  { t: 0, set: { l: 223, r: 1217, top: 880, bot: 880, rt: 0, rb: 41, bg: BRANCO, bc: LINHA_FINA, bw: 0 } },
  { t: DIF, set: { bot: 1037 } },
  { t: FECHA, set: { ...PILULA, l: 223, r: 1217 } },
  { t: 11.0, p: "jump", set: { top: 880, bot: 880, rt: 0, rb: 41 } },
]);
const TC = construir(
  [
    { t: 0, set: { x: 1130, y: 1150 } },
    { t: 0.2, set: { x: 1040, y: 545 } }, // alvo: NFS-e         (clique 1.5)
    { t: 1.8, set: { x: 1040, y: 725 } }, // alvo: PGDAS         (clique 3.0)
    { t: 3.3, set: { x: 1040, y: 905 } }, // alvo: Cartão e Pix  (clique 4.5)
    { t: 4.9, set: { x: 1130, y: 1150 } },
  ],
  "cursor",
);

function criar(raiz: HTMLElement) {
  const F = pegar(raiz, "moldura"), H = pegar(raiz, "cab"), D = pegar(raiz, "dif");
  const fim = pegar(raiz, "fim"), hc = pegar(raiz, "cab-c"), dc = pegar(raiz, "dif-c"), ck = pegar(raiz, "ck-fim");
  const pilulas = [0, 1, 2].map((i) => {
    const el = pegar(raiz, `p${i}`);
    return { el, lab: pegar(el, "rotulo"), vazio: pegar(el, "vazio"), val: pegar(el, "valor") };
  });
  const partes = { cam: pegar(raiz, "cam"), cursor: pegar(raiz, "cursor"), ripple: pegar(raiz, "ripple") };

  return (tempo: number) => {
    const t = ((tempo % T) + T) % T;
    const sai = clamp(1 - S(t, FECHA - 0.1, "sai")); // o que é branco sai rápido antes da pílula escurecer
    pintar(F, avaliar<Geo>(TF, t), 1, clamp(S(t, JUNTA - 0.05) - S(t, ABRE, "sai")));
    pintar(H, avaliar<Geo>(TH, t), 1, clamp(S(t, JUNTA)) * sai);
    pintar(D, avaliar<Geo>(TD, t), 1, clamp(S(t, DIF)) * sai);
    pilulas.forEach((p, i) => {
      pintar(p.el, avaliar<Geo>(TP[i], t), 1 - 0.035 * aperto(t, CLK[i]), clamp(sai + S(t, ABRE)));
      fade(p.lab, clamp(sai + S(t, ABRE + 0.3)));
      fade(p.vazio, clamp(1 - S(t, CLK[i]) + S(t, ABRE + 0.3))); // o "R$ ––––" some no aperto
      fade(p.val, clamp(S(t, CLK[i] + 0.15) * sai));             // e o valor entra logo depois
    });
    fade(hc, clamp(S(t, JUNTA + 0.3) * sai));
    fade(dc, clamp(S(t, DIF + 0.3) * sai));
    fade(fim, clamp(S(t, FECHA + 0.3) - S(t, ABRE)));
    ck.setAttribute("stroke-dashoffset", (1 - clamp(S(t, FECHA + 0.6, "ck"))).toFixed(4));
    cameraECursor(partes, t, num(TC, "x", t), num(TC, "y", t), CLK);
  };
}

const FONTES = [
  { nome: "NFS-e", valor: "R$ 20.000,00" },
  { nome: "PGDAS", valor: "R$ 20.000,00" },
  { nome: "Cartão e Pix", nota: "via SEFIN-RO", valor: "R$ 32.000,00" },
];

export default function MotionFontes() {
  return (
    <Palco
      cena="fontes"
      duracao={T}
      criar={criar}
      parado={7.4}
      rotulo="Animação: NFS-e, PGDAS e pagamentos por cartão e Pix se juntam numa mesma competência; a diferença aparece em azul; uso exclusivo para fins fiscais"
    >
      <div className="forma" data-m="moldura">
        <div className="c" data-m="fim" style={{ color: "#fff", fontSize: 50, fontWeight: 600, gap: 22 }}>
          <Check tamanho={64} m="ck-fim" />
          <span>Uso exclusivo para fins fiscais</span>
        </div>
      </div>
      <div className="forma" data-m="cab">
        <div className="c j3 cab3" data-m="cab-c"><b>Competência 04/2026</b><span>Empresa Exemplo Ltda</span></div>
      </div>
      {FONTES.map((f, i) => (
        <div className="forma" data-m={`p${i}`} key={f.nome}>
          <div className="c j3" data-m="rotulo">
            {f.nota ? <span className="empilha"><b>{f.nome}</b><small>{f.nota}</small></span> : <b>{f.nome}</b>}
          </div>
          <div className="c j3 k3" data-m="vazio"><span className="vazio">R$ ––––</span></div>
          <div className="c j3 k3" data-m="valor"><b className="tab">{f.valor}</b></div>
        </div>
      ))}
      <div className="forma" data-m="dif">
        <div className="c j3" data-m="dif-c">
          <b style={{ color: "#223F99" }}>Diferença</b>
          <b className="tab" style={{ color: "#223F99" }}>R$ 12.000,00</b>
        </div>
      </div>
    </Palco>
  );
}
