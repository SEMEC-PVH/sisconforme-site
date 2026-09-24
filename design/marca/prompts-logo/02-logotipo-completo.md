# 02: Logotipo completo (símbolo + nome)

> ⚠️ **Importante:** use estes prompts para **visualizar a composição**, não como arte final. IA de imagem erra letras com frequência ("SISConfrome", "SlSConforme"...). Na versão final, cole o símbolo vetorizado ao lado do texto escrito com a fonte **Inter SemiBold** no Figma/Illustrator.
>
> Se quiser que a IA escreva o nome, use o **Ideogram** ou o **ChatGPT**, que acertam mais o texto. Coloque o nome entre aspas e confira letra por letra.

Substitua `[SÍMBOLO]` pela descrição do conceito escolhido em `01-simbolo.md`. Exemplo para o Conceito A:
`three identical minimalist monoline water towers side by side, triangular peak roofs, rectangular tanks, two straight legs each`

---

## Horizontal (símbolo à esquerda + nome): é a versão principal

É o mesmo arranjo do cabeçalho da landing: ícone, espaço de ~9 px, nome.

```
Horizontal logo lockup: on the left a minimalist monoline symbol of [SÍMBOLO], thick uniform stroke, square line caps; on the right the wordmark "SISConforme" set in a clean geometric sans-serif similar to Inter SemiBold, tight letter spacing, "SIS" uppercase and "Conforme" with capital C. Symbol height matches the cap height plus a little. Everything in single color #141413 on plain #FAF9F5 background. Flat vector, generous margins, no tagline, no gradients, no shadows, no mockup. Modern civic tax-portal identity.
```

**Com a torre do meio em destaque (Conceito D):**
```
Horizontal logo lockup: left, a minimalist monoline symbol of three identical water towers, the middle tank with a small checkmark in #D97757; right, the wordmark "SISConforme" in a clean sans-serif like Inter SemiBold, tight tracking. Lines and text in #141413 on plain #FAF9F5 background. Flat vector, no gradients, no shadows, no extra text.
```

---

## Vertical (símbolo em cima, nome embaixo)

Para capa de documento, splash screen e redes sociais.

```
Vertical stacked logo: centered on top a minimalist monoline symbol of [SÍMBOLO], thick uniform stroke, square caps, sharp corners; below it, centered, the wordmark "SISConforme" in a clean geometric sans-serif similar to Inter SemiBold, tight letter spacing. Single color #141413 on plain #FAF9F5 background, flat vector, balanced proportions, lots of white space, no gradients, no shadows, no extra text.
```

---

## Com assinatura institucional

Versão para ofícios e materiais da Prefeitura/SEMEC.

```
Vertical logo lockup: minimalist monoline symbol of [SÍMBOLO] on top, the wordmark "SISConforme" below in Inter SemiBold style, and a smaller line of text underneath reading "Prefeitura de Porto Velho" in a light gray #6F6D66 sans-serif. Color #141413 on #FAF9F5 background, flat vector, clean, official, no gradients, no shadows.
```

---

## Midjourney (só para estudar a composição)

```
horizontal logo lockup, minimalist monoline icon of three water towers side by side with triangular roofs, next to the wordmark "SISConforme" in clean sans-serif, black #141413 on off-white #FAF9F5, flat vector, swiss modernist, lots of whitespace --style raw --ar 3:1 --no gradient, shadow, 3d, texture, mockup --v 7
```

---

## Como montar a versão final à mão (Figma)

1. Importe o SVG do símbolo e ajuste a altura para **24 px**
2. Texto `SISConforme`, **Inter SemiBold 600**, tamanho ~18 px, letter-spacing **−1%**
3. Espaço entre símbolo e texto: **9 px** (o mesmo `gap` da landing)
4. Alinhe o símbolo pelo **centro vertical** do texto
5. Transforme o texto em contorno (*Outline stroke / Flatten*) e exporte em SVG
