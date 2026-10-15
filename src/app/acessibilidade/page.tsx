import type { Metadata } from "next";
import Link from "next/link";
import BarraAcessibilidade from "@/components/BarraAcessibilidade";
import BrandMark from "@/components/BrandMark";
import Footer from "@/components/Footer";
import styles from "./acessibilidade.module.css";

export const metadata: Metadata = {
  title: "Acessibilidade · SISConforme",
  description: "Recursos de acessibilidade do SISConforme e como usá-los.",
};

/** Esta página não tem menu: os atalhos mantêm a numeração do eMAG (1 = conteúdo, 3 = rodapé). */
const ATALHOS = [
  { href: "#conteudo", txt: "Ir para o conteúdo", tecla: "1" },
  { href: "#rodape", txt: "Ir para o rodapé", tecla: "3" },
] as const;

/**
 * Página de acessibilidade exigida pelo eMAG: diz quais recursos o site tem, como usar os atalhos
 * e onde relatar uma barreira.
 */
export default function Acessibilidade() {
  return (
    <>
      <BarraAcessibilidade atalhos={ATALHOS} />
      <header className={styles.topo}>
        <Link href="/" className={styles.marca} aria-label="SISConforme, voltar à página inicial">
          <BrandMark size={28} />
          <span>SISConforme</span>
        </Link>
      </header>

      <main id="conteudo" className={styles.conteudo}>
        <h1>Acessibilidade</h1>
        <p className={styles.lead}>
          O SISConforme segue o Modelo de Acessibilidade em Governo Eletrônico (eMAG) e as Diretrizes de Acessibilidade
          para Conteúdo Web (WCAG 2.1, nível AA), conforme a Lei Brasileira de Inclusão (Lei nº 13.146/2015, art. 63).
        </p>

        <h2>Atalhos de teclado</h2>
        <p>
          A barra no topo de cada página tem atalhos numerados que levam direto para cada parte. Eles também
          funcionam pelo teclado:
        </p>
        <div className={styles.tabela} tabIndex={0} role="region" aria-label="Combinação de teclas por navegador">
          <table>
            <caption className="sr-only">Combinação de teclas dos atalhos em cada navegador</caption>
            <thead>
              <tr>
                <th scope="col">Atalho</th>
                <th scope="col">Chrome, Edge e Opera</th>
                <th scope="col">Firefox</th>
                <th scope="col">Safari (Mac)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Ir para o conteúdo</th>
                <td><kbd>Alt</kbd> + <kbd>1</kbd></td>
                <td><kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>1</kbd></td>
                <td><kbd>Control</kbd> + <kbd>Option</kbd> + <kbd>1</kbd></td>
              </tr>
              <tr>
                <th scope="row">Ir para o menu</th>
                <td><kbd>Alt</kbd> + <kbd>2</kbd></td>
                <td><kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>2</kbd></td>
                <td><kbd>Control</kbd> + <kbd>Option</kbd> + <kbd>2</kbd></td>
              </tr>
              <tr>
                <th scope="row">Ir para o rodapé</th>
                <td><kbd>Alt</kbd> + <kbd>3</kbd></td>
                <td><kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>3</kbd></td>
                <td><kbd>Control</kbd> + <kbd>Option</kbd> + <kbd>3</kbd></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Também dá para percorrer a página com <kbd>Tab</kbd> (avança) e <kbd>Shift</kbd> + <kbd>Tab</kbd> (volta). O
          item em foco fica sempre destacado.
        </p>

        <h2>Alto contraste</h2>
        <p>
          O botão <b>Alto contraste</b>, na barra do topo, troca as cores do site por fundo preto, texto branco e links
          amarelos. A escolha fica guardada neste navegador até você desligar.
        </p>

        <h2>Animações</h2>
        <p>
          O botão <b>Pausar animações</b> para os elementos que se movem sozinhos em repetição. As animações que
          acompanham a rolagem só andam quando você rola a página. Se o seu sistema estiver configurado para reduzir
          movimento, o site já abre com todas as animações substituídas por versões estáticas, com o mesmo conteúdo.
        </p>

        <h2>Libras</h2>
        <p>
          O ícone do <b>VLibras</b>, no canto da tela, traduz o conteúdo para a Língua Brasileira de Sinais. Selecione um
          texto ou clique nele depois de abrir o tradutor. O VLibras é uma ferramenta do Governo Federal (
          <a href="https://www.gov.br/governodigital/pt-br/vlibras">gov.br/vlibras</a>).
        </p>

        <h2>Leitores de tela e tamanho do texto</h2>
        <p>
          O site foi organizado com títulos, regiões e textos alternativos para funcionar com leitores de tela como
          NVDA, JAWS, VoiceOver e TalkBack. Para aumentar o texto use <kbd>Ctrl</kbd> + <kbd>+</kbd> (ou{" "}
          <kbd>⌘</kbd> + <kbd>+</kbd> no Mac); o conteúdo se reorganiza sem cortar informação.
        </p>

        <h2>Encontrou uma barreira?</h2>
        <p>
          Se alguma parte do site não funcionou para você, avise a Secretaria Municipal de Economia pelos contatos no{" "}
          <a href="#rodape">rodapé desta página</a>, dizendo qual página, o que tentou fazer e o recurso que usava
          (leitor de tela, teclado, ampliação). Toda barreira relatada é tratada como erro a corrigir.
        </p>

        <p className={styles.voltar}>
          <Link href="/">← Voltar à página inicial</Link>
        </p>
      </main>

      <Footer />
    </>
  );
}
