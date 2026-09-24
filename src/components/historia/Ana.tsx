import type { CSSProperties, ReactNode } from "react";
import styles from "./Ana.module.css";
import type { Expressao } from "./roteiro";

const INK = "#141413";
const CLAY = "#D97757";
const GREEN = "#3C9A6B";
const GOLD = "#D4A12A";

const LINE = { fill: "none", stroke: INK, strokeWidth: 3, strokeLinecap: "round" as const };

function star(x: number, y: number, r: number, d: number) {
  const style: CSSProperties | undefined = d ? { animationDelay: `${d}s` } : undefined;
  return (
    <path
      className={styles.spark}
      style={style}
      fill={GOLD}
      d={`M${x} ${y - r} l${r * 0.28} ${r * 0.72} l${r * 0.72} ${r * 0.28} l${-r * 0.72} ${r * 0.28} l${-r * 0.28} ${r * 0.72} l${-r * 0.28} ${-r * 0.72} l${-r * 0.72} ${-r * 0.28} l${r * 0.72} ${-r * 0.28}z`}
    />
  );
}

interface Face {
  tilt?: number;
  brows: string;
  eyes: ReactNode;
  mouth: ReactNode;
  front?: ReactNode;
}

const FACES: Record<Expressao, Face> = {
  neutra: {
    brows: "M78 104 Q86 99 94 103 M106 103 Q114 99 122 104",
    eyes: (
      <>
        <circle cx={86} cy={118} r={4.2} />
        <circle cx={114} cy={118} r={4.2} />
      </>
    ),
    mouth: <path d="M89 138 Q100 147 111 138" {...LINE} />,
  },
  confusa: {
    tilt: 6,
    brows: "M78 100 Q86 95 94 99 M106 103 Q114 101 122 103",
    eyes: (
      <>
        <circle cx={89} cy={114} r={4.2} />
        <circle cx={117} cy={114} r={4.2} />
      </>
    ),
    mouth: <path d="M95 141 Q103 140 110 135" {...LINE} />,
    front: (
      <>
        <g className={styles.scratch}>
          <path
            d="M146 238 L184 172 L154 102"
            fill="none"
            stroke="var(--clay-deep)"
            strokeWidth={20}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={152} cy={96} r={10} fill="var(--skin)" />
        </g>
        <g fill="none" stroke="#9D988D" strokeWidth={3} strokeLinecap="round">
          <path className={styles.think} d="M34 66 q6 -10 12 0 t12 0 t12 0" />
          <path className={styles.think} style={{ animationDelay: ".8s" }} d="M40 50 q5 -8 10 0 t10 0" />
        </g>
      </>
    ),
  },
  preocupada: {
    brows: "M78 107 Q86 104 94 99 M106 99 Q114 104 122 107",
    eyes: (
      <>
        <circle cx={86} cy={119} r={4} />
        <circle cx={114} cy={119} r={4} />
      </>
    ),
    mouth: <path d="M91 143 Q100 135 109 143" {...LINE} />,
    front: <path className={styles.drop} d="M142 92 Q136 104 142 108 Q148 104 142 92Z" fill="#8CC7E0" />,
  },
  aliviada: {
    brows: "M78 101 Q86 96 94 100 M106 100 Q114 96 122 101",
    eyes: <path d="M80 119 Q86 113 92 119 M108 119 Q114 113 120 119" {...LINE} />,
    mouth: (
      <>
        <path d="M87 135 Q100 153 113 135 Z" fill={INK} />
        <path d="M93 142 Q100 148 107 142 Z" fill={CLAY} />
      </>
    ),
    front: (
      <>
        <path d="M56 236 Q76 252 112 222" fill="none" stroke="var(--clay-deep)" strokeWidth={20} strokeLinecap="round" />
        <rect x={112} y={178} width={34} height={60} rx={6} fill={INK} />
        <rect x={116} y={184} width={26} height={46} rx={3} fill="#FAF9F5" />
        <path
          d="M122 206 l5 5 l10 -11"
          fill="none"
          stroke={GREEN}
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={116} cy={220} r={9} fill="var(--skin)" />
        {star(160, 84, 10, 0)}
        {star(40, 72, 6, 0.5)}
        {star(170, 130, 5, 0.9)}
      </>
    ),
  },
};

export default function Ana({ expressao }: { expressao: Expressao }) {
  const f = FACES[expressao];
  const tilt = `rotate(${f.tilt ?? 0} 100 165)`;
  return (
    <svg viewBox="0 0 200 260" focusable="false" className={styles.svg}>
      <path
        transform={tilt}
        d="M56 118 C50 70 82 54 102 56 C130 58 152 78 146 122 L150 172 Q138 182 126 170 L126 146 L74 146 L74 170 Q62 182 50 172 Z"
        fill="var(--hairc)"
      />
      <path d="M36 262 C38 204 68 186 100 186 C132 186 162 204 164 262 Z" fill="var(--clay)" />
      <path d="M86 186 L100 214 L114 186 Z" fill="#FAF9F5" />
      <path
        d="M100 214 L84 190 L74 196 L92 240 Z M100 214 L116 190 L126 196 L108 240 Z"
        fill="var(--clay-deep)"
        opacity={0.55}
      />
      <rect x={90} y={150} width={20} height={40} rx={8} fill="var(--skin-sh)" />
      <circle cx={100} cy={206} r={3} fill={GOLD} />
      <g transform={tilt}>
        <ellipse cx={62} cy={120} rx={7} ry={10} fill="var(--skin-sh)" />
        <ellipse cx={138} cy={120} rx={7} ry={10} fill="var(--skin-sh)" />
        <circle cx={61} cy={133} r={3.4} fill={GOLD} />
        <circle cx={139} cy={133} r={3.4} fill={GOLD} />
        <ellipse cx={100} cy={116} rx={38} ry={44} fill="var(--skin)" />
        <ellipse cx={80} cy={132} rx={7} ry={4.5} fill={CLAY} opacity={0.35} />
        <ellipse cx={120} cy={132} rx={7} ry={4.5} fill={CLAY} opacity={0.35} />
        <path d="M100 118 Q97 128 101 130" fill="none" stroke="var(--skin-sh)" strokeWidth={2.4} strokeLinecap="round" />
        <path
          d="M61 112 C58 72 88 60 104 64 C128 68 142 86 139 114 C130 92 114 84 98 86 C80 88 68 98 61 112 Z"
          fill="var(--hairc)"
        />
        <path d={f.brows} fill="none" stroke="var(--hairc)" strokeWidth={3.6} strokeLinecap="round" />
        <g className={styles.eyes} fill={INK}>
          {f.eyes}
        </g>
        {f.mouth}
      </g>
      {f.front}
    </svg>
  );
}
