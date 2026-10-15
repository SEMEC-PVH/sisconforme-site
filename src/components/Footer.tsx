import { BsTelephone } from "react-icons/bs";
import { FaSquareFacebook, FaSquareInstagram, FaSquareYoutube } from "react-icons/fa6";
import { IoMdTime } from "react-icons/io";
import { MdOutlineEmail } from "react-icons/md";
import { SlLocationPin } from "react-icons/sl";
import { caminho } from "@/lib/caminho";
import FaixaPVH from "./FaixaPVH";
import styles from "./Footer.module.css";

/*
 * Rodapé institucional da Prefeitura de Porto Velho, trazido do layout público do sisconforme-web:
 * faixa de PVH, logo vertical com contatos, redes sociais e a barra de links legais embaixo.
 */
export default function Footer() {
  return (
    <footer className={styles.footer} id="rodape">
      <FaixaPVH />
      <div className={styles.colunas}>
        <div className={styles.contato}>
          {/* eslint-disable-next-line @next/next/no-img-element -- export estático, sem otimização de imagem */}
          <img src={caminho("/pvh/pvh-logo-vertical-branca.png")} alt="Prefeitura de Porto Velho" width={150} className={styles.logo} />
          <ul>
            <li className={styles.endereco}>
              <SlLocationPin size={24} aria-hidden="true" />
              <p>
                Avenida 7 de Setembro, 237 Centro
                <br />
                Porto Velho - Rondônia
                <br />
                CEP: 76801020
              </p>
            </li>
            <li>
              <BsTelephone size={24} aria-hidden="true" />
              <p>(69) 8473-2524</p>
            </li>
            <li>
              <MdOutlineEmail size={24} aria-hidden="true" />
              <p>gabineteprefeitopvh@gmail.com</p>
            </li>
            <li>
              <IoMdTime size={24} aria-hidden="true" />
              <p>Segunda a Sexta: 08:00 às 14:00</p>
            </li>
          </ul>
        </div>

        <div className={styles.redes}>
          <h3>Redes Sociais</h3>
          <p>
            Siga-nos nas redes sociais e fique por dentro de <br className={styles.quebra} />
            todas as novidades da nossa cidade.
          </p>
          <div className={styles.icones}>
            <a href="#" aria-label="Instagram">
              <FaSquareInstagram size={54} />
            </a>
            <a href="#" aria-label="Facebook">
              <FaSquareFacebook size={54} />
            </a>
            <a href="#" aria-label="YouTube">
              <FaSquareYoutube size={54} />
            </a>
          </div>
          <p className={styles.seguidores}>
            <strong>+150K</strong> seguidores nas redes sociais
          </p>
        </div>
      </div>

      <div className={styles.base}>
        <ul>
          <li className={styles.direitos}>© 2026. Secretaria Municipal da Economia. Todos os direitos reservados.</li>
          <li>
            <a href="#">Política de Privacidade</a>
          </li>
          <li>
            <a href="#">Termos de Uso</a>
          </li>
          <li>
            <a href="#">Políticas de Cookies</a>
          </li>
          <li>
            <a href="#">Lei de acesso a informação</a>
          </li>
          <li>
            <a href="#">Transparência</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
