# SISConforme · Frontend

Landing page do SISConforme, o portal de autorregularização do ISSQN de Porto Velho (SEMEC).
Construída em Next.js 16 (App Router, TypeScript, export estático).

## Estrutura

```
src/app/                Layout, página raiz, globals.css, icon.svg (App Router, output: export)
src/components/         Nav, SideNav, Hero, Footer, BrandMark, Introducao, Cruzamento,
                         GraficoAbas, CarrosselPerfis, Comunicacao, SegurancaEDisponibilidade
  historia/              HistoriaDonaAna, Ana, objetos, roteiro (seção "como funciona")
src/lib/scroll.ts       Utilitários de scroll (hero, história, âncoras)
tests/unit/             Testes unitários (Vitest)
tests/e2e/              Regressão visual (Playwright) + fotos de referência em regressao.spec.ts-snapshots/
public/                 Tudo o que o site serve; usado pelo Next.js sem mudanças.
  img/hero/             As três imagens do hero (.webp)
  img/og-image.jpg      Imagem de compartilhamento (Open Graph)
  brand/                Kit oficial da marca: logos horizontal e vertical, símbolo, ícone de app
  brand/animado/        Versões animadas (SVG) do logo e do símbolo
  illustrations/        Ilustrações avulsas (moedas caindo)
  video/                Vídeos da marca (.mp4)
design/                 Material de criação. Não vai para o site.
  marca/                SVG original do símbolo (Recraft), prompts de logo, logo antigo
  ilustracoes-originais/  Artes em PNG que deram origem às imagens do hero
  mascote/              Estudos do mascote/avatar
  video/                Prompts e fonte HTML dos vídeos
_arquivo/               Histórico: backups da landing e esboços. Pode ser apagado quando não fizer falta.
scripts/publicar.ps1    Builda o site (Next.js) e monta a pasta publicada na rede
```

## Desenvolvimento

```powershell
npm install
npm run dev          # http://localhost:3000
```

## Testes

```powershell
npm test             # unitários (Vitest)
npm run test:visual  # build + comparação com as fotos de referência (Playwright, usa o Chrome instalado)
```

Se um teste falhar, a captura nova e a diferença ficam em `test-results/`.
Para aceitar uma mudança visual intencional, atualize as referências:
`npx playwright test --update-snapshots` (depois de `npm run build`).

A versão HTML original da landing está em `_arquivo/landing-html/index.html`.

## Publicar na rede interna

```powershell
.\scripts\publicar.ps1 -SiteUrl "http://10.102.2.21:8080"
python -m http.server 8080 --directory D:\dev\sisconforme-publicar
```

O endereço para os colegas é `http://<seu-ip>:8080` (a porta 8080 precisa estar liberada no firewall).
A fonte Inter vai embutida no build: a página funciona mesmo em computadores sem internet.

`-SiteUrl` é opcional: quando informado, define `NEXT_PUBLIC_SITE_URL` durante o build para que a
imagem de Open Graph (`og:image`) aponte para o endereço publicado, em vez de `http://localhost:3000`.

O build usa caminhos absolutos (`/_next/…`, `/img/…`), então `out/` precisa ser servido na raiz de um
servidor web — não abra `index.html` direto via `file://` nem sirva a pasta a partir de uma subpasta.
Para publicar em uma subpasta, configure `basePath` em `next.config.ts`.

## Identidade visual

- Fonte: **Inter** (títulos em SemiBold 600, espaçamento −0,01em)
- Cores: tinta `#141413`, marfim `#FAF9F5`, argila `#D97757` / `#C15F3C`, verde `#3C9A6B`, ouro `#D4A12A`
- Símbolo: três casas com setas. Na página ele está embutido como SVG (menu, rodapé e favicon).

O backend (Django) não faz parte deste projeto. O repositório dele fica em
`https://git.portovelho.ro.gov.br/semec/sisconforme-backend`.
