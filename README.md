# SISConforme · Frontend

Landing page do SISConforme, o portal de autorregularização do ISSQN de Porto Velho (SEMEC).
Hoje é um HTML estático; o próximo passo é migrar para Next.js.

## Estrutura

```
site/index.html        Landing atual (HTML, CSS e JS num arquivo só). Referência para a migração.
public/                Tudo o que o site serve. Vira o public/ do Next.js sem mudanças.
  img/hero/            As três imagens do hero (.webp)
  img/og-image.jpg     Imagem de compartilhamento (Open Graph)
  brand/               Kit oficial da marca: logos horizontal e vertical, símbolo, ícone de app
  brand/animado/       Versões animadas (SVG) do logo e do símbolo
  illustrations/       Ilustrações avulsas (moedas caindo)
  video/               Vídeos da marca (.mp4)
design/                Material de criação. Não vai para o site.
  marca/               SVG original do símbolo (Recraft), prompts de logo, logo antigo
  ilustracoes-originais/  Artes em PNG que deram origem às imagens do hero
  mascote/             Estudos do mascote/avatar
  video/               Prompts e fonte HTML dos vídeos
_arquivo/              Histórico: backups da landing e esboços. Pode ser apagado quando não fizer falta.
scripts/publicar.ps1   Monta a pasta publicada na rede
```

## Ver a página

Abra `site/index.html` no navegador (dois cliques). As imagens vêm de `../public/`.

## Publicar na rede interna

```powershell
.\scripts\publicar.ps1
python -m http.server 8080 --directory D:\dev\sisconforme-publicar
```

O script copia para `D:\dev\sisconforme-publicar` somente o `index.html` e os arquivos de `public/`
que a página usa, trocando `../public/` pela raiz, como o Next.js faz.
O endereço para os colegas é `http://<seu-ip>:8080` (a porta 8080 precisa estar liberada no firewall).

## Identidade visual

- Fonte: **Inter** (títulos em SemiBold 600, espaçamento −0,01em)
- Cores: tinta `#141413`, marfim `#FAF9F5`, argila `#D97757` / `#C15F3C`, verde `#3C9A6B`, ouro `#D4A12A`
- Símbolo: três casas com setas. Na página ele está embutido como SVG (menu, rodapé e favicon).

## Migração para Next.js (roteiro)

1. Criar o projeto Next.js nesta pasta e manter `public/` como está.
2. Quebrar `site/index.html` em componentes: Nav, Hero, HistoriaDonaAna (`#como-funciona`),
   Introducao, Cruzamento (tabela e gráfico), Comunicacao, Seguranca, Disponibilidade, Footer.
3. Trocar os caminhos `../public/img/...` por `/img/...` e as fontes do Google por `next/font` (Inter).
4. Os scripts de scroll (hero e história da Dona Ana) viram componentes client-side (`"use client"`).

O backend (Django) não faz parte deste projeto. O repositório dele fica em
`https://git.portovelho.ro.gov.br/semec/sisconforme-backend`.
