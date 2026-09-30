"use client";

import {
  BRANCO, LINHA_FINA, S, aperto, avaliar, cameraECursor, clamp, construir, fade, janela, num, pegar, pintar,
  type Geo,
} from "./motion";
import Palco, { Check, Icone } from "./Palco";

/* Card 02 · Acesso por empresa: sua empresa, a representada por procuração e a sem acesso (loop de 16 s). */
const T = 16;
const CLK = {
  pilula: 2.0,        // clica na empresa atual        -> abre a lista
  representada: 4.0,  // clica na empresa representada -> seleciona e abre o detalhe
  outra: 8.5,         // clica em outra empresa        -> cartão sem acesso
  verDados: 10.8,     // tenta "Ver dados"             -> aviso neutro
};
const AREIA = [244, 241, 234, 1], CINZA = [236, 234, 228, 1];
const PILULA = { l: 220, r: 1220, top: 650, bot: 790, rad: 70, bg: BRANCO, bc: LINHA_FINA, bw: 3 };
const LINHA = (y: number) => ({ l: 244, r: 1196, top: y - 81, bot: y + 81, rad: 28, bg: AREIA, bw: 0 });
const CARTAO = { l: 220, r: 1220, top: 420, bot: 1020, rad: 44, bw: 3, bc: LINHA_FINA };

const TA = construir([
  { t: 0, set: PILULA },
  { t: CLK.pilula, set: { l: 220, r: 1220, top: 420, bot: 1020, rad: 44 } },
  { t: 13.2, set: PILULA },
]);
const TB = construir([
  { t: 0, set: PILULA },
  { t: CLK.pilula, set: LINHA(530) },
  { t: CLK.representada, set: LINHA(720) },
  { t: 5.0, set: { ...CARTAO, bg: BRANCO } },
  { t: 7.0, set: LINHA(720) },
  { t: CLK.outra, set: LINHA(910) },
  { t: 9.3, set: { ...CARTAO, bg: CINZA } },
  { t: 12.0, set: LINHA(530) },
  { t: 13.2, set: PILULA },
]);
const TC = construir(
  [
    { t: 0, set: { x: 1130, y: 1150 } },
    { t: 0.4, set: { x: 930, y: 740 } },  // alvo: pílula               (clique 2.0)
    { t: 2.5, set: { x: 600, y: 730 } },  // alvo: empresa representada (clique 4.0)
    { t: 4.4, set: { x: 1150, y: 1060 } },
    { t: 7.3, set: { x: 600, y: 915 } },  // alvo: outra empresa        (clique 8.5)
    { t: 9.4, set: { x: 975, y: 880 } },  // alvo: "Ver dados"          (clique 10.8)
    { t: 11.2, set: { x: 1130, y: 1150 } },
  ],
  "cursor",
);
const CLIQUES = Object.values(CLK);
const CONTEUDO: [string, number, number][] = [
  ["detalhe", 5.3, 7.0],
  ["bloq1", 9.6, CLK.verDados],
  ["bloq2", CLK.verDados + 0.25, 12.0],
];

function criar(raiz: HTMLElement) {
  const A = pegar(raiz, "painel"), B = pegar(raiz, "forma");
  const pilula = pegar(raiz, "pilula"), linhas = pegar(raiz, "linhas"), ck = pegar(raiz, "ck-det");
  const partes = { cam: pegar(raiz, "cam"), cursor: pegar(raiz, "cursor"), ripple: pegar(raiz, "ripple") };
  const itens = CONTEUDO.map(([n, a, b]) => ({ el: pegar(raiz, n), a, b }));

  return (tempo: number) => {
    const t = ((tempo % T) + T) % T;
    pintar(A, avaliar<Geo>(TA, t), 1, S(t, CLK.pilula - 0.02, "jump") - S(t, 13.6, "jump"));
    const afunda = [CLK.pilula, CLK.verDados].reduce((s, c) => s + aperto(t, c), 0);
    pintar(B, avaliar<Geo>(TB, t), 1 - 0.04 * afunda);
    fade(pilula, clamp(1 - S(t, CLK.pilula) + S(t, 13.5)));
    fade(linhas, clamp(janela(t, CLK.pilula + 0.3, 5.0) + janela(t, 7.3, 9.3) + janela(t, 12.1, 13.2)));
    for (const c of itens) fade(c.el, janela(t, c.a, c.b));
    ck.setAttribute("stroke-dashoffset", (1 - clamp(S(t, 5.9, "ck"))).toFixed(4));
    cameraECursor(partes, t, num(TC, "x", t), num(TC, "y", t), CLIQUES);
  };
}

