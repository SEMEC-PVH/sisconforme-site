# Migração da landing SISConforme para Next.js · Plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Converter `site/index.html` num projeto Next.js + TypeScript com saída estática, visualmente e comportamentalmente idêntico ao original.

**Architecture:** App Router em `src/`, uma página (`src/app/page.tsx`) montada a partir de componentes, um por seção da landing. Seções só de conteúdo são Server Components; as interativas (menu, hero, história da Dona Ana, gráfico, carrossel) são Client Components que mantêm a lógica de scroll **imperativa** (listener + `requestAnimationFrame` + escrita direta de estilos via `ref`). CSS atual portado para CSS Modules, com tokens e utilitários de prosa em `globals.css`. Build com `output: 'export'`.

**Tech Stack:** Next.js 16 (App Router, `next/font/google`, `next/image`), React 19, TypeScript, CSS Modules, ESLint, Vitest (lógica pura), Playwright + pixelmatch (paridade visual contra o original, usando o Chrome instalado).

**Spec:** `docs/superpowers/specs/2026-09-24-migracao-nextjs-design.md`

**Fonte da verdade:** `site/index.html` (706 linhas). **Não modifique esse arquivo.** Toda referência "linhas X–Y" neste plano aponta para ele.

## Global Constraints

- Nenhuma mudança visual, de texto ou de comportamento em relação a `site/index.html`.
- TypeScript estrito (o `tsconfig` do create-next-app); nada de `any` explícito.
- Estilos: CSS Modules por componente + `src/app/globals.css`. Sem Tailwind, sem CSS-in-JS.
- `next.config.ts`: `output: 'export'` e `images: { unoptimized: true }`.
- Fonte: Inter via `next/font/google`, exposta como a variável CSS `--font-inter`; `--sans` = `var(--font-inter), system-ui, -apple-system, "Segoe UI", sans-serif`.
- Imagens em `public/` são servidas pela raiz: `../public/img/hero/x.webp` no original vira `/img/hero/x.webp`.
- Todo seletor em `*.module.css` precisa conter ao menos uma classe local (CSS Modules rejeita seletores só de elemento). Troque `footer{…}` por `.footer{…}`, `article{…}` fica em `globals.css`.
- Textos em PT-BR copiados literalmente do original, inclusive acentos, `—`, `·`, `“ ”` e `&nbsp;` implícitos.
- IDs de âncora preservados: `top`, `como-funciona`, `introducao`, `cruzamento`, `comunicacao`, `seguranca`, `disponibilidade`.
- A árvore de wrappers dentro de `<article class="prose">` deve ser **a mesma do original** (mesmos `div` na mesma ordem, linhas 329–451): os testes de paridade localizam blocos por `article > div:nth-child(n)`.
- Cada tarefa termina com `npm run build` limpo (sem erros de TS/ESLint) e com um commit.
- Mensagens de commit terminam com a linha: `Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>`

## Review Focus

- **Hidratação:** Client Components não podem ler `window`/`document` durante o render; só dentro de `useEffect`. Um erro de hidratação aparece como erro no console e o teste `console limpo` (Tarefa 5) o pega.
- **Movimento reduzido:** com `prefers-reduced-motion: reduce`, o hero abre em `p ≥ 0.6`, a história fica estática na cena final com o roteiro em texto visível, e as animações CSS param. Coberto pelo grupo `reduzido` do teste de paridade (Tarefas 2 e 4).
- **Janela redimensionada:** hero, história e carrossel recalculam no `resize` (o carrossel reposiciona o card ativo). Coberto pelos dois viewports do teste de paridade; o implementador deve registrar e remover os listeners de `resize` no cleanup do `useEffect`.
- **Texto SVG com a fonte do next/font:** o nome da família gerado pelo `next/font` não é `Inter`, então atributos SVG `font-family="Inter,sans-serif"` do original precisam virar CSS `font-family: var(--sans)` (classe no `<text>` ou regra `.objetos text`). Coberto pela paridade da história (Tarefa 4) e do gráfico (Tarefa 3).
- **Scroll via âncoras:** `html{scroll-behavior:smooth}` continua valendo e os links `#…` do menu, sumário do hero e rodapé funcionam no site exportado. Coberto pelo teste `âncoras` (Tarefa 5).

---

## Mapa de arquivos

| Arquivo | Responsabilidade | Origem (linhas de `site/index.html`) |
|---|---|---|
| `package.json`, `tsconfig.json`, `eslint.config.mjs`, `next.config.ts` | projeto Next | create-next-app + ajustes |
| `vitest.config.ts`, `playwright.config.ts` | testes | novo |
| `src/app/layout.tsx` | `<html>`, fonte, metadados | 1–6 |
| `src/app/icon.svg` | favicon | data URI da linha 3 |
| `src/app/globals.css` | tokens, base, prosa, abas | 8–24, 72–88, 104–107, 152 (parte `html`) |
| `src/app/page.tsx` | monta a página | ordem das linhas 232–466 |
| `src/lib/scroll.ts` | `clamp`, `seg`, easings, `progressoDoScroll`, `useScrollFrame` | 474, 548–551 |
| `src/components/BrandMark.tsx` | símbolo SVG | path da linha 457 |
| `src/components/Nav.tsx` + `.module.css` | menu fixo | CSS 25–38, HTML 232–247, JS 486 |
| `src/components/SideNav.tsx` + `.module.css` | marcadores laterais | CSS 62–70, HTML 249–254, JS 486–490 |
| `src/components/Hero.tsx` + `.module.css` | hero com scroll | CSS 40–60, HTML 256–278, JS 471–485, 493–495 |
| `src/components/Footer.tsx` + `.module.css` | rodapé | CSS 142–150, HTML 454–466 |
| `src/components/Introducao.tsx` | bloco introdução | HTML 329–342 |
| `src/components/Cruzamento.tsx` + `.module.css` | tabela, notas, subtítulo | CSS 90–101, HTML 344–367 |
| `src/components/GraficoAbas.tsx` + `.module.css` | gráfico com abas | CSS 108–115, HTML 369–380, JS 497–533 |
| `src/components/CarrosselPerfis.tsx` + `.module.css` | cenários por perfil | CSS 117–128, HTML 382–401, JS 492, 535–541 |
| `src/components/Comunicacao.tsx` + `.module.css` | notificação × alerta | CSS 130–140, HTML 403–430 |
| `src/components/SegurancaEDisponibilidade.tsx` | seções finais (um único wrapper, como no original) | HTML 432–451 |
| `src/components/historia/roteiro.ts` | dados e funções puras da timeline | JS 638–641, HTML 284–293, 312–325 |
| `src/components/historia/Ana.tsx` + `Ana.module.css` | personagem SVG | JS 556–601, CSS 197–215 (parte da Ana) |
| `src/components/historia/objetos.tsx` | cartão, NFS-e, PGDAS, moedas, selos | JS 603–636 |
| `src/components/historia/HistoriaDonaAna.tsx` + `.module.css` | seção `#como-funciona` | CSS 154–228, HTML 280–326, JS 547–705 |
| `tests/unit/*.test.ts` | Vitest | novo |
| `tests/e2e/paridade.spec.ts` | Playwright: paridade visual e console | novo |
| `scripts/publicar.ps1`, `README.md` | publicação e docs | atualizar |

