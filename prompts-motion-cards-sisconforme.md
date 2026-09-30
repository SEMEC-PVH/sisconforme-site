# Prompts de motion — cards "Segurança e disponibilidade" (SISConforme)

Quatro prompts independentes, um por card. Cada um pode ser colado sozinho numa sessão nova.
Todos mantêm a mesma linguagem visual do motion principal (forma única, springs, um azul só, loop perfeito) para que os cinco vídeos pareçam da mesma família.

---

## Card 01 — Acesso seguro ("Quem pode entrar?")

```
<inputs>
Me peça:
1. A lista final de 10 a 12 estados de UI. Sugestão abaixo em <structure>; posso trocar, tirar ou reordenar.
2. O hex do azul de destaque (a cor da água da logo). O restante é preto, branco e cinza quente.
3. O SVG da logo do SISConforme (três casas/setas em escada, traço único) para o primeiro e o último frame.
4. Os ícones de e-CNPJ (certificado) e gov.br que posso usar, ou autorização para desenhar ícones neutros de traço único no lugar da marca gov.br.
5. Uma música royalty-free em torno de 120 BPM, livre para uso comercial (ex.: Mixkit, Pixabay Music).
6. Confirmação de que todos os dados na tela são fictícios (CNPJ, razão social, CPF, nome do titular do certificado), por causa da LGPD e do sigilo fiscal.
</inputs>

<direction>
Motion de UI nível Dribbble que explica em poucos segundos quem pode entrar no SISConforme: só quem se identifica por e-CNPJ ou pela conta gov.br. A ideia central é "não existe senha do portal": não há campo de senha para vazar nem para esquecer.
Uma forma só, sem corte: cada estado é o mesmo elemento mudando de tamanho, raio e cor, e o conteúdo troca com um blur curto. Um cursor conduz cada mudança com cliques e arrastes reais.
Canvas cinza quente claro, componentes em preto e branco, um único azul de destaque (a água da logo) só onde há informação: opção selecionada, identidade confirmada, cadeado fechado.
Fonte de UI limpa (Geist). Português do Brasil, tom institucional e sóbrio, frases curtas. Springs em tudo, overshoot mínimo. A câmera dá zoom para cada estado preencher o quadro. O último frame é igual ao primeiro, para o vídeo ficar em loop.
Proibido: easing elástico, partículas, glow, gradiente no chrome da UI, ícones com traço de espessura diferente, tempo morto, cara de template, estética de hacker/cadeado dramático, qualquer tom alarmista ("sua senha vazou!"). Não imitar telas reais do gov.br nem usar a marca de forma que pareça a página oficial de login.
</direction>

<structure>
120 BPM, 7 compassos (28 tempos, cerca de 14 s), algo acontece em todo tempo.
Logo se desenhando em traço único, a água subindo em azul → a forma vira um campo "Senha" vazio com cursor piscando → o campo é riscado por um traço único e se recolhe: "Sem senha do portal" → a forma se divide num seletor segmentado "e-CNPJ | gov.br", com indicador líquido parado em "e-CNPJ" → clique em "e-CNPJ": o indicador vira um cartão de certificado ("Empresa Exemplo Ltda · 00.000.000/0001-00") → o cursor arrasta o cartão até um slot; ao passar do encaixe estica e volta com spring → loader → check "Certificado válido" → o check desliza o indicador até "gov.br" (as duas bordas com springs diferentes) → vira o botão "Entrar com gov.br · Login Único" (clique) → loader → check "Identidade confirmada" → as duas confirmações se fundem numa pílula "Acesso por identidade verificada" → a pílula se recolhe na logo, que volta ao estado do primeiro frame.
</structure>

<build>
1. Um único arquivo HTML, quadrado 1440x1440. Todo estilo é calculado a partir do tempo dentro de seek(t): nada de transição CSS, timer ou estado guardado entre frames.
2. Springs são respostas ao degrau em forma fechada. Um valor que muda de alvo várias vezes é a soma de um spring por mudança, e assim continua sendo função pura do tempo.
3. As duas bordas do indicador do seletor usam springs diferentes, para a borda da frente esticar antes da de trás.
4. O desenho da logo usa stroke-dasharray/dashoffset calculado a partir de t; a água azul sobe com clip-path também calculado a partir de t. O risco sobre o campo "Senha" usa a mesma técnica de traço.
5. O arraste do certificado é manipulação direta: enquanto o cursor segura, a posição vem dele. Ao soltar, vai ao slot com spring de onde estiver.
6. Analise a música com numpy para achar a grade de tempos e comece num tempo forte. Posicione cada som de UI (clique, encaixe, check) pelo pico medido.
7. Renderize com Playwright: 4 subframes por frame, misturados com ffmpeg tmix para motion blur a 60 fps.
8. Antes do render completo, renderize um frame por tempo. Corrija o que estiver fora da grade, apertado ou difícil de ler, principalmente o CNPJ no cartão do certificado.
</build>

<gotchas>
Nunca use will-change em nada que a câmera escala, ou o texto sai borrado.
Texto que troca dentro de um container em morph precisa de tempo próprio de entrada e saída, ou se sobrepõe.
O CNPJ usa fonte tabular (font-variant-numeric: tabular-nums).
O campo "Senha" nunca recebe caracteres digitados: a mensagem é que ele não existe.
Nenhum CNPJ, CPF ou nome real: use dados obviamente fictícios (ex.: 00.000.000/0001-00, "Empresa Exemplo Ltda").
A logo no último frame tem que bater pixel a pixel com a do primeiro, incluindo posição e velocidade do cursor, ou o loop engasga.
</gotchas>

<start>
Me peça os inputs e, antes de escrever qualquer código, mostre a lista de estados posicionada na grade de tempos (compasso.tempo → estado → ação do cursor).
</start>
```

