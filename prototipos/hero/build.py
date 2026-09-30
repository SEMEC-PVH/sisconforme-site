"""Gera os protótipos autocontidos (imagens embutidas em base64) a partir dos templates.
Uso: python3 prototipos/hero/build.py   (rodar na raiz do projeto ou em qualquer lugar)"""
import base64, pathlib
AQUI = pathlib.Path(__file__).resolve().parent
IMG = AQUI.parent.parent / "public" / "img" / "hero"
ALVOS = {
    # template              -> (saída, {marcador: arquivo})
    "_template.html":   ("hero-prototipo.html",   {"ESQUERDA": "hero-esquerda.webp", "CENTRO": "hero-centro.webp", "DIREITA": "hero-direita.webp"}),
    "_template-b.html": ("hero-prototipo-b.html", {"ESQUERDA": "hero-b-caixas.webp", "CENTRO": "hero-b-rio.webp",   "DIREITA": "hero-b-bandeira.webp"}),
}
for tpl, (saida, imgs) in ALVOS.items():
    t = (AQUI / tpl).read_text(encoding="utf-8")
    for k, f in imgs.items():
        t = t.replace("{{%s}}" % k, "data:image/webp;base64," + base64.b64encode((IMG / f).read_bytes()).decode())
    (AQUI / saida).write_text(t, encoding="utf-8")
    print("ok:", saida)
