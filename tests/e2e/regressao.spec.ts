import path from "node:path";
import { expect, test, type Browser, type Locator, type Page } from "@playwright/test";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

/**
 * Regressão visual contra as fotos de referência em regressao.spec.ts-snapshots/.
 * A referência é a página aprovada; para aceitar uma mudança visual intencional:
 *   npx playwright test --update-snapshots
 */
const SITE = "http://localhost:4173/";
/** Fração máxima de pixels diferentes aceita por captura. */
const LIMITE = 0.003;

const VIEWPORTS = {
  desktop: { width: 1280, height: 800 },
  celular: { width: 390, height: 844 },
} as const;
type Viewport = (typeof VIEWPORTS)[keyof typeof VIEWPORTS];

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

/**
 * As seções de conteúdo têm animações de entrada (GSAP); elas são capturadas com
 * "reduzir movimento" para comparar sempre o estado final. As animações em si são
 * cobertas pelo teste "animacoes" abaixo.
 */
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
    movimentoReduzido: true,
  })),
  {
    grupo: "conteudo",
    nome: "grafico-regularizacao",
    preparar: clicarAba(5, "Regularização após o alerta"),
    alvo: blocoDoArtigo(5),
    movimentoReduzido: true,
  },
  ...["Contador", "Auditor", "Procurador"].map<Ponto>((nome) => ({
    grupo: "conteudo",
    nome: `carrossel-${nome.toLowerCase()}`,
    preparar: clicarAba(7, nome),
    alvo: blocoDoArtigo(7),
    movimentoReduzido: true,
  })),
  { grupo: "rodape", nome: "rodape", preparar: (p) => rolarAte(p, p.locator("footer")), alvo: (p) => p.locator("footer") },
  { grupo: "reduzido", nome: "hero", preparar: (p) => rolar(p, "top", 0), alvo: () => null, movimentoReduzido: true },
  { grupo: "reduzido", nome: "historia", preparar: (p) => rolar(p, "como-funciona", 0), alvo: () => null, movimentoReduzido: true },
];

async function capturar(browser: Browser, vp: Viewport, ponto: Ponto) {
  const ctx = await browser.newContext({
    viewport: vp,
    reducedMotion: ponto.movimentoReduzido ? "reduce" : "no-preference",
  });
  const page = await ctx.newPage();
  await page.goto(SITE, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await ponto.preparar(page);
  const alvo = ponto.alvo(page);
  const png = alvo
    ? await alvo.screenshot({ animations: "disabled", caret: "hide" })
    : await page.screenshot({ animations: "disabled", caret: "hide" });
  await ctx.close();
  return png;
}

for (const [nomeVp, vp] of Object.entries(VIEWPORTS)) {
  for (const ponto of PONTOS) {
    test(`${ponto.grupo} · ${nomeVp} · ${ponto.nome}`, async ({ browser }) => {
      const png = await capturar(browser, vp, ponto);
      expect(png).toMatchSnapshot(`${nomeVp}-${ponto.grupo}-${ponto.nome}.png`, { maxDiffPixelRatio: LIMITE });
    });
  }
}

/** Fração de pixels diferentes entre duas capturas do mesmo tamanho (1 se o tamanho difere). */
function diferenca(a: Buffer, b: Buffer): number {
  const A = PNG.sync.read(a);
  const B = PNG.sync.read(b);
  if (A.width !== B.width || A.height !== B.height) return 1;
  const n = pixelmatch(A.data, B.data, null, A.width, A.height, { threshold: 0.1 });
  return n / (A.width * A.height);
}

/**
 * Primeira pintura: a página sem JavaScript (antes da hidratação) deve ser igual à
 * página com JavaScript no topo — os defaults de CSS precisam bater com o que o JS
 * escreve em p=0.
 */
async function capturarTopo(browser: Browser, vp: Viewport, comJs: boolean) {
  const ctx = await browser.newContext({ viewport: vp, javaScriptEnabled: comJs });
  const page = await ctx.newPage();
  await page.goto(SITE, { waitUntil: "load" });
  if (comJs) await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(700);
  const png = await page.screenshot({ animations: "disabled", caret: "hide" });
  await ctx.close();
  return png;
}

for (const [nomeVp, vp] of Object.entries(VIEWPORTS)) {
  test(`primeira-pintura · ${nomeVp} · hero`, async ({ browser }) => {
    const comJs = await capturarTopo(browser, vp, true);
    const semJs = await capturarTopo(browser, vp, false);
    const razao = diferenca(comJs, semJs);
    expect(razao, `pixels diferentes: ${(razao * 100).toFixed(2)}%`).toBeLessThan(LIMITE);
  });
}

test("console · sem erros ao percorrer a página", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: VIEWPORTS.desktop });
  const page = await ctx.newPage();
  const erros: string[] = [];
  page.on("pageerror", (e) => erros.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") erros.push(m.text());
  });
  await page.goto(SITE, { waitUntil: "load" });
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

async function esperarNoTopo(page: Page, id: string) {
  await page.waitForTimeout(1200);
  const topo = await page.evaluate((i) => document.getElementById(i)!.getBoundingClientRect().top, id);
  expect(Math.abs(topo), `#${id} deveria estar no topo, está a ${topo}px`).toBeLessThan(120);
}

test("ancoras · links internos levam às seções", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: VIEWPORTS.desktop });
  const page = await ctx.newPage();
  await page.goto(SITE, { waitUntil: "load" });

  // rodapé
  for (const id of ["introducao", "cruzamento", "comunicacao", "seguranca", "disponibilidade"]) {
    await page.locator(`footer a[href="#${id}"]`).first().click();
    await esperarNoTopo(page, id);
  }

  // menu fixo (cabeçalho)
  const linksMenu = page.locator('header a[href^="#"]');
  const totalMenu = await linksMenu.count();
  for (let i = 0; i < totalMenu; i++) {
    const link = linksMenu.nth(i);
    const id = (await link.getAttribute("href"))?.slice(1) ?? "";
    if (!id || id === "top" || (await page.locator(`#${id}`).count()) === 0) continue;
    await link.click();
    await esperarNoTopo(page, id);
  }

  // sumário do hero (clicável quando o bloco do título está visível, p≈0.7)
  await rolar(page, "top", 0.7);
  const linksToc = page.locator("#top ol a");
  const totalToc = await linksToc.count();
  for (let i = 0; i < totalToc; i++) {
    const link = linksToc.nth(i);
    const id = (await link.getAttribute("href"))?.slice(1) ?? "";
    if (!id || (await page.locator(`#${id}`).count()) === 0) continue;
    await link.click();
    await esperarNoTopo(page, id);
    await rolar(page, "top", 0.7);
  }

  await ctx.close();
});