---

### Task 1: Fundação do projeto (Next.js, configs, globals, layout, utilitários de scroll, testes)

**Files:**
- Create: `package.json`, `tsconfig.json`, `eslint.config.mjs`, `next.config.ts`, `vitest.config.ts`, `playwright.config.ts`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `src/app/icon.svg`
- Create: `src/lib/scroll.ts`, `tests/unit/scroll.test.ts`, `tests/e2e/paridade.spec.ts`
- Modify: `.gitignore`

**Interfaces:**
- Produces (`src/lib/scroll.ts`):
  - `clamp(v: number, a?: number, b?: number): number` (padrões `a=0`, `b=1`)
  - `seg(p: number, a: number, b: number): number`
  - `easeOutCubic(t: number): number` → `1-(1-t)^3` (o `ease` do hero, linha 474)
  - `easeInOutQuad(t: number): number` (o `ease` da história, linha 550)
  - `easeInCubic(t: number): number` → `t^3` (o `easeIn`, linha 550)
  - `easeOutBack(t: number): number` (o `back`, linha 551; retorna 0 para `t<=0`)
  - `progressoDoScroll(el: HTMLElement): number` → `clamp(-top/(altura-innerHeight))`, 0 se a altura rolável for ≤ 0
  - `useScrollFrame(onFrame: () => void): void` → roda `onFrame` uma vez na montagem e a cada scroll/resize, no máximo uma vez por frame
- Produces: `tests/e2e/paridade.spec.ts` com os grupos `hero`, `historia`, `conteudo`, `rodape`, `reduzido`, `console`, `ancoras` (os testes dos grupos falham até as tarefas seguintes implementarem as seções)

- [ ] **Step 1: Gerar o esqueleto Next.js numa pasta temporária**

A raiz do repositório não está vazia, então gere fora e copie:

```powershell
$tmp = Join-Path $env:TEMP "sisconforme-next-base"
if (Test-Path $tmp) { Remove-Item -Recurse -Force $tmp }
New-Item -ItemType Directory $tmp | Out-Null
Push-Location $tmp
npx create-next-app@latest base --ts --app --src-dir --eslint --no-tailwind --no-react-compiler --import-alias "@/*" --use-npm --disable-git --no-agents-md --skip-install --yes
Pop-Location
Copy-Item "$tmp\base\package.json","$tmp\base\tsconfig.json","$tmp\base\eslint.config.mjs","$tmp\base\next.config.ts" "D:\dev\Frontend Sisconforme\"
New-Item -ItemType Directory -Force "D:\dev\Frontend Sisconforme\src\app" | Out-Null
```

Não copie `public/`, `README.md` nem os arquivos de `src/app` do template. Em `package.json`, troque `"name"` para `"sisconforme-landing"`.

- [ ] **Step 2: Instalar dependências e dependências de teste**

```powershell
cd "D:\dev\Frontend Sisconforme"
npm install
npm install -D vitest @playwright/test pixelmatch@5 pngjs @types/pixelmatch @types/pngjs
```

`pixelmatch@5` (CommonJS) é intencional: o v7 é só ESM e não carrega no Playwright sem `"type": "module"`.
Não rode `npx playwright install`: os testes usam o Chrome já instalado (`channel: 'chrome'`).

- [ ] **Step 3: Configurar scripts, Next, Vitest e Playwright**

Em `package.json`, `"scripts"` deve ficar:

```json
{
  "dev": "next dev",
  "build": "next build",
  "lint": "eslint",
  "test": "vitest run",
  "test:paridade": "next build && playwright test"
}
```

`next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
```

`vitest.config.ts`:

```ts
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  test: { include: ["tests/unit/**/*.test.ts"], environment: "node" },
});
```

`playwright.config.ts`:

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 90_000,
  workers: 1,
  reporter: [["list"]],
  use: { channel: "chrome", deviceScaleFactor: 1 },
  webServer: {
    command: "python -m http.server 4173 --directory out",
    url: "http://localhost:4173/",
    reuseExistingServer: true,
  },
});
```

Acrescente ao `.gitignore`:

```
test-results/
playwright-report/
```

- [ ] **Step 4: Escrever os testes unitários de `scroll.ts` (falhando)**

`tests/unit/scroll.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { clamp, easeInCubic, easeInOutQuad, easeOutBack, easeOutCubic, seg } from "@/lib/scroll";

