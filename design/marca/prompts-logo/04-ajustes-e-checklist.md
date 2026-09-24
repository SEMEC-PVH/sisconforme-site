# 04: Ajustes, vetorização e checklist

## Negative prompt (o que evitar)

Cole em ferramentas que tenham campo de *negative prompt*, ou use com `--no` no Midjourney:

```
text, letters, words, watermark, signature, gradient, shadow, drop shadow, glow, 3d, bevel, emboss, texture, grunge, rust, rivets, photorealistic, sketch, hand drawn, rounded line caps, rounded corners, thin hairlines, multiple colors, trees, houses, clouds, sun, water splash, water drops, background scene, frame, border, mockup
```

> "water drops / splash" está aí de propósito: a IA tende a enfiar gotas d'água no desenho, e isso deixa a logo com cara de empresa de saneamento. O símbolo é sobre as **torres** (marco de Porto Velho), não sobre água.

---

## Prompts de correção (para mandar depois da primeira imagem)

Útil principalmente no ChatGPT, onde dá para iterar na mesma conversa.

| Problema | Mande |
|---|---|
| Detalhe demais | `Simplify further: remove every line that is not essential. Keep only roof, tank and legs. Same stroke weight everywhere.` |
| Traço fino / irregular | `Make all strokes the same thickness, about 10% of the icon width, with square line caps and sharp corners.` |
| Pontas arredondadas | `Replace all rounded line ends and rounded corners with square caps and sharp miter corners.` |
| Torres diferentes entre si | `Make the three towers exactly identical in size and shape, evenly spaced, perfectly aligned on the same baseline.` |
| Parece realista / 3D | `Flat 2D vector only, no perspective, no shading, front elevation view.` |
| Não lembra o ícone atual | `The triangular roofs should look like sharp mountain peaks, similar to a two-peak monoline icon. Match that angle and weight.` |
| Ficou com fundo / cena | `Remove the background scene. Only the symbol, centered, on a plain #FAF9F5 background.` |
| Cores erradas | `Use only #141413 for all lines on a #FAF9F5 background. No other colors.` |
| Torres muito altas/finas | `Make the proportions more compact and square so the symbol fits a square icon: shorter legs, wider tanks.` |

---

## Vetorização (PNG → SVG)

Imagem gerada é PNG. Logo precisa ser SVG. Opções:

1. **Recraft**: gere já em modo vetor ou use *Vectorize*
2. **vectorizer.ai**: faz upload do PNG e baixa em SVG
3. **Illustrator**: *Image Trace* → preset *Black and White Logo* → *Expand*
4. **Redesenhar à mão (recomendado para a versão final)**: use a imagem da IA só como rascunho e redesenhe no Figma com a ferramenta *Pen*, numa grade de **24×24**, traço **2,4 px**, *cap: square*, *join: miter*. É assim que o ícone atual foi feito, e a logo fica com a mesma precisão.

> Se quiser, me mande a imagem escolhida que eu redesenho em SVG no mesmo padrão do ícone atual (grade 24×24, `stroke-width="2.4"`, `currentColor`), pronto para colar na landing.

---

## Checklist final

- [ ] Funciona **sem o texto** (só o símbolo já identifica o sistema)
- [ ] Legível em **16 px** (favicon)
- [ ] Funciona em **uma cor só** (preto no branco e branco no preto)
- [ ] Traço **uniforme**, pontas **retas**, cantos **vivos**, igual ao ícone atual
- [ ] As três torres são **iguais e alinhadas** (conformidade = equilíbrio)
- [ ] Os telhados lembram os **picos** do ícone atual (continuidade da marca)
- [ ] Nome escrito exatamente **SISConforme**
- [ ] Sem gotas d'água, sombras, gradientes ou texturas
- [ ] Arquivos exportados: `logo-simbolo.svg`, `logo-horizontal.svg`, `logo-vertical.svg`, `logo-negativo.svg`, `favicon.svg`, `favicon-32.png`, `app-icon-512.png`