const col = { display: "flex", flexDirection: "column", gap: 10 } as const;
const bloco = (h: number) => ({ width: 800, height: h, display: "flex", flexDirection: "column", justifyContent: "space-between", whiteSpace: "nowrap" }) as const;

export default function MotionEmpresas() {
  return (
    <Palco
      duracao={T}
      criar={criar}
      parado={6.2}
      rotulo="Animação: cada empresa vê só os próprios dados; o contador vê as empresas que representa por procuração eletrônica; outras empresas ficam sem acesso"
    >
      <div className="forma" data-m="painel" />
      <div className="forma" data-m="forma">
        <div className="c" data-m="pilula" style={{ gap: 20 }}>
          <Icone nome="predio" tamanho={44} />
          <span style={{ fontSize: 42, fontWeight: 600, letterSpacing: "-.01em" }}>Empresa Exemplo Ltda</span>
          <span className="selo selo-ok">Liberado</span>
        </div>
        <div className="c" data-m="detalhe">
          <div style={bloco(420)}>
            <div style={col}>
              <span style={{ fontSize: 26, color: "#6F6D66", fontWeight: 500 }}>Empresa representada</span>
              <span style={{ fontSize: 46, fontWeight: 600, letterSpacing: "-.015em" }}>Empresa Representada Ltda</span>
              <span className="tab" style={{ fontSize: 30, color: "#3D3D3A" }}>CNPJ 00.000.000/0002-00</span>
            </div>
            <div style={{ height: 3, background: "#DEDBD2" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30 }}>
                <Icone nome="documento" tamanho={44} />
                <span className="tab">Procuração eletrônica nº 0000/2026</span>
              </span>
              <span className="selo selo-ok">Vigente</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 30, fontWeight: 600 }}>
              <Check tamanho={52} m="ck-det" />
              <span>O contador pode consultar esta empresa</span>
            </div>
          </div>
        </div>
        <div className="c" data-m="bloq1">
          <div style={bloco(400)}>
            <div style={col}>
              <span style={{ color: "#6F6D66", display: "flex" }}><Icone nome="cadeado" tamanho={64} /></span>
              <span style={{ fontSize: 46, fontWeight: 600, letterSpacing: "-.015em", color: "#3D3D3A" }}>Outra Empresa Ltda</span>
              <span style={{ fontSize: 30, color: "#6F6D66" }}>Sem procuração eletrônica</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="selo selo-nao">Sem acesso</span>
              <span style={{ background: "#DEDBD2", color: "#8A877F", fontSize: 32, fontWeight: 600, padding: "0 40px", height: 80, borderRadius: 40, display: "flex", alignItems: "center" }}>
                Ver dados
              </span>
            </div>
          </div>
        </div>
        <div className="c" data-m="bloq2" style={{ flexDirection: "column", gap: 22 }}>
          <span style={{ color: "#3D3D3A", display: "flex" }}><Icone nome="cadeado" tamanho={80} /></span>
          <span style={{ fontSize: 48, fontWeight: 600, letterSpacing: "-.015em" }}>Sem acesso</span>
          <span style={{ fontSize: 32, color: "#6F6D66" }}>Nem para contador sem procuração.</span>
        </div>
      </div>
      <div data-m="linhas">
        <div className="linha" style={{ top: 530 }}>
          <span><b>Empresa Exemplo Ltda</b><small>Sua empresa · seus próprios dados</small></span>
          <span className="selo selo-ok">Liberado</span>
        </div>
        <div className="linha" style={{ top: 720 }}>
          <span><b>Empresa Representada Ltda</b><small>Contador, com procuração eletrônica</small></span>
          <span className="selo selo-ok">Liberado</span>
        </div>
        <div className="linha linha-off" style={{ top: 910 }}>
          <span><b>Outra Empresa Ltda</b><small>Sem procuração eletrônica</small></span>
          <span className="selo selo-nao"><Icone nome="cadeado" tamanho={30} />Sem acesso</span>
        </div>
      </div>
    </Palco>
  );
}