describe("clamp", () => {
  it("limita ao intervalo padrão 0–1", () => {
    expect(clamp(-2)).toBe(0);
    expect(clamp(0.4)).toBe(0.4);
    expect(clamp(3)).toBe(1);
  });
  it("aceita limites próprios", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

describe("seg", () => {
  it("mapeia p dentro de [a,b] para 0–1", () => {
    expect(seg(0.1, 0.1, 0.3)).toBe(0);
    expect(seg(0.2, 0.1, 0.3)).toBeCloseTo(0.5);
    expect(seg(0.5, 0.1, 0.3)).toBe(1);
  });
});

describe("easings", () => {
  it("começam em 0 e terminam em 1", () => {
    for (const f of [easeOutCubic, easeInOutQuad, easeInCubic, easeOutBack]) {
      expect(f(0)).toBeCloseTo(0);
      expect(f(1)).toBeCloseTo(1);
    }
  });
  it("easeOutBack passa de 1 antes de assentar (overshoot)", () => {
    expect(easeOutBack(0.7)).toBeGreaterThan(1);
  });
  it("easeOutBack é 0 para t negativo", () => {
    expect(easeOutBack(-0.5)).toBe(0);
  });
  it("easeInOutQuad é simétrico", () => {
    expect(easeInOutQuad(0.5)).toBeCloseTo(0.5);
  });
});
```

- [ ] **Step 5: Rodar e ver falhar**

Run: `npm test`
Expected: FAIL com `Failed to resolve import "@/lib/scroll"`.

- [ ] **Step 6: Implementar `src/lib/scroll.ts`**

```ts
"use client";

import { useEffect, useEffectEvent } from "react";

export const clamp = (v: number, a = 0, b = 1): number => Math.min(b, Math.max(a, v));

export const seg = (p: number, a: number, b: number): number => clamp((p - a) / (b - a));

/** `ease` do hero (site/index.html, linha 474). */
export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

/** `ease` da história (linha 550). */
export const easeInOutQuad = (t: number): number =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

/** `easeIn` da história (linha 550). */
export const easeInCubic = (t: number): number => t * t * t;

/** `back` da história (linha 551). */
export const easeOutBack = (t: number): number => {
  const c = 1.70158;
  const c3 = c + 1;
  return t <= 0 ? 0 : 1 + c3 * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};

/** Quanto de uma seção "pinada" já foi rolado: 0 no topo, 1 no fim. */
export function progressoDoScroll(el: HTMLElement): number {
  const r = el.getBoundingClientRect();
  const alcance = r.height - window.innerHeight;
  return alcance <= 0 ? 0 : clamp(-r.top / alcance);
}

/** Chama `onFrame` na montagem e, no máximo uma vez por frame, a cada scroll ou resize. */
export function useScrollFrame(onFrame: () => void): void {
  const tick = useEffectEvent(onFrame);
  useEffect(() => {
    let pendente = false;
    const rodar = () => {
      pendente = false;
      tick();
    };
    const agendar = () => {
      if (!pendente) {
        pendente = true;
        requestAnimationFrame(rodar);
      }
    };
    rodar();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    return () => {
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
    };
  }, []);
}
```

Observação: `useEffectEvent` é estável no React 19.2 (versão do Next 16). Se o `npm install` trouxer React < 19.2, troque por um `useRef` atualizado num `useEffect` sem deps.

- [ ] **Step 7: Rodar e ver passar**

Run: `npm test`
Expected: PASS (7 testes).

- [ ] **Step 8: `globals.css`, `layout.tsx`, `icon.svg`, `page.tsx` provisória**

`src/app/globals.css`: copie **literalmente**, nesta ordem, os trechos de `site/index.html`:
1. linhas 8–24 (`:root{…}` até `h1,h2,h3{…}`), com uma única alteração: a linha `--sans:"Inter",system-ui,-apple-system,"Segoe UI",sans-serif;` vira `--sans:var(--font-inter),system-ui,-apple-system,"Segoe UI",sans-serif;`
2. linhas 72–88 (`article{…}` até `.caption{…}`), precedidas do comentário `/* ---------- prosa (utilitários compartilhados) ---------- */`
3. linhas 104–107 (`.tabs…`), precedidas de `/* ---------- abas (gráfico, carrossel, comunicação) ---------- */`
4. `@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}` (a parte `html` da linha 152; o resto dessa linha vai para os módulos das Tarefas 2 e 3)

`src/app/layout.tsx`:

```tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "SISConforme",
  description: "Portal de autorregularização do ISSQN de Porto Velho.",
  openGraph: { title: "SISConforme", images: ["/img/og-image.jpg"] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

`src/app/icon.svg`: extraia o SVG do favicon (data URI da linha 3). Rode no **Bash** (as aspas quebram no PowerShell):

```bash
node -e 'const fs=require("fs");const s=fs.readFileSync("site/index.html","utf8");const m=s.match(/rel="icon"[^>]*href="data:image\/svg\+xml,([^"]+)"/);fs.writeFileSync("src/app/icon.svg",decodeURIComponent(m[1]))'
```

Expected: `src/app/icon.svg` começa com `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1254 1254"><rect`.

`src/app/page.tsx` (provisória; as tarefas seguintes adicionam as seções):

```tsx
export default function Home() {
  return <article className="prose" />;
}
```

- [ ] **Step 9: Escrever o teste de paridade completo**

`tests/e2e/paridade.spec.ts`:

```ts
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { expect, test, type Browser, type Locator, type Page } from "@playwright/test";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const ORIGINAL = pathToFileURL(path.resolve(__dirname, "../../site/index.html")).href;
const NOVO = "http://localhost:4173/";
const SAIDA = path.resolve(__dirname, "../../test-results/paridade");
/** Fração máxima de pixels diferentes aceita por captura. */
const LIMITE = 0.015;

const VIEWPORTS = {
  desktop: { width: 1280, height: 800 },
  celular: { width: 390, height: 844 },
} as const;

type Alvo = (page: Page) => Locator | null; // null = captura da tela inteira
interface Ponto {
  grupo: string;
  nome: string;
  preparar: (page: Page) => Promise<void>;
  alvo: Alvo;
  movimentoReduzido?: boolean;
}

async function rolar(page: Page, id: string, fracao: number) {
  await page.evaluate(
    ([id, f]) => {
      document.documentElement.style.scrollBehavior = "auto";
      const el = document.getElementById(id as string);
      if (!el) throw new Error(`#${id} não encontrado`);
      const topo = el.getBoundingClientRect().top + window.scrollY;
      const alcance = Math.max(0, el.offsetHeight - window.innerHeight);
      window.scrollTo(0, topo + alcance * (f as number));
    },
    [id, fracao] as const,
  );
  await page.waitForTimeout(700);
}

async function rolarAte(page: Page, alvo: Locator) {
  await alvo.evaluate((el) => {
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 100);
  });
  await page.waitForTimeout(700);
}

const blocoDoArtigo = (n: number): Alvo => (page) => page.locator(`article > div:nth-child(${n})`);

const clicarAba = (bloco: number, nome: string) => async (page: Page) => {
  const alvo = page.locator(`article > div:nth-child(${bloco})`);
  await alvo.getByRole("tab", { name: nome }).click();
  await rolarAte(page, alvo);
};

const PONTOS: Ponto[] = [
  { grupo: "hero", nome: "topo", preparar: (p) => rolar(p, "top", 0), alvo: () => null },
  { grupo: "hero", nome: "meio", preparar: (p) => rolar(p, "top", 0.35), alvo: () => null },
  { grupo: "hero", nome: "aberto", preparar: (p) => rolar(p, "top", 0.7), alvo: () => null },
  { grupo: "hero", nome: "fim", preparar: (p) => rolar(p, "top", 1), alvo: () => null },
  ...[0.04, 0.2, 0.37, 0.52, 0.665, 0.8, 0.95].map<Ponto>((f) => ({
    grupo: "historia",
    nome: `p${f}`,
    preparar: (p) => rolar(p, "como-funciona", f),
    alvo: () => null,
  })),
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map<Ponto>((n) => ({
    grupo: "conteudo",
    nome: `bloco${n}`,
    preparar: (p) => rolarAte(p, p.locator(`article > div:nth-child(${n})`)),
    alvo: blocoDoArtigo(n),
  })),
  { grupo: "conteudo", nome: "grafico-regularizacao", preparar: clicarAba(5, "Regularização após o alerta"), alvo: blocoDoArtigo(5) },
  ...["Contador", "Auditor", "Procurador"].map<Ponto>((nome) => ({
    grupo: "conteudo",
    nome: `carrossel-${nome.toLowerCase()}`,
    preparar: clicarAba(7, nome),
    alvo: blocoDoArtigo(7),
  })),
  { grupo: "rodape", nome: "rodape", preparar: (p) => rolarAte(p, p.locator("footer")), alvo: (p) => p.locator("footer") },
  { grupo: "reduzido", nome: "hero", preparar: (p) => rolar(p, "top", 0), alvo: () => null, movimentoReduzido: true },
  { grupo: "reduzido", nome: "historia", preparar: (p) => rolar(p, "como-funciona", 0), alvo: () => null, movimentoReduzido: true },
];

async function capturar(browser: Browser, url: string, vp: { width: number; height: number }, ponto: Ponto) {
  const ctx = await browser.newContext({
    viewport: vp,
    reducedMotion: ponto.movimentoReduzido ? "reduce" : "no-preference",
  });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await ponto.preparar(page);
  const alvo = ponto.alvo(page);
  const png = alvo
    ? await alvo.screenshot({ animations: "disabled", caret: "hide" })
    : await page.screenshot({ animations: "disabled", caret: "hide" });
  await ctx.close();
  return png;
}

