import { FaUser } from "react-icons/fa";
import styles from "./BotaoGovBr.module.css";

type Props = Readonly<{
  href?: string;
  className?: string;
  tabIndex?: number;
  onClick?: () => void;
}>;

/**
 * Botão "Entrar com gov.br" no padrão do Design System do Governo Federal (br-sign-in primário):
 * azul #1351B4, pílula de 40 px, ícone de usuário e foco tracejado amarelo. O acesso ao portal é só pelo gov.br.
 * Em telas estreitas quem usa pode esconder `[data-sufixo]` para ficar só "Entrar".
 */
export default function BotaoGovBr({ href = "#disponibilidade", className, tabIndex, onClick }: Props) {
  return (
    <a
      className={className ? `${styles.botao} ${className}` : styles.botao}
      href={href}
      tabIndex={tabIndex}
      onClick={onClick}
      aria-label="Entrar com gov.br"
    >
      <FaUser aria-hidden="true" className={styles.icone} />
      <span>
        Entrar<span data-sufixo> com </span>
        <b data-sufixo>gov.br</b>
      </span>
    </a>
  );
}