---

## Card 02 — Acesso por empresa ("Quem pode ver os dados?")

```
<inputs>
Me peça:
1. A lista final de 10 a 12 estados de UI. Sugestão abaixo em <structure>; posso trocar, tirar ou reordenar.
2. O hex do azul de destaque (a cor da água da logo). O restante é preto, branco e cinza quente.
3. O SVG da logo do SISConforme (três casas/setas em escada, traço único) para o primeiro e o último frame.
4. Uma música royalty-free em torno de 120 BPM, livre para uso comercial (ex.: Mixkit, Pixabay Music).
5. Confirmação de que todos os dados na tela são fictícios (CNPJs, razões sociais, nome do contador, número da procuração), por causa da LGPD e do sigilo fiscal.
</inputs>

<direction>
Motion de UI nível Dribbble que mostra a regra de visibilidade do SISConforme: cada empresa vê só os próprios dados; o contador vê apenas as empresas que representa por procuração eletrônica; ninguém vê outras empresas, nem contador sem procuração.
Três níveis contados como três tentativas do mesmo cursor: sua empresa (liberado), empresa representada (liberado com procuração), outra empresa (sem acesso).
Uma forma só, sem corte: cada estado é o mesmo elemento mudando de tamanho, raio e cor, e o conteúdo troca com um blur curto. Um cursor conduz cada mudança com cliques e arrastes reais.
Canvas cinza quente claro, componentes em preto e branco, um único azul de destaque (a água da logo) só onde há informação: empresa ativa, procuração válida, "Liberado". "Sem acesso" é cinza neutro com cadeado de traço único, nunca vermelho.
Fonte de UI limpa (Geist). Português do Brasil, tom institucional e sóbrio, frases curtas. Springs em tudo, overshoot mínimo. A câmera dá zoom para cada estado preencher o quadro. O último frame é igual ao primeiro, para o vídeo ficar em loop.
Proibido: easing elástico, partículas, glow, gradiente no chrome da UI, ícones com traço de espessura diferente, tempo morto, cara de template, qualquer coisa punitiva ou alarmista (vermelho de erro, tremida de "negado", "acesso proibido!").
</direction>

<structure>
120 BPM, 7 compassos (28 tempos, cerca de 14 s), algo acontece em todo tempo.
Logo se desenhando em traço único, a água subindo em azul → a forma vira uma pílula de contexto "Empresa Exemplo Ltda" com selo azul "Liberado" → clique na pílula: abre um seletor de empresas em lista (três linhas) → a linha "Sua empresa · seus próprios dados" acende em azul, abre um mini-painel com três competências → o cursor volta ao seletor e passa para "Empresa Representada Ltda" → a linha se expande num chip "Procuração eletrônica nº 0000/0000" → o chip vira um toggle "Procuração vigente", que liga no tempo forte → selo "Liberado · contador" → o cursor desce para "Outra Empresa Ltda" → a linha fica cinza e a forma se fecha num cadeado de traço único: "Sem acesso" → o cursor arrasta a linha para cima tentando abrir; ela estica um pouco e volta com spring, sem abrir → legenda "Nem para contador sem procuração" → a lista se recolhe na logo, que volta ao estado do primeiro frame.
</structure>

<build>
1. Um único arquivo HTML, quadrado 1440x1440. Todo estilo é calculado a partir do tempo dentro de seek(t): nada de transição CSS, timer ou estado guardado entre frames.
2. Springs são respostas ao degrau em forma fechada. Um valor que muda de alvo várias vezes é a soma de um spring por mudança, e assim continua sendo função pura do tempo.
3. O realce da linha selecionada no seletor tem bordas superior e inferior com springs diferentes, para a borda da frente esticar antes da de trás. Mesmo truque no knob do toggle "Procuração vigente".
4. O desenho da logo e do cadeado usa stroke-dasharray/dashoffset calculado a partir de t; a água azul sobe com clip-path também calculado a partir de t.
5. O arraste em "Outra Empresa Ltda" é manipulação direta com resistência (o deslocamento cresce menos que o do cursor). Ao soltar, volta com spring de onde estiver.
6. Analise a música com numpy para achar a grade de tempos e comece num tempo forte. Posicione cada som de UI pelo pico medido; o "Sem acesso" leva um som seco e discreto, não um alerta.
7. Renderize com Playwright: 4 subframes por frame, misturados com ffmpeg tmix para motion blur a 60 fps.
8. Antes do render completo, renderize um frame por tempo. Corrija o que estiver fora da grade, apertado ou difícil de ler, principalmente CNPJs, número da procuração e competências.
</build>

<gotchas>
Nunca use will-change em nada que a câmera escala, ou o texto sai borrado.
Texto que troca dentro de um container em morph precisa de tempo próprio de entrada e saída, ou se sobrepõe.
CNPJs e números usam fonte tabular (font-variant-numeric: tabular-nums).
Os três níveis precisam ser distinguíveis também sem cor (texto do selo + ícone), por acessibilidade.
Nenhum CNPJ, nome ou número real: use dados obviamente fictícios (ex.: 00.000.000/0001-00, "Empresa Exemplo Ltda", "Empresa Representada Ltda", "Outra Empresa Ltda").
A logo no último frame tem que bater pixel a pixel com a do primeiro, incluindo posição e velocidade do cursor, ou o loop engasga.
</gotchas>

<start>
Me peça os inputs e, antes de escrever qualquer código, mostre a lista de estados posicionada na grade de tempos (compasso.tempo → estado → ação do cursor).
</start>
```

