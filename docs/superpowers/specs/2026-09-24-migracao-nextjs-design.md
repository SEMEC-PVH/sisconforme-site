# Migração da landing SISConforme para Next.js

**Data:** 2026-09-24 · **Status:** aguardando revisão

## Objetivo

Converter `site/index.html` (HTML, CSS e JS num arquivo só) em um projeto Next.js com TypeScript,
**sem mudança visual nem de comportamento**. A página convertida deve ser idêntica à atual no
desktop e no celular, incluindo o scroll do hero, a animação da Dona Ana, o gráfico e o carrossel.

**Fora do escopo:** novas funcionalidades, mudanças de texto ou de design, backend, deploy em nuvem.

## Decisões

| Tema | Escolha | Motivo |
|---|---|---|
| Linguagem | TypeScript | Pedido do usuário |
| Roteamento | App Router | Padrão atual do Next.js |
| Estilos | CSS Modules + `globals.css` | Resultado idêntico ao CSS atual, sem reescrever em outra sintaxe |
| Pasta do código | `src/` | Separa o código de `design/`, `_arquivo/` e `docs/` |
| Build | `output: 'export'` (site estático em `out/`) | Continua publicável na rede com `python -m http.server`, sem servidor Node |
| Imagens | `next/image` com `images.unoptimized: true` | Exigido pelo export estático |
| Fonte | `next/font/google` (Inter) | Os arquivos da fonte são embutidos no build: a página funciona sem internet na rede interna |
| Linter | ESLint (padrão do create-next-app) | Pega erros no build |

## Estrutura

```
src/
  app/
    layout.tsx          <html lang="pt-BR">, fonte Inter, metadados (título, descrição, Open Graph)
    page.tsx            monta as seções na ordem atual
    globals.css         tokens de cor, reset, estilos base (h1–h3, p, a, :focus-visible)
    icon.svg            favicon (símbolo em marfim sobre fundo tinta)
  components/
    BrandMark.tsx       símbolo das três casas (SVG, currentColor)
    Nav.tsx             menu fixo; fica "sólido" ao passar do hero            [client]
    SideNav.tsx         marcadores laterais da seção ativa                       [client]
    Hero.tsx            três painéis + coreografia do scroll                      [client]
    historia/
      HistoriaDonaAna.tsx  seção #como-funciona, pin + timeline do scroll        [client]
      Ana.tsx              personagem SVG por expressão
      objetos.tsx          cartão, NFS-e, PGDAS, moedas, selos (SVG)
      roteiro.ts           legendas, janelas de tempo e expressões
    Introducao.tsx      texto da introdução
    Cruzamento.tsx      texto + tabela comparativa + notas
    GraficoAbas.tsx     gráfico com abas (linha/barras)                          [client]
    CarrosselPerfis.tsx cenários por perfil de usuário                           [client]
    Comunicacao.tsx     notificação tradicional × alerta
    Seguranca.tsx       seção de segurança
    Disponibilidade.tsx seção final
    Footer.tsx          rodapé
  lib/
    scroll.ts           clamp, seg, easings e hook useScrollProgress
public/                 (já existe, sem mudanças)
```

Cada componente tem o seu `.module.css` com o trecho correspondente do CSS atual.

## Como o JS atual vira React

- **Seções só de conteúdo** (Introdução, Cruzamento, Comunicação, Segurança, Disponibilidade, Footer)
  viram componentes de servidor: HTML puro, sem JavaScript no navegador.
- **Seções interativas** viram componentes `"use client"`. A lógica de scroll continua
  **imperativa**: um `useEffect` registra o listener de scroll e, a cada `requestAnimationFrame`,
  escreve estilos direto nos elementos via `ref`. Não passa por `useState` a cada quadro,
  para manter a fluidez atual (60 fps).
- A troca de expressão da Dona Ana usa estado React (muda poucas vezes), e o "pop" da troca
  continua em CSS.
- O gráfico passa a ser JSX gerado a partir dos mesmos dados (hoje é string HTML).
- Nav, SideNav e Hero compartilham a posição do hero lendo `#top` no scroll, como hoje.
- `prefers-reduced-motion`: mesmo comportamento atual (hero já aberto, história estática
  com roteiro em texto, animações CSS desligadas).

## Publicação

- `npm run dev`: desenvolvimento em `http://localhost:3000`.
- `npm run build`: gera `out/` (site estático completo).
- `scripts/publicar.ps1` passa a rodar o build e copiar `out/` para `D:\dev\sisconforme-publicar`.
  O comando para servir na rede continua o mesmo.

## Verificação

1. `npm run build` sem erros de TypeScript nem de ESLint.
2. Comparação lado a lado com `site/index.html` no Chrome, em 1280×800 e 390×844, nos mesmos
   pontos de scroll: hero (início, meio, fim), as 7 cenas da Dona Ana, tabela, gráfico (as duas
   abas), carrossel (os quatro perfis), comunicação e rodapé.
3. Console sem erros; navegação pelas âncoras do menu, do sumário do hero e do rodapé.
4. Modo "reduzir movimento" simulado.
5. `out/` servido pelo `python -m http.server` abre igual.

## Depois da aprovação visual

`site/index.html` vai para `_arquivo/landing-html/`, e o README é atualizado para o fluxo Next.js.
Cada etapa da migração é um commit separado no git.
