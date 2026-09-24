import { Fragment, memo, type ReactNode, type Ref } from "react";
import styles from "./HistoriaDonaAna.module.css";

const INK = "#141413";
const STONE = "#C9C5BA";
const MUTED = "#6F6D66";
const CLAY = "#D97757";
const DEEP = "#C15F3C";
const GREEN = "#3C9A6B";
const GOLD = "#D4A12A";

export const BASE = 352;
export const PASSO = 11;
export const MAX_MOEDAS = 15;
export const PRIMEIRA = [15, 11, 11] as const;
export const VALORES = [97.5, 71.3, 71.3] as const;

const XS = [110, 300, 490] as const;
const COLS = [GOLD, CLAY, GREEN] as const;

export interface ObjDef {
  x: number;
  y: number;
  w: number;
  h: number;
  s: number;
  r: number;
}

export const OBJ: readonly ObjDef[] = [
  { x: 35, y: 20, w: 150, h: 96, s: 1, r: -14 },
  { x: 252, y: 6, w: 96, h: 124, s: 0.95, r: 10 },
  { x: 442, y: 6, w: 96, h: 124, s: 0.95, r: -8 },
];

function estrela(x: number, y: number, r: number, d: number) {
  return (
    <path
      className={styles.spark}
      style={d ? { animationDelay: `${d}s` } : undefined}
      fill={GOLD}
      d={`M${x} ${y - r} l${r * 0.28} ${r * 0.72} l${r * 0.72} ${r * 0.28} l${-r * 0.72} ${r * 0.28} l${-r * 0.28} ${r * 0.72} l${-r * 0.28} ${-r * 0.72} l${-r * 0.72} ${-r * 0.28} l${r * 0.72} ${-r * 0.28}z`}
    />
  );
}

function Cartao() {
  return (
    <>
      <rect width={150} height={96} rx={12} fill={GOLD} />
      <rect width={150} height={96} rx={12} fill="url(#hsShine)" />
      <rect x={16} y={30} width={26} height={20} rx={4} fill="#F2D98A" stroke="#B8881C" strokeWidth={1.5} />
      <path d="M29 30v20M16 40h26" stroke="#B8881C" strokeWidth={1.2} />
      <g fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" opacity={0.9}>
        <path d="M122 32q6 8 0 16" />
        <path d="M129 28q9 12 0 24" />
      </g>
      <g fill="#fff" opacity={0.9}>
        {[0, 1, 2, 3].map((i) => (
          <Fragment key={i}>
            <circle cx={18 + i * 8} cy={70} r={2.4} />
            <circle cx={58 + i * 8} cy={70} r={2.4} />
          </Fragment>
        ))}
      </g>
      <text x={16} y={86} className={styles.texto} fontSize={9} fontWeight={600} fill="#fff" letterSpacing={1}>
        CARTÃO · PIX
      </text>
    </>
  );
}

function Doc({ title, col, children }: { title: string; col: string; children: ReactNode }) {
  return (
    <>
      <rect width={96} height={124} rx={4} fill="#fff" stroke={STONE} strokeWidth={2} />
      <rect width={96} height={24} rx={4} fill={col} />
      <rect y={16} width={96} height={8} fill={col} />
      <text x={48} y={17} textAnchor="middle" className={styles.texto} fontSize={11} fontWeight={700} fill="#fff">
        {title}
      </text>
      {children}
    </>
  );
}

function Nota() {
  return (
    <Doc title="NFS-e" col={CLAY}>
      <g stroke={STONE} strokeWidth={2} strokeLinecap="round">
        <path d="M10 38h76M10 47h60M10 56h76M10 65h50" />
      </g>
      <path d="M10 82h76" stroke={INK} strokeWidth={1} />
      <text x={86} y={98} textAnchor="end" className={styles.texto} fontSize={10} fontWeight={700} fill={INK}>
        TOTAL
      </text>
      <g fill={INK}>
        <rect x={10} y={90} width={18} height={18} fill="none" stroke={INK} strokeWidth={2} />
        <rect x={14} y={94} width={4} height={4} />
        <rect x={20} y={100} width={4} height={4} />
        <rect x={14} y={102} width={4} height={3} />
      </g>
    </Doc>
  );
}

