import { Poppins } from "next/font/google";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa6";
import { caminho } from "@/lib/caminho";
import BrandMark from "./BrandMark";
import FaixaPVH from "./FaixaPVH";
import styles from "./Footer.module.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"], display: "swap" });

/** Perfis oficiais da Prefeitura de Porto Velho, os mesmos que o portovelho.ro.gov.br lista. */
const REDES = [
  { nome: "Facebook", href: "https://www.facebook.com/PrefeituraPVH/", Icone: FaFacebook },
  { nome: "Instagram", href: "https://www.instagram.com/prefeitura.pvh/", Icone: FaInstagram },
  { nome: "YouTube", href: "https://www.youtube.com/@prefeitura_pvh", Icone: FaYoutube },
];

const LINKS = [
  "Política de Privacidade",
  "Termos de Uso",
  "Política de Cookies",
  "Preferências de Cookies",
  "Lei de Acesso à Informação",
  "Transparência",
];

/*
 * Rodapé institucional: faixa de Porto Velho, logo vertical da Prefeitura, apresentação do SISConforme e contatos
 * da secretaria, redes sociais e a barra de links legais embaixo.
 */
export default function Footer() {
  return (
    <footer className={`${styles.footer} ${poppins.className}`} id="rodape">
      <FaixaPVH />
      <div className={styles.colunas}>
        {/* eslint-disable-next-line @next/next/no-img-element -- export estático, sem otimização de imagem */}
        <img
          src={caminho("/pvh/pvh-logo-vertical-branca.png")}
          alt="Prefeitura de Porto Velho"
          width={210}
          height={273}
          className={styles.logo}
        />

        <div className={styles.semec}>
          <h2 className={styles.marca}>
            <BrandMark size={26} />
            SISConforme
          </h2>
          <p>
            Portal de autorregularização do ISSQN da Secretaria Municipal de Economia: uma experiência digital mais
            clara, direta e acessível para o contribuinte de Porto Velho.
          </p>

          <h3>Institucional</h3>
          <address className={styles.contato}>
            <span>Avenida 7 de Setembro, 744 - Centro</span>
            <span>Porto Velho - Rondônia</span>
            <span>CEP: 76801096</span>
            <a href="tel:+556939013038">(69) 3901-3038</a>
            <a href="mailto:gab.semfaz@portovelho.ro.gov.br">gab.semfaz@portovelho.ro.gov.br</a>
            <span>Segunda a Sexta: 08h às 14h</span>
          </address>
        </div>

        <div className={styles.redes}>
          <h3>Redes Sociais</h3>
          <p>Siga-nos nas redes sociais e fique por dentro de todas as novidades da nossa cidade.</p>
          <ul className={styles.icones}>
            {REDES.map(({ nome, href, Icone }) => (
              <li key={nome}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${nome} da Prefeitura de Porto Velho (abre em nova aba)`}
                >
                  <Icone size={20} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          <p className={styles.seguidores}>+150K seguidores nas redes sociais</p>
        </div>
      </div>

      <div className={styles.base}>
        <ul>
          <li className={styles.direitos}>© 2026 SEMEC · Secretaria Municipal de Economia</li>
          {LINKS.map((texto) => (
            <li key={texto}>
              <a href="#">{texto}</a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
