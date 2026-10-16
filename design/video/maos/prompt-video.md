# Prompt para o vídeo do aperto de mãos (Gemini Omni / Veo)

## Antes de gerar

1. Abra o Gemini (ou o Flow / AI Studio) e escolha o modelo de vídeo **Omni** (ou Veo).
2. Anexe as imagens desta pasta:
   - `quadro-inicial-16x9.png` como **primeiro quadro** (first frame).
   - `quadro-final-16x9.png` como **último quadro** (last frame).
   - Se a ferramenta aceitar imagens de referência extras, anexe também `mao-homem.png` e `mao-mulher.png`.
3. Configurações: proporção **16:9**, a maior resolução disponível (**4K** ou 1080p), duração **6 a 8 segundos**, **sem áudio** (o site não usa som).
4. Gere 2 ou 3 versões e escolha a melhor (veja "O que conferir" abaixo).

## Prompt principal

```
Smooth handshake animation on a flat chroma green background. Single continuous shot, locked-off static camera, no cuts, no zoom, no camera movement.

The video starts exactly on the attached first frame: a man's arm enters from the left (light-blue dress shirt with a white cuff button, silver wristwatch with white dial and black leather strap, warm tan skin) and a woman's arm enters from the right (navy-blue suit sleeve over a white shirt cuff, brown skin, natural pink nails). Both open hands are extended toward each other with a gap between the fingertips.

[0-4s] Both hands move toward each other at a slow, CONSTANT, even speed (no pause at the start, no sudden acceleration), the man's hand slightly rotating so that the palms meet, and they close into a firm handshake in the center of the frame.
[4-6s] The clasped hands give two gentle, small up-and-down shakes, smooth and soft.
[6-8s] The hands come to rest and hold still, matching the attached last frame exactly.

Style: the same semi-realistic 3D illustrated render as the attached frames, warm golden lighting, soft highlights, identical sleeves, watch, skin tones and nails in every frame.

Background: flat, solid, uniform pure chroma green #00FF00 in every frame, from the first to the last. No shadows on the background, no floor, no gradients, no vignette, no reflections, no motion blur trails, no light spill.

Hands: anatomically correct in every frame, each hand always has exactly one thumb and four fingers, never six fingers, no extra or merging fingers, no fingers passing through each other. The wristwatch stays on the man's wrist and keeps the same shape.

Nothing else in the frame: no other people, no faces, no bodies, no objects, no text, no logos, no watermark, no subtitles.
```

## Prompts de ajuste (na mesma conversa, depois de gerar)

- Movimento travado ou com saltos:
  `Same video, but make the approach of the hands perfectly smooth and continuous, with an even speed from the first frame until the hands meet. No hold at the beginning.`
- Dedos deformados no encaixe:
  `Same video, but keep the hands anatomically correct while they close: exactly one thumb and four fingers per hand in every frame, the woman's fingers wrapping under the man's palm, her little finger hidden.`
- Fundo com sombra ou variação de verde:
  `Same video, but the background must stay flat pure chroma green #00FF00 in every frame, with no shadows, gradients or light spill on it.`
- Balanço exagerado:
  `Same video, but make the handshake shake smaller and slower: two gentle small shakes, then hold still.`

## O que conferir antes de usar

- **Fundo:** verde liso o tempo todo, sem sombra e sem verde refletido na pele, para o recorte sair limpo.
- **Dedos:** pause no encaixe e no balanço e conte, um polegar e quatro dedos por mão.
- **Ritmo:** a aproximação deve ter velocidade constante. O vídeo antigo ficava parado no começo e dava saltos no aperto, por isso a animação no site travava.
- **Enquadramento:** as mãos sempre dentro da tela e a câmera parada.
- **Detalhes:** relógio, botão do punho e unhas iguais do começo ao fim.

## Depois de escolher

1. Salve o vídeo como `design/video/aperto-de-maos-v2.mp4`.
2. Avise o Claude. Ele vai:
   - recortar o fundo verde com `design/video/extrair-quadros-aperto.py`, gerando os quadros em `public/img/aperto/`;
   - atualizar em `src/components/trajetoria/roteiro.ts` o número de quadros (`QUADROS_APERTO`), o recorte (`RECORTE_APERTO`), o quadro do encaixe (`QUADRO_ENCAIXE`) e o movimento por quadro (`MOVIMENTO_APERTO`);
   - conferir a rolagem no navegador e rodar os testes.
3. Para recortar o fundo é preciso ter o `ffmpeg` instalado: `winget install ffmpeg`.