---

## Card 03 — Dados utilizados ("O que é comparado?")

```
<inputs>
Me peça:
1. A lista final de 10 a 12 estados de UI. Sugestão abaixo em <structure>; posso trocar, tirar ou reordenar.
2. O hex do azul de destaque (a cor da água da logo). O restante é preto, branco e cinza quente.
3. O SVG da logo do SISConforme (três casas/setas em escada, traço único) para o primeiro e o último frame.
4. Uma música royalty-free em torno de 120 BPM, livre para uso comercial (ex.: Mixkit, Pixabay Music).
5. Confirmação de que todos os dados na tela são fictícios (CNPJ, razão social, valores, competências), por causa da LGPD e do sigilo fiscal.
</inputs>

<direction>
Motion de UI nível Dribbble que mostra o que o SISConforme compara: NFS-e (notas fiscais de serviço), PGDAS (Simples Nacional) e Cartão e Pix (recebidos pela SEFIN-RO, conforme convênio, usados exclusivamente para fins fiscais). A história é "três fontes entram, um cruzamento sai".
Uma forma só, sem corte: cada estado é o mesmo elemento mudando de tamanho, raio e cor, e o conteúdo troca com um blur curto. Um cursor conduz cada mudança com cliques e arrastes reais.
Canvas cinza quente claro, componentes em preto e branco, um único azul de destaque (a água da logo) só onde há informação: fonte conectada, mês divergente, selo de convênio.
Fonte de UI limpa (Geist). Português do Brasil, tom institucional e sóbrio, frases curtas. Springs em tudo, overshoot mínimo. A câmera dá zoom para cada estado preencher o quadro. O último frame é igual ao primeiro, para o vídeo ficar em loop.
Proibido: easing elástico, partículas, glow, gradiente no chrome da UI, ícones com traço de espessura diferente, tempo morto, cara de template, estética de "vigilância" (lupa sobre pessoa, radar, olho), qualquer tom alarmista ou punitivo (vermelho de erro, "sonegação detectada!").
</direction>

<structure>
120 BPM, 7 compassos (28 tempos, cerca de 14 s), algo acontece em todo tempo.
Logo se desenhando em traço único, a água subindo em azul → a forma se divide em três chips alinhados: "NFS-e", "PGDAS", "Cartão e Pix" → o cursor arrasta "NFS-e" para um slot central; ao encaixar, o chip acende em azul e mostra "Notas fiscais de serviço" → arrasta "PGDAS": "Simples Nacional" → arrasta "Cartão e Pix": o chip ganha uma etiqueta "Via SEFIN-RO" → os três slots se fundem num único painel "Comparação por competência" → o painel vira um gráfico que se desenha sozinho: três séries por mês (NFS-e emitida, receita declarada no PGDAS, recebido em cartão e Pix) → hover no mês em que as séries se afastam: tooltip com os três valores e a diferença em azul → clique no mês: o tooltip vira um selo "Dados de pagamento compartilhados pela SEFIN-RO, conforme convênio" → o selo encolhe para a pílula "Uso exclusivo para fins fiscais" → a pílula se recolhe na logo, que volta ao estado do primeiro frame.
</structure>

<build>
1. Um único arquivo HTML, quadrado 1440x1440. Todo estilo é calculado a partir do tempo dentro de seek(t): nada de transição CSS, timer ou estado guardado entre frames.
2. Springs são respostas ao degrau em forma fechada. Um valor que muda de alvo várias vezes é a soma de um spring por mudança, e assim continua sendo função pura do tempo.
3. Ao encaixar cada chip, as bordas esquerda e direita do slot usam springs diferentes, para a borda da frente esticar antes da de trás.
4. O desenho da logo e das linhas do gráfico usa stroke-dasharray/dashoffset calculado a partir de t; a água azul sobe com clip-path também calculado a partir de t.
5. Os arrastes dos chips são manipulação direta: enquanto o cursor segura, a posição vem dele. Ao soltar, vai ao slot com spring de onde estiver.
6. Analise a música com numpy para achar a grade de tempos e comece num tempo forte. Posicione cada som de UI (encaixe, hover, clique) pelo pico medido; os três encaixes caem em tempos consecutivos.
7. Renderize com Playwright: 4 subframes por frame, misturados com ffmpeg tmix para motion blur a 60 fps.
8. Antes do render completo, renderize um frame por tempo. Corrija o que estiver fora da grade, apertado ou difícil de ler, principalmente valores em R$ no tooltip e rótulos de competência (ex.: "03/2026").
</build>

<gotchas>
Nunca use will-change em nada que a câmera escala, ou o texto sai borrado.
Texto que troca dentro de um container em morph precisa de tempo próprio de entrada e saída, ou se sobrepõe.
Valores monetários usam fonte tabular (font-variant-numeric: tabular-nums) para não tremer quando mudam.
As três séries do gráfico precisam ser distinguíveis sem depender só de cor (traço sólido, tracejado e pontilhado, ou rótulo direto na ponta da linha); o azul fica reservado para a diferença.
Nenhum CNPJ, nome ou valor real: use dados obviamente fictícios (ex.: 00.000.000/0001-00, "Empresa Exemplo Ltda", valores redondos).
A logo no último frame tem que bater pixel a pixel com a do primeiro, incluindo posição e velocidade do cursor, ou o loop engasga.
</gotchas>

<start>
Me peça os inputs e, antes de escrever qualquer código, mostre a lista de estados posicionada na grade de tempos (compasso.tempo → estado → ação do cursor).
</start>
```