function comparar(a: Buffer, b: Buffer, prefixo: string): number {
  fs.mkdirSync(SAIDA, { recursive: true });
  fs.writeFileSync(`${prefixo}-original.png`, a);
  fs.writeFileSync(`${prefixo}-novo.png`, b);
  const A = PNG.sync.read(a);
  const B = PNG.sync.read(b);
  if (A.width !== B.width || A.height !== B.height) {
    console.log(`${prefixo}: tamanhos diferentes ${A.width}x${A.height} (original) × ${B.width}x${B.height} (novo)`);
    return 1;
  }
  const diff = new PNG({ width: A.width, height: A.height });
  const n = pixelmatch(A.data, B.data, diff.data, A.width, A.height, { threshold: 0.1 });
  fs.writeFileSync(`${prefixo}-diff.png`, PNG.sync.write(diff));
  return n / (A.width * A.height);
}

for (const [nomeVp, vp] of Object.entries(VIEWPORTS)) {
  for (const ponto of PONTOS) {
    test(`${ponto.grupo} · ${nomeVp} · ${ponto.nome}`, async ({ browser }) => {
      const original = await capturar(browser, ORIGINAL, vp, ponto);
      const novo = await capturar(browser, NOVO, vp, ponto);
      const razao = comparar(original, novo, path.join(SAIDA, `${nomeVp}-${ponto.grupo}-${ponto.nome}`));
      expect(razao, `pixels diferentes: ${(razao * 100).toFixed(2)}%`).toBeLessThan(LIMITE);
    });
  }
}

test("console · sem erros ao percorrer a página", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: VIEWPORTS.desktop });
  const page = await ctx.newPage();
  const erros: string[] = [];
  page.on("pageerror", (e) => erros.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") erros.push(m.text());
  });
  await page.goto(NOVO, { waitUntil: "load" });
  const altura = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < altura; y += 400) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(30);
  }
  for (const aba of ["Regularização após o alerta", "Contador", "Auditor", "Procurador"]) {
    await page.getByRole("tab", { name: aba }).click();
  }
  await ctx.close();
  expect(erros).toEqual([]);
});

test("ancoras · links internos levam às seções", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: VIEWPORTS.desktop });
  const page = await ctx.newPage();
  await page.goto(NOVO, { waitUntil: "load" });
  for (const id of ["introducao", "cruzamento", "comunicacao", "seguranca", "disponibilidade"]) {
    const link = page.locator(`footer a[href="#${id}"]`).first();
    if ((await link.count()) === 0) continue;
    await link.click();
    await page.waitForTimeout(1200);
    const topo = await page.evaluate((i) => document.getElementById(i)!.getBoundingClientRect().top, id);
    expect(Math.abs(topo), `#${id} deveria estar no topo, está a ${topo}px`).toBeLessThan(120);
  }
  await ctx.close();
});
```

- [ ] **Step 10: Build e checagem da fundação**

Run: `npm run build`
Expected: sucesso, `out/index.html` gerado, sem erros de TypeScript/ESLint.

Run: `npx playwright test -g "console"`
Expected: PASS (página vazia, sem erros). Os outros grupos falham até as próximas tarefas; isso é esperado.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: fundação Next.js (configs, globals, layout, utilitários de scroll, testes de paridade)"
```

---

### Task 2: Símbolo, menu, marcadores laterais, hero e rodapé

**Files:**
- Create: `src/components/BrandMark.tsx`
- Create: `src/components/Nav.tsx`, `src/components/Nav.module.css`
- Create: `src/components/SideNav.tsx`, `src/components/SideNav.module.css`
- Create: `src/components/Hero.tsx`, `src/components/Hero.module.css`
- Create: `src/components/Footer.tsx`, `src/components/Footer.module.css`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `clamp`, `seg`, `easeOutCubic`, `useScrollFrame` de `@/lib/scroll`
- Produces:
  - `BrandMark({ size, className }: { size: number; className?: string })` → `<svg className={className} width={size} height={size} viewBox="85 124 1021 1021" fill="currentColor" aria-hidden="true">` com os 6 `<path d=…>` da linha 457 (copiados literalmente)
  - `Nav()`, `SideNav()`, `Hero()` (renderiza `<section id="top">`), `Footer()` (renderiza `<footer className={styles.footer}>`)
  - `Hero` é a única dona do elemento `#top`; `Nav` e `SideNav` o leem por `document.getElementById("top")` dentro do `useScrollFrame`

- [ ] **Step 1: Rodar a paridade do hero e do rodapé (falhando)**

Run: `npm run test:paridade -- -g "hero|rodape"`
Expected: FAIL (seções inexistentes: `#top não encontrado` / `footer` não encontrado).

- [ ] **Step 2: `BrandMark.tsx`**

Componente de servidor. Copie os seis atributos `d` do `<svg class="brandmark" …>` da linha 457 para seis `<path d="…" />` em JSX. Sem estado, sem CSS.

- [ ] **Step 3: `Nav.tsx` + `Nav.module.css`**

- CSS: linhas 25–38, trocando `.nav` → `.nav`, `.nav.solid` → `.nav.solid`, `.nav-in` → `.navIn` etc. (camelCase nos nomes compostos). Do final da linha 152, a parte `.nav{transition:none}` entra aqui dentro de `@media (prefers-reduced-motion:reduce)`.
- HTML: linhas 232–247 em JSX (`class`→`className`, `aria-*` mantidos). O `<svg>` do logo vira `<BrandMark size={30} />`.
- Client Component (`"use client"`). Com `useRef<HTMLElement>(null)` no `<header>`:

```tsx
useScrollFrame(() => {
  const topo = document.getElementById("top");
  const nav = ref.current;
  if (!topo || !nav) return;
  nav.classList.toggle(styles.solid, topo.getBoundingClientRect().bottom < 70);
});
```

- [ ] **Step 4: `SideNav.tsx` + `SideNav.module.css`**

- CSS: linhas 62–70; a parte `.side a i{transition:none}` da linha 152 entra num `@media (prefers-reduced-motion:reduce)` aqui.
- HTML: linhas 249–254.
- Client Component. Lógica das linhas 486–490: `on` quando `#top` tem `bottom < 70`; o link ativo é o último de `['introducao','cruzamento','seguranca','disponibilidade']` cujo `getBoundingClientRect().top < innerHeight*0.4` (índice 0 se nenhum). Aplique `styles.on` no `<nav>` e `styles.active` no `<a>` via `classList.toggle`, com refs.

- [ ] **Step 5: `Hero.tsx` + `Hero.module.css`**

- CSS: linhas 40–60. `.hero-copy` → `.heroCopy`, `.panel.c` → `.panel.c`, `.toc .n` etc. Mantenha o `grid-template-columns:minmax(0,1fr)` do `.hero-copy` (é a correção de centralização do "Apresentando").
- HTML: linhas 256–278. As três `<img>` viram `next/image`:

