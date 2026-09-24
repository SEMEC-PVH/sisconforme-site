# Logo SISConforme: três caixas d'água

Prompts para gerar a logo do SISConforme a partir das **três caixas d'água** de Porto Velho, no mesmo traço minimalista do ícone que já está no `sisconforme-landing.html`.

## Os arquivos

| Arquivo | O que tem |
|---|---|
| `README.md` | Conceito, DNA visual e o fluxo de trabalho recomendado (este arquivo) |
| `01-simbolo.md` | Prompts só do **símbolo** (sem texto). É o mais importante: comece por ele |
| `02-logotipo-completo.md` | Prompts do símbolo + nome "SISConforme" (horizontal e vertical) |
| `03-aplicacoes.md` | Favicon, ícone de app, versão monocromática, fundo escuro e mockups |
| `04-ajustes-e-checklist.md` | Prompts de correção, negative prompts, vetorização e checklist final |

---

## O conceito

**Três caixas d'água = três fontes de dados cruzadas.**

O SISConforme cruza três fontes que antes eram analisadas separadamente:

1. Notas fiscais de serviço (NFS-e)
2. Receita declarada no PGDAS
3. Recebimentos por cartão (credenciadoras / SEFIN-RO)

As Três Caixas d'Água são o símbolo mais conhecido de Porto Velho. O símbolo junta as duas ideias: são **três estruturas lado a lado, iguais e alinhadas**, que representam os dados "em conformidade". O X das treliças das pernas lembra o **cruzamento** dos dados.

## O DNA do ícone atual (o que precisa ser mantido)

O ícone atual da landing é este SVG (grade 24×24):

```svg
<svg width="24" height="24" viewBox="0 0 24 24">
  <path d="M4 18 L10 5 L13 11" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="square"/>
  <path d="M12 18 L17 7 L21 18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="square"/>
</svg>
```

As características dele que o novo símbolo precisa herdar:

- **Monolinha**: tudo desenhado com traço, sem preenchimento, sem gradiente
- **Traço grosso e uniforme**: cerca de 10% da largura do ícone (2,4 px em 24 px)
- **Pontas retas (square caps)**, cantos vivos, **sem arredondamento**
- **Picos triangulares**: os telhados cônicos das caixas d'água viram os "picos" do ícone atual. É essa a ponte entre a logo antiga e a nova
- **Geometria simples**: poucas linhas, legível em 16 px
- **Uma cor só** (`currentColor`), que funciona em claro e escuro

## Paleta (a mesma da landing)

| Nome | Hex | Uso |
|---|---|---|
| Ink | `#141413` | Cor principal do símbolo e do texto |
| Ivory | `#FAF9F5` | Fundo claro |
| Clay | `#D97757` | Destaque (opcional: um detalhe, nunca a logo inteira) |
| Gold | `#D4A12A` | Amarelo mostarda da ilustração das caixas d'água, para versões especiais |
| Night ink | `#F2EDE4` | Símbolo sobre fundo escuro `#141413` |

## Tipografia

- Nome: **SISConforme**. Grafia exata: "SIS" em maiúsculas e "Conforme" com C maiúsculo
- Fonte da landing: **Inter SemiBold (600)**, letter-spacing −0,01em

---

## Fluxo recomendado

1. **Gere só o símbolo** com os prompts de `01-simbolo.md`. Gere de 4 a 8 variações por conceito e escolha 1 ou 2.
2. **Não peça para a IA escrever "SISConforme"** na versão final. Geradores de imagem erram letras com frequência. Use o `02-logotipo-completo.md` apenas para *visualizar* a composição e monte o texto de verdade no Figma/Illustrator com a fonte Inter.
3. **Vetorize** o símbolo escolhido (veja `04-ajustes-e-checklist.md`). Imagem gerada é PNG; logo precisa ser SVG.
4. **Teste em 16 px, 32 px e 512 px** e em fundo claro e escuro (`03-aplicacoes.md`).

### Qual ferramenta usar

| Ferramenta | Bom para |
|---|---|
| **Recraft** (modo *Vector illustration* / *Icon*) | Melhor opção para logo: já exporta SVG |
| **ChatGPT (geração de imagem)** | Segue bem instruções longas e aceita imagem de referência |
| **Midjourney** | Explorar estilos; use `--style raw` e `--no` para limpar |
| **Ideogram** | O que melhor escreve texto, caso queira testar o lockup com nome |

> Dica: os prompts estão em **inglês** porque os geradores respondem melhor assim. Cada prompt tem uma explicação em português logo acima.

> Dica 2: anexe como **imagem de referência** um print do ícone atual (o dos dois picos, no topo da landing) e, se quiser, a `tres_caixas_dagua.png`. Assim a IA entende o estilo do traço e o objeto.
