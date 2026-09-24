# Prompt para o Gemini Omni — vídeo da logo SISConforme

## Antes de gerar

1. Abra o Gemini (ou o Flow / AI Studio) e escolha o modelo de vídeo **Omni**.
2. Anexe as imagens desta pasta:
   - `simbolo-referencia.png` como **imagem de referência** (o desenho exato do símbolo).
   - `quadro-final-16x9.png` como **último quadro** (last frame), para o vídeo terminar exatamente na logo correta.
   - Para stories/Reels, use `quadro-final-9x16.png` e peça proporção 9:16.
   - Se tiver uma foto real das Três Caixas d'Água de Porto Velho, anexe também como referência da cena inicial.
3. Configurações: proporção **16:9** (ou 9:16), **1080p**, duração **8 a 10 segundos**.

## Prompt principal (16:9)

```
Cinematic 10-second brand reveal for "SISConforme", a public tax-compliance portal from the city of Porto Velho, Brazil. Single continuous shot, no scene cuts.

[0-3s] Golden-hour aerial view over the wide, calm, muddy-brown Madeira River in Porto Velho, Amazon rainforest on the far bank, sky fading from deep navy to orange with a thin red glow on the horizon. The camera glides slowly forward and down toward three identical historic riveted-iron water towers standing side by side on tall slender steel legs (the "Três Caixas d'Água" landmark), seen as dark silhouettes against the sunset.

[3-6s] As the camera approaches, the three water towers simplify into minimalist line art: each tower becomes a single continuous ivory line (#F2EDE4) shaped like a house with a pointed roof and a rounded U-shaped base. The three shapes are drawn by a soft light trail from the bottom up, one after another from left to right, stepping down diagonally and overlapping exactly like the attached reference symbol. The roofs settle into place last. Meanwhile the landscape fades into a near-black background (#141413) with a warm terracotta glow (#D97757) rising from the bottom edge.

[6-10s] The finished symbol slides slightly left and the word "SISConforme" fades in to its right in a clean white sans-serif typeface. Hold still on the final composition, which must match the attached last frame exactly.

Style: premium, minimal, editorial motion design; flat 2D line animation for the logo phase, photographic realism for the river phase; subtle film grain; smooth ease-in-out motion; lines with rounded ends and constant thickness.

Audio: calm ambient river sounds and distant birds at the start, a warm low synth pad building gently, a soft airy whoosh as each line is drawn, and one clean soft chime when the word appears. No dialogue, no voice-over, no lyrics, no extra sound effects.

Keep the symbol geometry identical to the reference image: three house-shaped outlines, same stroke weight, same diagonal offset, only the front shape has a closed U. Do not add water, colors, gradients, shadows, 3D extrusion or extra elements to the logo. Do not add any other text, watermark or subtitles. No people.
```

## Versão vertical (9:16, stories e Reels)

Use o mesmo prompt trocando o bloco final por:

```
[6-10s] The finished symbol moves slightly up and the word "SISConforme" fades in centered below it in a clean white sans-serif typeface. Keep all content away from the top 13% and bottom 18% of the frame. Hold still on the final composition, which must match the attached last frame exactly.
```

## Prompts de ajuste (mande na mesma conversa, depois de gerar)

- Logo deformada: `Keep everything else the same. Redraw the three line shapes so they match the reference symbol exactly: same proportions, same stroke weight, same overlap. No distortion.`
- Muito rápido: `Keep everything else the same. Make the line-drawing phase slower and smoother, starting at 3 seconds and finishing at 7 seconds.`
- Texto errado: `Keep everything else the same. Remove the text entirely.` (e depois coloque o nome no editor de vídeo)
- Sem a cena do rio: `Keep everything else the same. Start directly on the near-black background with the terracotta glow; skip the river footage.`
- Trilha diferente: `Keep the video the same. Replace the music with a minimal piano note sequence, slow and warm. No voice.`

## Observações

- O Omni ainda erra texto e logotipos. Por isso o último quadro anexado é o que garante a logo certa no final. Se o nome sair errado, peça a versão sem texto e aplique o nome no CapCut/Premiere.
- Limite atual: até 40 s por vídeo, em blocos de 10 s; 16:9 ou 9:16; até 1080p (4K por upscale).
- As Três Caixas d'Água descritas no prompt são genéricas; uma foto real anexada deixa a cena inicial mais fiel.