```tsx
<Image src="/img/hero/hero-esquerda.webp" alt="Ilustração das Três Caixas d'Água de Porto Velho sobre papel amarelo"
  width={1024} height={1536} loading="eager" style={{ objectPosition: "50% 40%" }} />
<Image src="/img/hero/hero-centro.webp" alt="Pôr do sol sobre o Rio Madeira, em Porto Velho"
  width={1672} height={941} loading="eager" fetchPriority="high" />
<Image src="/img/hero/hero-direita.webp" alt="Detalhe de uma locomotiva da Estrada de Ferro Madeira-Mamoré"
  width={1024} height={1536} loading="eager" style={{ objectPosition: "25% 50%" }} />
```

  O CSS `.panel img{…}` (linha 44) continua aplicando `position:absolute; inset:0; object-fit:cover`; como é um seletor descendente de `.panel`, funciona no módulo.
- Refs para: section (`#top`), painel central (`pc`), `introducing`, `titleblock`, `hint`.
- Client Component. Porte das linhas 473–485 dentro de `useScrollFrame`:

```tsx
const reduzir = useRef(false);
useEffect(() => {
  reduzir.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}, []);

useScrollFrame(() => {
  const intro = introRef.current, pc = pcRef.current, a1 = introducingRef.current,
        tb = titleRef.current, hint = hintRef.current;
  if (!intro || !pc || !a1 || !tb || !hint) return;
  const rect = intro.getBoundingClientRect(), vh = window.innerHeight;
  let p = clamp(-rect.top / (rect.height - vh));
  if (reduzir.current) p = Math.max(p, 0.6);
  const estreito = window.innerWidth < 700;
  const inicio = estreito ? 62 : 42, fim = estreito ? 100 : 85;
  pc.style.setProperty("--cw", inicio + (fim - inicio) * easeOutCubic(seg(p, 0, 0.55)) + "%");
  const a = seg(p, 0.08, 0.22);
  a1.style.opacity = String(1 - a);
  a1.style.transform = `translateY(${-a * 30}px)`;
  const b = easeOutCubic(seg(p, 0.22, 0.5));
  tb.style.opacity = String(b);
  tb.style.transform = `translateY(${(1 - b) * 40}px) scale(${0.96 + 0.04 * b})`;
  tb.style.visibility = b < 0.02 ? "hidden" : "visible";
  hint.style.opacity = String(1 - seg(p, 0, 0.1));
});
```

  A ordem dos efeitos importa: o `useEffect` do `matchMedia` é declarado **antes** do `useScrollFrame`, então já está preenchido na primeira chamada.

- [ ] **Step 6: `Footer.tsx` + `Footer.module.css`**

- CSS: linhas 142–150, com `footer{…}` → `.footer{…}`, `footer h3` → `.footer h3`, `footer ul` → `.footer ul`, `footer a` → `.footer a`, `footer a:hover` → `.footer a:hover`, `.f-in` → `.fIn`, `.f-bot` → `.fBot`.
- HTML: linhas 454–466. O `<svg class="brandmark">` vira `<BrandMark size={28} />`. Os `style="…"` inline viram objetos `style={{ … }}` com os mesmos valores (ex.: `font: "600 17px var(--sans)"`).
- Componente de servidor.

- [ ] **Step 7: Montar na página**

`src/app/page.tsx`:

```tsx
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import SideNav from "@/components/SideNav";

export default function Home() {
  return (
    <>
      <Nav />
      <SideNav />
      <Hero />
      <article className="prose" />
      <Footer />
    </>
  );
}
```

- [ ] **Step 8: Rodar a paridade e ver passar**

Run: `npm run test:paridade -- -g "hero|rodape|reduzido · (desktop|celular) · hero|console"`
Expected: PASS em `hero` (8), `rodape` (2), `reduzido … hero` (2), `console` (1).
Se um teste falhar, abra `test-results/paridade/*-diff.png` para ver onde está a diferença.

- [ ] **Step 9: Lint e commit**

Run: `npm run lint`
Expected: sem erros.

```bash
git add -A
git commit -m "feat: menu, marcadores laterais, hero e rodapé em componentes"
```

---

### Task 3: Seções de conteúdo (introdução, tabela, gráfico, carrossel, comunicação, segurança)

**Files:**
- Create: `src/components/Introducao.tsx`
- Create: `src/components/Cruzamento.tsx`, `src/components/Cruzamento.module.css`
- Create: `src/components/GraficoAbas.tsx`, `src/components/GraficoAbas.module.css`
- Create: `src/components/CarrosselPerfis.tsx`, `src/components/CarrosselPerfis.module.css`
- Create: `src/components/Comunicacao.tsx`, `src/components/Comunicacao.module.css`
- Create: `src/components/SegurancaEDisponibilidade.tsx`
- Create: `tests/unit/grafico.test.ts`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: classes globais `.prose`, `.col`, `.wide`, `.block`, `.lead`, `.foot`, `.caption`, `.tabs` (de `globals.css`, Tarefa 1)
- Produces:
  - Componentes sem props: `Introducao`, `Cruzamento`, `GraficoAbas`, `CarrosselPerfis`, `Comunicacao`, `SegurancaEDisponibilidade`
  - `GraficoAbas.tsx` exporta também `DADOS_GRAFICO: Record<"a" | "b", DadosGrafico>` e `escalaY(valor: number, max: number): number` para teste

**Regra dos wrappers:** cada componente devolve **exatamente** os `div` de primeiro nível do trecho de origem, com as mesmas classes (globais como string, ex. `className="col"`; específicas via módulo, ex. `` className={`wide block ${styles.chart}`} ``). Assim `article > div:nth-child(n)` continua batendo:

| n | componente | origem |
|---|---|---|
| 1 | `Introducao` | 329–342 |
| 2–4 | `Cruzamento` (fragmento com 3 divs) | 344–367 |
| 5 | `GraficoAbas` | 369–380 |
| 6–7 | `CarrosselPerfis` (fragmento com 2 divs) | 382–401 |
| 8–9 | `Comunicacao` (fragmento com 2 divs) | 403–430 |
| 10 | `SegurancaEDisponibilidade` | 432–451 |

- [ ] **Step 1: Teste unitário da escala do gráfico (falhando)**

`tests/unit/grafico.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { DADOS_GRAFICO, escalaY } from "@/components/GraficoAbas";

describe("gráfico", () => {
  it("tem as duas abas do original", () => {
    expect(DADOS_GRAFICO.a.title).toBe("Divergências por competência");
    expect(DADOS_GRAFICO.b.title).toBe("Regularização após o alerta");
    expect(DADOS_GRAFICO.a.series.map((s) => s.n)).toEqual(["Cartão × NFS-e", "NFS-e × PGDAS", "Cartão × PGDAS"]);
  });
  it("escalaY usa a mesma geometria do original (T=16, altura útil 296)", () => {
    expect(escalaY(0, 500)).toBe(312);
    expect(escalaY(500, 500)).toBe(16);
    expect(escalaY(250, 500)).toBe(164);
  });
});
```

