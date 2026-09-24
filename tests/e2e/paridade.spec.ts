import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { expect, test, type Browser, type Locator, type Page } from "@playwright/test";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const ORIGINAL = pathToFileURL(path.resolve(__dirname, "../../site/index.html")).href;
const NOVO = "http://localhost:4173/";
const SAIDA = path.resolve(__dirname, "../../test-results/paridade");
/** Fração máxima de pixels diferentes aceita por captura (pior caso medido: 0.08%). */
const LIMITE = 0.003;

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

/**
 * Captura a primeira pintura: original com JS normal (como as demais capturas), novo com
 * JS desabilitado (sem hidratação) — para garantir que os defaults de CSS já batem com o
 * que o JS escreveria em p=0 (ou p=0.6 sob prefers-reduced-motion).
 */
async function capturarPrimeiraPintura(browser: Browser, url: string, vp: { width: number; height: number }, comJs: boolean) {
  const ctx = await browser.newContext({ viewport: vp, javaScriptEnabled: comJs });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "load" });
  if (comJs) {
    await page.evaluate(() => document.fonts.ready);
  } else {
    await page.waitForLoadState("load");
    await page.waitForTimeout(700);
  }
  const png = await page.screenshot({ animations: "disabled", caret: "hide" });
  await ctx.close();
  return png;
}

for (const [nomeVp, vp] of Object.entries(VIEWPORTS)) {
  test(`primeira-pintura · ${nomeVp} · hero`, async ({ browser }) => {
    const original = await capturarPrimeiraPintura(browser, ORIGINAL, vp, true);
    const novo = await capturarPrimeiraPintura(browser, NOVO, vp, false);
    const razao = comparar(original, novo, path.join(SAIDA, `${nomeVp}-primeira-pintura-hero`));
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
  await page.goto(NOVO, { waitUntil: "load" });
  const altura = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < altura; y += 400) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(30);
  }
  for (const aba of ["Regularização após o alerta", "Contador", "Auditor", "Procurador"]) {
    const tab = page.getByRole("tab", { name: aba });
    if (await tab.count()) await tab.click();
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
  await page.goto(NOVO, { waitUntil: "load" });

  // rodapé
  for (const id of ["introducao", "cruzamento", "comunicacao", "seguranca", "disponibilidade"]) {
    const link = page.locator(`footer a[href="#${id}"]`).first();
    if ((await link.count()) === 0) continue;
    await link.click();
    await esperarNoTopo(page, id);
  }

  // menu fixo (cabeçalho)
  const linksMenu = page.locator('header a[href^="#"]');
  const totalMenu = await linksMenu.count();
  for (let i = 0; i < totalMenu; i++) {
    const link = linksMenu.nth(i);
    const href = await link.getAttribute("href");
    const id = href?.slice(1) ?? "";
    if (!id || id === "top") continue;
    if ((await page.locator(`#${id}`).count()) === 0) continue;
    await link.click();
    await esperarNoTopo(page, id);
  }

  // sumário do hero (só visível/clicável com o titleblock exibido, ~p>=0.5; o original mostra a partir de p≈0.3)
  await rolar(page, "top", 0.7);
  const linksToc = page.locator("#top ol a");
  const totalToc = await linksToc.count();
  for (let i = 0; i < totalToc; i++) {
    const link = linksToc.nth(i);
    const href = await link.getAttribute("href");
    const id = href?.slice(1) ?? "";
    if (!id) continue;
    await link.click();
    await esperarNoTopo(page, id);
    await rolar(page, "top", 0.7);
  }

  await ctx.close();
});
