"""Extrai os quadros do aperto de mãos (fundo verde -> transparente) do vídeo 4K.

Uso: python design/video/extrair-quadros-aperto.py design/video/aperto-de-maos-4k.mp4 public/img/aperto
Gera <saida>/2560/f001.webp … f120.webp e <saida>/1280/…. Requer ffmpeg no PATH, numpy e Pillow.
Recorte: faixa de 3840 × 1161 a partir de y = 420 (mesmo enquadramento dos quadros antigos).
"""
import os
import sys, subprocess, numpy as np
from PIL import Image, ImageFilter
SRC, OUT = sys.argv[1], sys.argv[2]
only = set(int(x) for x in sys.argv[3].split(",")) if len(sys.argv) > 3 else None
W, H, Y = 3840, 1161, 420
K = np.array([23, 240, 48], np.float32)
p = subprocess.Popen(["ffmpeg","-v","error","-i",SRC,"-vf",f"format=rgb24,crop={W}:{H}:0:{Y}","-fps_mode","passthrough","-f","rawvideo","-pix_fmt","rgb24","-"], stdout=subprocess.PIPE)
for d in ("2560", "1280"):
    os.makedirs(f"{OUT}/{d}", exist_ok=True)
n = 0
while True:
    buf = p.stdout.read(W*H*3)
    if len(buf) < W*H*3: break
    n += 1
    if only and n not in only: continue
    c = np.frombuffer(buf, np.uint8).reshape(H, W, 3).astype(np.float32)
    r, g, b = c[...,0], c[...,1], c[...,2]
    ex = g - np.maximum(r, b)                      # excesso de verde
    a = 1 - np.clip((ex - 20) / (110 - 20), 0, 1)  # 0 = fundo, 1 = mão
    # recua a máscara ~1,5 px (no 4K) e suaviza: some o pixel misturado com o verde da borda
    m = Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
    a = np.minimum(a, np.asarray(m, np.float32) / 255)
    fg = c.copy()
    # despill: o verde nunca passa do maior entre vermelho e azul
    lim = np.maximum(r, b)
    fg[...,1] = np.minimum(g, lim)
    # na borda, puxa também um pouco para o tom médio (tira o amarelado)
    borda = (a < 0.98)[..., None]
    lum = (fg @ np.array([0.3, 0.59, 0.11], np.float32))[..., None]
    fg = np.where(borda, fg * 0.7 + lum * 0.3, fg)
    fg[...,1] = np.where(a < 0.98, np.minimum(fg[...,1], (fg[...,0] + fg[...,2]) / 2 + 20), fg[...,1])
    fg = np.clip(fg, 0, 255)
    rgba = np.dstack([fg, a * 255]).round().astype(np.uint8)
    im = Image.fromarray(rgba, "RGBA")
    for w, q, d in [(2560, 88, "2560"), (1280, 85, "1280")]:
        im.resize((w, round(H * w / W)), Image.LANCZOS).save(f"{OUT}/{d}/f{n:03d}.webp", quality=q, alpha_quality=90, method=6)
print("quadros:", n)