function Pgdas() {
  return (
    <Doc title="PGDAS-D" col={GREEN}>
      {[0, 1, 2, 3].map((i) => (
        <Fragment key={i}>
          <rect x={10} y={36 + i * 18} width={10} height={10} rx={2} fill="none" stroke={GREEN} strokeWidth={2} />
          <path d={`M12 ${41 + i * 18}l3 3l5-6`} fill="none" stroke={GREEN} strokeWidth={2} strokeLinecap="round" />
          <path d={`M28 ${41 + i * 18}h${i % 2 ? 44 : 58}`} stroke={STONE} strokeWidth={2} strokeLinecap="round" />
        </Fragment>
      ))}
      <text x={48} y={116} textAnchor="middle" className={styles.texto} fontSize={8} fontWeight={600} fill={MUTED}>
        SIMPLES NACIONAL
      </text>
    </Doc>
  );
}

const ARTES: readonly ReactNode[] = [<Cartao key="cartao" />, <Nota key="nota" />, <Pgdas key="pgdas" />];

function Moeda({ cx, y, col }: { cx: number; y: number; col: string }) {
  return (
    <>
      <ellipse cx={cx} cy={y + 5} rx={36} ry={9} fill={col} opacity={0.55} />
      <ellipse cx={cx} cy={y} rx={36} ry={9} fill={col} stroke="#fff" strokeWidth={1.5} />
    </>
  );
}

function Badge({ x, y, txt, col }: { x: number; y: number; txt: string; col: string }) {
  const w = txt.length * 9.4 + 28;
  return (
    <>
      <rect x={x - w / 2} y={y - 17} width={w} height={34} rx={17} fill={col} />
      <text x={x} y={y + 6} textAnchor="middle" className={styles.texto} fontWeight={600} fontSize={17} fill="#fff">
        {txt}
      </text>
    </>
  );
}

function CenaObjetos({ ref }: { ref?: Ref<SVGSVGElement> }) {
  return (
    <svg ref={ref} viewBox="0 0 600 420" className={styles.objs}>
      <defs>
        <linearGradient id="hsShine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={0.35} />
          <stop offset=".5" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
      </defs>
      {XS.map((x, i) => (
        <Fragment key={i}>
          <g data-fantasma={i} opacity={0}>
            {i > 0
              ? [11, 12, 13, 14].map((k) => (
                  <ellipse
                    key={k}
                    cx={x}
                    cy={BASE - k * PASSO}
                    rx={36}
                    ry={9}
                    fill="none"
                    stroke={DEEP}
                    strokeWidth={1.6}
                    strokeDasharray="5 4"
                  />
                ))
              : null}
          </g>
          {Array.from({ length: MAX_MOEDAS }, (_, k) => (
            <g key={k} data-moeda={`${i}-${k}`} opacity={0}>
              <Moeda cx={x} y={BASE - k * PASSO} col={COLS[i]} />
            </g>
          ))}
          <text
            data-valor={i}
            x={x}
            y={398}
            textAnchor="middle"
            className={styles.texto}
            fontWeight={600}
            fontSize={20}
            fill={INK}
          />
        </Fragment>
      ))}
      {OBJ.map((o, i) => (
        <g key={i} data-objeto={i} opacity={0}>
          <g className={styles.bob} style={{ animationDelay: `${i * 0.4}s` }}>
            <g transform={`scale(${o.s})`}>{ARTES[i]}</g>
          </g>
        </g>
      ))}
      <line
        data-linha=""
        x1={150}
        y1={BASE - 14 * PASSO}
        x2={150}
        y2={BASE - 14 * PASSO}
        stroke={DEEP}
        strokeWidth={2.5}
        strokeDasharray="7 6"
      />
      <g data-selo="gap" opacity={0}>
        <g className={styles.pulse}>
          <Badge x={395} y={BASE - 12.5 * PASSO} txt="− R$ 26.240" col={DEEP} />
        </g>
      </g>
      <g data-selo="ok" opacity={0}>
        <g className={styles.pulse}>
          <Badge x={300} y={168} txt="✓ Tudo confere" col={GREEN} />
        </g>
      </g>
      <g data-brilhos="" opacity={0}>
        {estrela(205, 150, 11, 0)}
        {estrela(398, 146, 9, 0.4)}
        {estrela(40, 230, 8, 0.8)}
        {estrela(566, 236, 10, 0.2)}
      </g>
    </svg>
  );
}

// M7: a cena SVG (~60 nós desenhados imperativamente via render()) não depende de
// props que mudam (expressao/popAtivo ficam em HistoriaDonaAna); memo evita que ela
// seja reconciliada a cada troca de expressão da Dona Ana.
export default memo(CenaObjetos);