Run: `npm test`
Expected: FAIL (`@/components/GraficoAbas` não existe).

- [ ] **Step 2: `Introducao.tsx`, `SegurancaEDisponibilidade.tsx`**

Componentes de servidor, JSX literal das linhas 329–342 e 432–451. `<b>`, `<a href="#seguranca">` e o `style="margin-top:72px"` (se houver no trecho) viram JSX equivalente.

- [ ] **Step 3: `Cruzamento.tsx` + módulo**

- CSS: linhas 90–101 (`.tscroll`, `table.cmp`, `.cmp …`, `.hl`) → `Cruzamento.module.css` (`.tscroll`, `.cmp`, `.hl`).
- HTML: linhas 344–367, retornando um fragmento com os três divs. `<h3 style="margin-top:72px">` → `<h3 style={{ marginTop: 72 }}>`. Aspas tipográficas “ ” da linha 360 mantidas.

- [ ] **Step 4: `GraficoAbas.tsx` + módulo**

- CSS: linhas 108–115 (`.chartbox`, `.chart-head`, `.legend`, `.chart svg`, `.chart text`) → módulo, com `.chart` como classe local do wrapper.
- Client Component. Porte das linhas 497–533:
  - `DADOS_GRAFICO` = objeto `DATA` (linhas 500–507) tipado:

```ts
interface Serie { n: string; c: string; v: number[] }
export interface DadosGrafico {
  title: string; sub: string; series: Serie[]; max: number; step: number; type: "line" | "bar"; cap: string;
}
```

  - Geometria (linha 512): `W=820, H=360, L=56, R=20, T=16, B=48`; `export const escalaY = (v: number, max: number) => T + (H - T - B) - (v / max) * (H - T - B);`
  - Estado `const [aba, setAba] = useState<"a" | "b">("a")`. As abas são `<button role="tab" aria-selected={aba === k} onClick={() => setAba(k)}>` dentro de `<div className="tabs" role="tablist">`.
  - O SVG que hoje é string (linhas 513–529) vira JSX: linhas de grade e rótulos do eixo Y em loop `for (v=0; v<=max; v+=step)`, eixo, e então `polyline` + `circle` com `<title>` (tipo `line`) ou `rect` + textos (tipo `bar`), com exatamente os mesmos atributos numéricos, cores, `font-size` e `font-weight`. `role="img"` e `aria-label={d.title}` no `<svg viewBox="0 0 820 360">`.
  - Título, subtítulo, legenda e legenda inferior (`ccap`) vêm de `DADOS_GRAFICO[aba]`.

Run: `npm test`
Expected: PASS (inclui os testes de `scroll`).

- [ ] **Step 5: `CarrosselPerfis.tsx` + módulo**

- CSS: linhas 117–128 → módulo (`.carousel`, `.trackWrap`, `.track`, `.card`, `.card.on`, `.card .k` etc.). A parte `.track{transition:none}` da linha 152 entra num `@media (prefers-reduced-motion:reduce)` aqui.
- HTML: linhas 382–401, fragmento com os dois divs.
- Client Component. Porte das linhas 492 e 535–541:
  - Estado `ativo` (0–3). Abas e cards chamam `setAtivo(i)`; `aria-selected` e `styles.on` derivam do estado.
  - Um `useEffect([ativo])` calcula `passo = cards[0].getBoundingClientRect().width + 64` e aplica `track.style.transform = translateX(-passo*ativo px)`; registra `resize` que repete o cálculo; cleanup remove o listener.
  - Um `useEffect([])` define `--sb` em `document.documentElement` (largura da barra de rolagem, linha 492) e o atualiza no `resize`.

- [ ] **Step 6: `Comunicacao.tsx` + módulo**

- CSS: linhas 130–140 → módulo (`.sbs`, `.lab`, `.msg`, `.mono`).
- HTML: linhas 403–430. O `<span class="mono">` tem quebras de linha literais (linhas 423–425): em JSX, use `{"1. Emitir as NFS-e faltantes da competência 05/2026\n2. Retificar o PGDAS de maio\n3. Ou justificar (ex.: venda de mercadoria, estorno)"}`; o `white-space:pre-wrap` do CSS preserva as quebras.
- Componente de servidor.

- [ ] **Step 7: Montar na página**

Dentro de `<article className="prose">` em `page.tsx`, na ordem: `<Introducao />`, `<Cruzamento />`, `<GraficoAbas />`, `<CarrosselPerfis />`, `<Comunicacao />`, `<SegurancaEDisponibilidade />`.

- [ ] **Step 8: Paridade**

Run: `npm run test:paridade -- -g "conteudo|rodape|console|ancoras"`
Expected: PASS em `conteudo` (28), `rodape` (2), `console` (1), `ancoras` (1).

- [ ] **Step 9: Lint e commit**

Run: `npm run lint`
Expected: sem erros.

```bash
git add -A
git commit -m "feat: seções de conteúdo, gráfico e carrossel em componentes"
```

---

### Task 4: História da Dona Ana (`#como-funciona`)

**Files:**
- Create: `src/components/historia/roteiro.ts`, `tests/unit/roteiro.test.ts`
- Create: `src/components/historia/Ana.tsx`, `src/components/historia/Ana.module.css`
- Create: `src/components/historia/objetos.tsx`
- Create: `src/components/historia/HistoriaDonaAna.tsx`, `src/components/historia/HistoriaDonaAna.module.css`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `clamp`, `seg`, `easeInOutQuad`, `easeInCubic`, `easeOutBack`, `progressoDoScroll`, `useScrollFrame` de `@/lib/scroll`
- Produces (`roteiro.ts`):

```ts
export type Expressao = "neutra" | "confusa" | "preocupada" | "aliviada";
export interface Legenda { kicker?: string; titulo: string; sub?: string; cta?: boolean }
export const LEGENDAS: readonly Legenda[];               // 7 itens, textos das linhas 284–293
export const JANELAS: readonly (readonly [number, number])[]; // [[0,.13],[.13,.26],[.27,.42],[.43,.56],[.56,.71],[.72,.86],[.86,2]]
export const ROTEIRO_ACESSIVEL: readonly string[];      // 7 itens, textos dos <li> das linhas 317–323 (sem o link final)
export function expressaoEm(p: number): Expressao;       // tabela EXPR, linha 639
export function legendaEm(i: number, p: number): { opacidade: number; deslocamento: number }; // linha 654
```

- Produces (`Ana.tsx`): `Ana({ expressao }: { expressao: Expressao })` → `<svg viewBox="0 0 200 260" focusable="false">…</svg>`
- Produces (`objetos.tsx`): `CenaObjetos()` → `<svg viewBox="0 0 600 420">` com atributos `data-*` para a animação (ver Step 5) e as constantes `BASE=352`, `PASSO=11`, `MAX_MOEDAS=15`, `PRIMEIRA=[15,11,11]`, `VALORES=[97.5,71.3,71.3]`, `OBJ` (linha 629)

- [ ] **Step 1: Testes do roteiro (falhando)**

