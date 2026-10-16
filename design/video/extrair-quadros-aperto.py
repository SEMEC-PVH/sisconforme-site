"""Extrai os quadros do aperto de mãos (fundo verde -> transparente) de um vídeo em chroma key.

Uso (vídeo atual, faixa de 1920 × 764 a partir de y = 156):
  python design/video/extrair-quadros-aperto.py design/video/aperto-de-maos-v2-site.mp4 public/img/aperto \
      --y 156 --altura 764

O aperto-de-maos-v2-site.mp4 junta os 72 primeiros quadros do aperto-de-maos-v2.mp4 (a aproximação, 24 qps)
com o balanço interpolado a 48 qps, para os saltos do balanço caírem pela metade:
  ffmpeg -i aperto-de-maos-v2.mp4 -vf "minterpolate=fps=48:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1" v48.mp4
  ffmpeg -i aperto-de-maos-v2.mp4 -i v48.mp4 -filter_complex "[0:v]trim=end_frame=72,setpts=N/48/TB[a];
      [1:v]trim=start_frame=144,setpts=N/48/TB[b];[a][b]concat=n=2:v=1[v]" -map "[v]" -r 48 -crf 10 \
      aperto-de-maos-v2-site.mp4

Gera <saida>/2560/f001.webp … e <saida>/1280/…, numerados a partir de 1. A faixa usa a largura
inteira do vídeo; --y e --altura escolhem a parte vertical. Requer ffmpeg no PATH (ou o caminho dele na variável
FFMPEG, como o que vem no pacote imageio-ffmpeg), numpy e Pillow.
"""
import argparse
import os
import re
import subprocess

import numpy as np
from PIL import Image, ImageFilter

arg = argparse.ArgumentParser()
arg.add_argument("video")
arg.add_argument("saida")
arg.add_argument("--inicio", type=int, default=0, help="primeiro quadro do vídeo (a partir de 0)")
arg.add_argument("--fim", type=int, help="último quadro do vídeo, incluído")
arg.add_argument("--y", type=int, default=0, help="topo da faixa recortada")
arg.add_argument("--altura", type=int, help="altura da faixa recortada")
arg.add_argument("--so", help="quadros de saída a gerar, ex.: 1,30 (para testar)")
a = arg.parse_args()

FFMPEG = os.environ.get("FFMPEG", "ffmpeg")
# o tamanho sai do cabeçalho que o próprio ffmpeg imprime: assim não depende do ffprobe
info = subprocess.run([FFMPEG, "-hide_banner", "-i", a.video], capture_output=True, text=True).stderr
W, H0 = map(int, re.search(r"Video:.*?(\d{2,5})x(\d{2,5})", info).groups())
H = a.altura or H0 - a.y
so = {int(x) for x in a.so.split(",")} if a.so else None

# format=rgb24 antes do crop: em yuv420 um recorte de altura ímpar seria arredondado
p = subprocess.Popen([FFMPEG, "-v", "error", "-i", a.video, "-vf", f"format=rgb24,crop={W}:{H}:0:{a.y}",
                      "-fps_mode", "passthrough", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
for d in ("2560", "1280"):
    os.makedirs(f"{a.saida}/{d}", exist_ok=True)

n = -1
saida = 0
while True:
    buf = p.stdout.read(W * H * 3)
    if len(buf) < W * H * 3:
        break
    n += 1
    if n < a.inicio or (a.fim is not None and n > a.fim):
        continue
    saida += 1
    if so and saida not in so:
        continue
    c = np.frombuffer(buf, np.uint8).reshape(H, W, 3).astype(np.float32)
    r, g, b = c[..., 0], c[..., 1], c[..., 2]
    ex = g - np.maximum(r, b)                      # excesso de verde
    alfa = 1 - np.clip((ex - 20) / (110 - 20), 0, 1)  # 0 = fundo, 1 = mão
    # recua a máscara ~2 px e suaviza: some o pixel misturado com o verde da borda
    m = Image.fromarray((alfa * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(1))
    alfa = np.minimum(alfa, np.asarray(m, np.float32) / 255)
    fg = c.copy()
    # despill: o verde nunca passa do maior entre vermelho e azul
    fg[..., 1] = np.minimum(g, np.maximum(r, b))
    # na borda, puxa também um pouco para o tom médio (tira o amarelado)
    borda = alfa < 0.98
    lum = (fg @ np.array([0.3, 0.59, 0.11], np.float32))[..., None]
    fg = np.where(borda[..., None], fg * 0.7 + lum * 0.3, fg)
    fg[..., 1] = np.where(borda, np.minimum(fg[..., 1], (fg[..., 0] + fg[..., 2]) / 2 + 20), fg[..., 1])
    rgba = np.dstack([np.clip(fg, 0, 255), alfa * 255]).round().astype(np.uint8)
    im = Image.fromarray(rgba, "RGBA")
    for w, q in [(2560, 88), (1280, 85)]:
        im.resize((w, round(H * w / W)), Image.LANCZOS).save(
            f"{a.saida}/{w}/f{saida:03d}.webp", quality=q, alpha_quality=90, method=6)
print(f"quadros: {saida} ({W} × {H} a partir de y = {a.y})")