---

## Card 04 — Somente consulta ("O sistema pode alterar os dados?")

```
<inputs>
Me peça:
1. A lista final de 10 a 12 estados de UI. Sugestão abaixo em <structure>; posso trocar, tirar ou reordenar.
2. O hex do azul de destaque (a cor da água da logo). O restante é preto, branco e cinza quente.
3. O SVG da logo do SISConforme (três casas/setas em escada, traço único) para o primeiro e o último frame.
4. Uma música royalty-free em torno de 120 BPM, livre para uso comercial (ex.: Mixkit, Pixabay Music).
5. Confirmação de que todos os dados na tela são fictícios (CNPJ, razão social, número de nota, valores, competências), por causa da LGPD e do sigilo fiscal.
</inputs>

<direction>
Motion de UI nível Dribbble que responde uma pergunta com uma palavra: "O sistema pode alterar os dados?" — "Não." O SISConforme consulta informações já validadas; qualquer emissão ou alteração segue os procedimentos oficiais de cada sistema. O cursor tenta editar e a interface, com calma, mostra que ali é só leitura e aponta o caminho oficial.
Uma forma só, sem corte: cada estado é o mesmo elemento mudando de tamanho, raio e cor, e o conteúdo troca com um blur curto. Um cursor conduz cada mudança com cliques e arrastes reais.
Canvas cinza quente claro, componentes em preto e branco, um único azul de destaque (a água da logo) só onde há informação: o "Não." da resposta, o selo "Somente leitura", o link para o sistema oficial.
Fonte de UI limpa (Geist). Português do Brasil, tom institucional e sóbrio, frases curtas. Springs em tudo, overshoot mínimo. A câmera dá zoom para cada estado preencher o quadro. O último frame é igual ao primeiro, para o vídeo ficar em loop.
Proibido: easing elástico, partículas, glow, gradiente no chrome da UI, ícones com traço de espessura diferente, tempo morto, cara de template, qualquer coisa que pareça erro ou bloqueio hostil (vermelho, tremida de "negado", ícone de proibido, "ação não permitida!").
</direction>

<structure>
120 BPM, 7 compassos (28 tempos, cerca de 14 s), algo acontece em todo tempo.
Logo se desenhando em traço único, a água subindo em azul → a forma vira a pergunta "O sistema pode alterar os dados?" → a pergunta encolhe e dá lugar a um "Não." grande, em azul, no tempo forte → o "Não." vira uma linha de registro: "NFS-e nº 000123 · 03/2026 · R$ 1.000,00" → o cursor passa sobre o valor: aparece um ícone de lápis → clique no lápis: o lápis se desenha de volta num cadeado de traço único e a linha ganha o selo "Somente leitura" → o cursor arrasta o valor como se fosse editar; o número estica levemente e volta com spring, sem mudar → a linha se expande em três camadas empilhadas: "Consulta: SISConforme" (azul), "Emissão e alteração: sistema oficial" e "Base consultada: sem alterações" → clique em "sistema oficial": a camada vira um botão "Ir para o sistema oficial" com seta de saída → a seta desliza para fora e o botão se recolhe na pílula "O portal não altera as bases consultadas" → a pílula se recolhe na logo, que volta ao estado do primeiro frame.
</structure>

<build>
1. Um único arquivo HTML, quadrado 1440x1440. Todo estilo é calculado a partir do tempo dentro de seek(t): nada de transição CSS, timer ou estado guardado entre frames.
2. Springs são respostas ao degrau em forma fechada. Um valor que muda de alvo várias vezes é a soma de um spring por mudança, e assim continua sendo função pura do tempo.
3. Na expansão das três camadas, topo e base de cada camada usam springs diferentes, para a borda da frente esticar antes da de trás. Mesmo truque na seta de saída do botão.
4. O desenho da logo e o morph lápis → cadeado usam stroke-dasharray/dashoffset calculado a partir de t; a água azul sobe com clip-path também calculado a partir de t.
5. O arraste sobre o valor é manipulação direta com resistência forte (o deslocamento é uma fração do cursor e o número nunca muda). Ao soltar, volta com spring de onde estiver.
6. Analise a música com numpy para achar a grade de tempos e comece num tempo forte. O "Não." cai no primeiro tempo forte de um compasso. Posicione cada som de UI pelo pico medido.
7. Renderize com Playwright: 4 subframes por frame, misturados com ffmpeg tmix para motion blur a 60 fps.
8. Antes do render completo, renderize um frame por tempo. Corrija o que estiver fora da grade, apertado ou difícil de ler, principalmente o valor em R$, o número da nota e a competência.
</build>

<gotchas>
Nunca use will-change em nada que a câmera escala, ou o texto sai borrado.
Texto que troca dentro de um container em morph precisa de tempo próprio de entrada e saída, ou se sobrepõe.
Valores monetários e números de nota usam fonte tabular (font-variant-numeric: tabular-nums).
O valor arrastado nunca troca de dígito, nem por um frame: a mensagem é que o dado não muda.
Não nomear nem imitar a tela de um sistema oficial real; "sistema oficial" fica genérico.
Nenhum CNPJ, nome ou valor real: use dados obviamente fictícios (ex.: 00.000.000/0001-00, "Empresa Exemplo Ltda", "NFS-e nº 000123").
A logo no último frame tem que bater pixel a pixel com a do primeiro, incluindo posição e velocidade do cursor, ou o loop engasga.
</gotchas>

<start>
Me peça os inputs e, antes de escrever qualquer código, mostre a lista de estados posicionada na grade de tempos (compasso.tempo → estado → ação do cursor).
</start>
```