`tests/unit/roteiro.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { JANELAS, LEGENDAS, ROTEIRO_ACESSIVEL, expressaoEm, legendaEm } from "@/components/historia/roteiro";

describe("roteiro da Dona Ana", () => {
  it("tem 7 cenas com legenda e janela", () => {
    expect(LEGENDAS).toHaveLength(7);
    expect(JANELAS).toHaveLength(7);
    expect(ROTEIRO_ACESSIVEL).toHaveLength(7);
    expect(LEGENDAS[0]).toMatchObject({ kicker: "Como funciona", titulo: "Esta é a Dona Ana." });
    expect(LEGENDAS[6].cta).toBe(true);
  });

  it("expressões seguem o scroll", () => {
    expect(expressaoEm(0)).toBe("neutra");
    expect(expressaoEm(0.2)).toBe("confusa");
    expect(expressaoEm(0.35)).toBe("neutra");
    expect(expressaoEm(0.5)).toBe("preocupada");
    expect(expressaoEm(0.65)).toBe("neutra");
    expect(expressaoEm(0.9)).toBe("aliviada");
    expect(expressaoEm(1)).toBe("aliviada");
  });

  it("primeira legenda já visível no início; última nunca some", () => {
    expect(legendaEm(0, 0).opacidade).toBe(1);
    expect(legendaEm(1, 0).opacidade).toBe(0);
    expect(legendaEm(6, 1).opacidade).toBe(1);
  });

  it("legenda some depois da sua janela", () => {
    expect(legendaEm(0, 0.2).opacidade).toBe(0);
    expect(legendaEm(3, 0.5).opacidade).toBe(1);
  });
});
```

Run: `npm test`
Expected: FAIL (módulo inexistente).

- [ ] **Step 2: Implementar `roteiro.ts`**

```ts
import { seg } from "@/lib/scroll";

export type Expressao = "neutra" | "confusa" | "preocupada" | "aliviada";
export interface Legenda { kicker?: string; titulo: string; sub?: string; cta?: boolean }

export const LEGENDAS: readonly Legenda[] = [
  { kicker: "Como funciona", titulo: "Esta é a Dona Ana.", sub: "Ela tem uma clínica em Porto Velho e recebe a maior parte dos pagamentos no cartão e no Pix." },
  { titulo: "Antes, o problema chegava assim.", sub: "Meses depois, numa notificação difícil de entender e já com risco de multa." },
  { titulo: "O SISConforme cruza o que ela recebeu com o que declarou.", sub: "Recebimentos no cartão e Pix, notas fiscais emitidas (NFS-e) e a declaração do Simples Nacional (PGDAS)." },
  { titulo: "Em maio, a conta não fechou.", sub: "R$ 97,5 mil recebidos no cartão, mas só R$ 71,3 mil em notas fiscais." },
  { titulo: "O portal avisa antes de virar multa.", sub: "Em linguagem direta: o que aconteceu, qual o valor e o que fazer." },
  { titulo: "Ela resolve no mesmo dia.", sub: "Emite as notas que faltavam e retifica o PGDAS, sem sair do portal." },
  { titulo: "Tudo confere. Sem multa, sem ir à Prefeitura.", cta: true },
];

export const JANELAS: readonly (readonly [number, number])[] = [
  [0, 0.13], [0.13, 0.26], [0.27, 0.42], [0.43, 0.56], [0.56, 0.71], [0.72, 0.86], [0.86, 2],
];

const EXPRESSOES: readonly (readonly [number, Expressao])[] = [
  [0, "neutra"], [0.155, "confusa"], [0.27, "neutra"], [0.45, "preocupada"], [0.57, "neutra"], [0.76, "aliviada"],
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
```

Confira os textos contra as linhas 284–293 e 317–323 de `site/index.html` antes de seguir; qualquer diferença, o original vence.

Run: `npm test`
Expected: PASS.

- [ ] **Step 3: `Ana.tsx` + `Ana.module.css`**

- CSS (`Ana.module.css`): das linhas 197–215 e 172 (regra `.hs-ana svg`), as classes da personagem: `.eyes` (`hs-eyes`), `.scratch` (`hs-scratch`), `.think` (`hs-think`), `.drop` (`hs-drop`), `.spark` (`hs-spark`) e os `@keyframes` correspondentes (`hs-blink`, `hs-scratch`, `hs-think`, `hs-drop`, `hs-spark`, `hs-breathe`), mais `.svg` com `display:block;width:100%;height:auto;overflow:visible;transform-origin:50% 100%;animation:…hs-breathe…`. `@media (prefers-reduced-motion:reduce){.svg,.svg *{animation:none!important}}`.
- JSX: porte de `FACES`, `star` e `ana(e)` (linhas 556–601). Cada string SVG vira JSX: `stroke-width`→`strokeWidth`, `stroke-linecap`→`strokeLinecap`, `stroke-linejoin`→`strokeLinejoin`, `class`→`className={styles.x}`, `style="animation-delay:.8s"`→`style={{ animationDelay: ".8s" }}`. `var(--skin)`, `var(--skin-sh)`, `var(--hairc)`, `var(--clay)`, `var(--clay-deep)` continuam como valores de `fill`/`stroke` (as variáveis são definidas em `.hs` no módulo da história).
- `FACES` vira um `Record<Expressao, { tilt?: number; brows: string; eyes: ReactNode; mouth: ReactNode; front?: ReactNode }>`.

- [ ] **Step 4: `objetos.tsx`**

- Porte de `cartao`, `doc`, `nota`, `pgdas`, `badge`, `coin`, `OBJ` e da montagem do `objs.innerHTML` (linhas 603–636) para JSX estático, com os mesmos números.
- Cada elemento animado recebe um atributo de dados em vez de `id`:
  - grupo do objeto `i`: `data-objeto={i}`; moeda: `data-moeda={`${i}-${k}`}`; fantasma: `data-fantasma={i}`; valor: `data-valor={i}`;
  - `data-linha` (linha tracejada), `data-selo="gap"`, `data-selo="ok"`, `data-brilhos`.
- Todo `<text>` recebe `className={styles.texto}` (definida no módulo da história como `font-family: var(--sans)`) no lugar de `font-family="Inter,sans-serif"` / `font-family="Source Serif 4…"` / `font-family="Inter"`. Os demais atributos (`font-size`, `font-weight`, `fill`, `letter-spacing`) continuam.
- O gradiente `hsShine` mantém o id (`<linearGradient id="hsShine">`), pois é referenciado por `url(#hsShine)`.

- [ ] **Step 5: `HistoriaDonaAna.tsx` + módulo**

