import { seg } from "@/lib/scroll";

export type Expressao = "neutra" | "confusa" | "preocupada" | "aliviada";
export interface Legenda {
  kicker?: string;
  titulo: string;
  sub?: string;
  cta?: boolean;
}

export const LEGENDAS: readonly Legenda[] = [
  {
    kicker: "Como funciona",
    titulo: "Esta é a Dona Ana.",
    sub: "Ela tem uma clínica em Porto Velho e recebe a maior parte dos pagamentos no cartão e no Pix.",
  },
  {
    titulo: "Antes, o problema chegava assim.",
    sub: "Meses depois, numa notificação difícil de entender e já com risco de multa.",
  },
  {
    titulo: "O SISConforme cruza o que ela recebeu com o que declarou.",
    sub: "Recebimentos no cartão e Pix, notas fiscais emitidas (NFS-e) e a declaração do Simples Nacional (PGDAS).",
  },
  {
    titulo: "Em maio, a conta não fechou.",
    sub: "R$ 97,5 mil recebidos no cartão, mas só R$ 71,3 mil em notas fiscais.",
  },
  {
    titulo: "O portal avisa antes de virar multa.",
    sub: "Em linguagem direta: o que aconteceu, qual o valor e o que fazer.",
  },
  {
    titulo: "Ela resolve no mesmo dia.",
    sub: "Emite as notas que faltavam e retifica o PGDAS, sem sair do portal.",
  },
  {
    titulo: "Tudo confere. Sem multa, sem ir à Prefeitura.",
    cta: true,
  },
];

export const JANELAS: readonly (readonly [number, number])[] = [
  [0, 0.13],
  [0.13, 0.26],
  [0.27, 0.42],
  [0.43, 0.56],
  [0.56, 0.71],
  [0.72, 0.86],
  [0.86, 2],
];

const EXPRESSOES: readonly (readonly [number, Expressao])[] = [
  [0, "neutra"],
  [0.155, "confusa"],
  [0.27, "neutra"],
  [0.45, "preocupada"],
  [0.57, "neutra"],
  [0.76, "aliviada"],
];

export const ROTEIRO_ACESSIVEL: readonly string[] = [
  "Esta é a Dona Ana. Ela tem uma clínica em Porto Velho e recebe a maior parte dos pagamentos no cartão e no Pix.",
  "Antes, o problema chegava meses depois, numa notificação difícil de entender e já com risco de multa.",
  "O SISConforme cruza os recebimentos no cartão e Pix com as notas fiscais emitidas (NFS-e) e a declaração do Simples Nacional (PGDAS).",
  "Em maio, a conta não fechou: R$ 97,5 mil recebidos no cartão, mas só R$ 71,3 mil em notas fiscais.",
  "O portal avisa antes de virar multa, dizendo o que aconteceu, qual o valor e o que fazer.",
  "Ela resolve no mesmo dia: emite as notas que faltavam e retifica o PGDAS, sem sair do portal.",
  "Tudo confere. Sem multa, sem ir à Prefeitura.",
];

export function expressaoEm(p: number): Expressao {
  let e: Expressao = "neutra";
  for (const [t, x] of EXPRESSOES) if (p >= t) e = x;
  return e;
}

export function legendaEm(i: number, p: number): { opacidade: number; deslocamento: number } {
  const [a, b] = JANELAS[i];
  const entrada = a === 0 ? 1 : seg(p, a, a + 0.03);
  const saida = b > 1 ? 1 : 1 - seg(p, b - 0.03, b);
  return { opacidade: Math.min(entrada, saida), deslocamento: (1 - entrada) * 28 - (1 - saida) * 28 };
}
