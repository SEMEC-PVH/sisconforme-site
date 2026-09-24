# Monta a pasta publicada na rede apenas com o que a landing usa:
# site/index.html + os arquivos de public/ referenciados nela.
# Uso:  .\scripts\publicar.ps1            (destino padrao: D:\dev\sisconforme-publicar)
#       .\scripts\publicar.ps1 -Destino "E:\outra-pasta"
param([string]$Destino = "D:\dev\sisconforme-publicar")

$ErrorActionPreference = "Stop"
$raiz = Split-Path $PSScriptRoot -Parent
$html = Get-Content (Join-Path $raiz "site\index.html") -Raw -Encoding UTF8

# Tudo que a pagina referencia como ../public/...
$refs = [regex]::Matches($html, '\.\./public/([^"''\)\s]+)') |
  ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique

foreach ($r in $refs) {
  if (-not (Test-Path (Join-Path $raiz "public\$r"))) { throw "Arquivo nao encontrado: public/$r" }
}

# A pasta de destino e gerada: limpa e monta de novo
if (Test-Path $Destino) { Get-ChildItem $Destino -Force | Remove-Item -Recurse -Force }
else { New-Item -ItemType Directory $Destino | Out-Null }

foreach ($r in $refs) {
  $alvo = Join-Path $Destino $r
  New-Item -ItemType Directory -Force (Split-Path $alvo -Parent) | Out-Null
  Copy-Item (Join-Path $raiz "public\$r") $alvo
}

# No servidor, public/ e a raiz do site (igual ao Next.js)
[IO.File]::WriteAllText((Join-Path $Destino "index.html"), $html.Replace('../public/', ''), [Text.UTF8Encoding]::new($false))

Write-Host "Publicado em $Destino : index.html + $($refs.Count) arquivos"
$refs | ForEach-Object { Write-Host "  $_" }
