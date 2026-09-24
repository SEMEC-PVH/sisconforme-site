# Gera o site estatico (Next.js) e copia para a pasta publicada na rede.
# Uso:  .\scripts\publicar.ps1            (destino padrao: D:\dev\sisconforme-publicar)
#       .\scripts\publicar.ps1 -Destino "E:\outra-pasta"
param([string]$Destino = "D:\dev\sisconforme-publicar")

$ErrorActionPreference = "Stop"
$raiz = Split-Path $PSScriptRoot -Parent

Push-Location $raiz
try { npm run build; if ($LASTEXITCODE -ne 0) { throw "npm run build falhou" } }
finally { Pop-Location }

$out = Join-Path $raiz "out"
if (-not (Test-Path (Join-Path $out "index.html"))) { throw "Build sem out/index.html" }

# A pasta de destino e gerada: limpa e copia o build inteiro
if (Test-Path $Destino) { Get-ChildItem $Destino -Force | Remove-Item -Recurse -Force }
else { New-Item -ItemType Directory $Destino | Out-Null }
Copy-Item -Path (Join-Path $out "*") -Destination $Destino -Recurse

$n = (Get-ChildItem $Destino -Recurse -File | Measure-Object).Count
Write-Host "Publicado em $Destino : $n arquivos"
