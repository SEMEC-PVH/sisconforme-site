import { caminho } from "@/lib/caminho";
import styles from "./FaixaPVH.module.css";

/**
 * Faixa da identidade visual de Porto Velho (ônibus, trem, barco, caixas d'água…) com a borda amarela embaixo.
 * Veio do layout público do sisconforme-web (componente `Baner`).
 */
export default function FaixaPVH() {
  return (
    <div
      className={styles.faixa}
      style={{ backgroundImage: `url(${caminho("/pvh/baner.png")})` }}
      role="presentation"
    />
  );
}