- CSS: linhas 154–228 → `HistoriaDonaAna.module.css`, com nomes em camelCase (`.hs`, `.hsPin`→`.pin`, `.hs-card`→`.card`, `.hs-caps`→`.caps`, `.hs-cap`→`.cap`, `.hs-ana`→`.ana`, `.hs-ana-pop`→`.pop`, `.hs-scene`→`.scene`, `.hs-objs`→`.objs`, `.hs-letter`→`.letter`, `.hs-paper`→`.paper`, `.hs-phone`→`.phone`, `.buzz`, `.hs-body`→`.body`, `.hs-note`→`.note`, `.hs-steps`→`.steps`, `.hs-btn`→`.btn`, `.done`, `.hs-bar`→`.bar`, `.hs-sr`→`.sr`, `.hs-static`→`.static`, `.on`, `.bob`, `.pulse` etc.), sem as classes que foram para `Ana.module.css`. Acrescente `.texto{font-family:var(--sans)}`.
  A classe de "pop" na troca de expressão: `.popAtivo{animation:hs-pop .45s ease-out}` aplicada ao wrapper `.pop`.
- HTML: linhas 280–326 em JSX. As legendas são geradas de `LEGENDAS` (a 7ª com os dois links `Acessar portal`/`Saiba mais ↓`, ambos `tabIndex={-1}`); a lista acessível de `ROTEIRO_ACESSIVEL` (o 7º item termina com ` <a href="#disponibilidade">Acessar portal</a>.`). Carta, celular e barra de progresso copiados literalmente.
- Client Component. Estado: `const [expressao, setExpressao] = useState<Expressao>("neutra")` e `const trocas = useRef(0)`.
  - O wrapper da Ana: `<div key={expressao} className={`${styles.pop} ${trocas.current > 0 ? styles.popAtivo : ""}`}><Ana expressao={expressao} /></div>`; ao trocar a expressão no frame, incremente `trocas.current` antes do `setExpressao`.
  - Um `useEffect([])` lê `prefers-reduced-motion`: se ativo, adiciona `styles.static` na seção, chama `render(1)` uma vez e **não** registra scroll (use uma ref `estatico` que o `useScrollFrame` consulta para sair cedo).
  - `useScrollFrame`: marca `styles.on` quando a seção intersecta a viewport (linha 699), sai se estiver fora, e chama `render(progressoDoScroll(secao))`.
  - `render(p)` é o porte **literal** das linhas 643–692, com estas trocas de acesso: `$('hsCard')` → `cardRef.current`; `CAPS` → `capsRef.current.children`; `O[i]` → `objsRef.current.querySelector(`[data-objeto="${i}"]`)`; `COIN[i][k]` → `[data-moeda="${i}-${k}"]`; `V[i]` → `[data-valor="${i}"]`; `G` → `[data-fantasma]`; `line/gap/ok/sparks` → `[data-linha]`, `[data-selo="gap"]`, `[data-selo="ok"]`, `[data-brilhos]`; troca de expressão via `expressaoEm(p)`; legendas via `legendaEm(i, p)`. Colete os elementos uma vez num `useEffect([])` numa ref (não chame `querySelector` a cada frame). `ease`→`easeInOutQuad`, `easeIn`→`easeInCubic`, `back`→`easeOutBack`.
- `page.tsx`: `<HistoriaDonaAna />` entre `<Hero />` e `<article>`.

- [ ] **Step 6: Paridade da história**

Run: `npm run test:paridade -- -g "historia|reduzido|console"`
Expected: PASS em `historia` (14), `reduzido` (4), `console` (1).
Diferenças comuns: texto SVG sem `styles.texto` (fonte errada), `transform-origin`/`transform-box` perdidos no porte do CSS, `key` da Ana remontando a cada frame.

- [ ] **Step 7: Lint e commit**

Run: `npm run lint` e `npm test`
Expected: sem erros; testes unitários passando.

```bash
git add -A
git commit -m "feat: história da Dona Ana em componentes"
```

---

### Task 5: Verificação completa, publicação e documentação

**Files:**
- Modify: `scripts/publicar.ps1`
- Modify: `README.md`
- Modify: `docs/superpowers/specs/2026-09-24-migracao-nextjs-design.md` (status)

**Interfaces:**
- Consumes: página completa das Tarefas 1–4

- [ ] **Step 1: Suíte completa**

Run: `npm run lint; npm test; npm run test:paridade`
Expected: lint limpo; unitários PASS; paridade PASS em todos os grupos (`hero` 8, `historia` 14, `conteudo` 28, `rodape` 2, `reduzido` 4, `console` 1, `ancoras` 1 = 58 testes).

- [ ] **Step 2: `scripts/publicar.ps1` para o build do Next**

Substitua o conteúdo por:

```powershell
# Gera o site estatico (Next.js) e copia para a pasta publicada na rede.
# Uso:  .\scripts\publicar.ps1            (destino padrao: D:\dev\sisconforme-publicar)
#       .\scripts\publicar.ps1 -Destino "E:\outra-pasta"
param([string]$Destino = "D:\dev\sisconforme-publicar")

$ErrorActionPreference = "Stop"
$raiz = Split-Path $PSScriptRoot -Parent

Push-Location $raiz
try { npm run build; if ($LASTEXITCODE -ne 0) { throw "npm run build falhou" } }
finally { Pop-Location }

$out = Join-Path $raiz "out"
if (-not (Test-Path (Join-Path $out "index.html"))) { throw "Build sem out/index.html" }

# A pasta de destino e gerada: limpa e copia o build inteiro
if (Test-Path $Destino) { Get-ChildItem $Destino -Force | Remove-Item -Recurse -Force }
else { New-Item -ItemType Directory $Destino | Out-Null }
Copy-Item -Path (Join-Path $out "*") -Destination $Destino -Recurse

$n = (Get-ChildItem $Destino -Recurse -File | Measure-Object).Count
Write-Host "Publicado em $Destino : $n arquivos"
```

Run: `.\scripts\publicar.ps1`
Expected: `Publicado em D:\dev\sisconforme-publicar : N arquivos`, com `index.html` e `_next/` na pasta.

Observação: o build copia **todo** o `public/` para `out/` (inclusive os vídeos, ~16 MB). É o comportamento do Next; aceitável.

- [ ] **Step 3: README**

No `README.md`, substitua as seções "Ver a página", "Publicar na rede interna" e "Migração para Next.js (roteiro)" por:

```markdown
## Desenvolvimento

npm install
npm run dev          # http://localhost:3000

## Testes

npm test             # unitários (Vitest)
npm run test:paridade  # build + comparação visual com site/index.html (Playwright, usa o Chrome instalado)

As capturas e diferenças ficam em test-results/paridade/.

## Publicar na rede interna

.\scripts\publicar.ps1
python -m http.server 8080 --directory D:\dev\sisconforme-publicar

O endereço para os colegas é http://<seu-ip>:8080 (a porta 8080 precisa estar liberada no firewall).
A fonte Inter vai embutida no build: a página funciona mesmo em computadores sem internet.
```

(com os blocos de comando formatados como `powershell`), e atualize a árvore da seção "Estrutura" incluindo `src/app`, `src/components`, `src/lib`, `tests/` e a nota de que `site/index.html` é a referência da paridade.

No spec, troque `**Status:** aguardando revisão` por `**Status:** implementado`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: publicação via build do Next, README e status do design"
```

**Fora deste plano (depois da aprovação visual do usuário):** mover `site/index.html` para `_arquivo/landing-html/` e remover o teste de paridade ou apontá-lo para a cópia arquivada.
