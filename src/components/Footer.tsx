import BrandMark from "./BrandMark";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.fIn}>
        <div>
          <p
            style={{
              color: "var(--night-ink)",
              font: "600 17px var(--sans)",
              display: "flex",
              gap: "9px",
              alignItems: "center",
            }}
          >
            <BrandMark size={28} />
            SISConforme
          </p>
          <p style={{ marginTop: "12px", maxWidth: "30ch" }}>
            Portal de autorregularização do ISSQN · Secretaria Municipal de Economia de Porto Velho
          </p>
        </div>
        <div>
          <h3>Portal</h3>
          <ul>
            <li>
              <a href="#introducao">Introdução</a>
            </li>
            <li>
              <a href="#cruzamento">Cruzamento</a>
            </li>
            <li>
              <a href="#comunicacao">Alertas</a>
            </li>
            <li>
              <a href="#disponibilidade">Disponibilidade</a>
            </li>
          </ul>
        </div>
        <div>
          <h3>Fontes</h3>
          <ul>
            <li>NFS-e municipal</li>
            <li>PGDAS-D</li>
            <li>Cartão Cidade · SEFIN-RO</li>
          </ul>
        </div>
        <div>
          <h3>Legislação</h3>
          <ul>
            <li>CTN, arts. 138 e 198</li>
            <li>LC nº 116/2003</li>
            <li>LC nº 123/2006</li>
            <li>Lei nº 13.709/2018</li>
          </ul>
        </div>
        <div>
          <h3>Ajuda</h3>
          <ul>
            <li>
              <a href="#seguranca">Privacidade</a>
            </li>
            <li>
              <a href="#seguranca">Segurança</a>
            </li>
            <li>
              <a href="#disponibilidade">Atendimento</a>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.fBot}>
        <span>© 2026 Prefeitura de Porto Velho · SEMEC</span>
        <span>Protótipo de interface</span>
      </div>
    </footer>
  );
}
