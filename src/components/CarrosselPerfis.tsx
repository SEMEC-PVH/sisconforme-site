"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CarrosselPerfis.module.css";

interface Perfil {
  aba: string;
  cenario: string;
  quem: string;
  acesso: string;
  marca: string;
}

const PERFIS: Perfil[] = [
  {
    aba: "Contribuinte",
    cenario:
      "A clínica recebeu R$ 97,5 mil no cartão em maio, mas emitiu R$ 71,3 mil em notas. O alerta aparece no portal com a diferença calculada, e a responsável emite as notas faltantes no mesmo dia, sem multa.",
    quem: "Empresa do Simples Nacional",
    acesso: "Acesso por e-CNPJ",
    marca: "PJ",
  },
  {
    aba: "Contador",
    cenario:
      "Um escritório com 140 clientes vê num único painel quais empresas têm alerta aberto, ordenadas por valor. Em vez de descobrir o problema na intimação, ele trata as divergências no fechamento do mês.",
    quem: "Escritório de contabilidade",
    acesso: "Procuração eletrônica",
    marca: "CRC",
  },
  {
    aba: "Auditor",
    cenario:
      "A auditora monta a malha no TRAMA, valida as divergências e libera os alertas. No painel interno, acompanha quem regularizou e concentra a fiscalização nos casos que continuam abertos depois do prazo.",
    quem: "Auditoria fiscal · SEMEC",
    acesso: "Acesso interno",
    marca: "SEMEC",
  },
  {
    aba: "Procurador",
    cenario:
      "O procurador de uma empresa em recuperação consulta o histórico de alertas e respostas para instruir o parcelamento. Tudo que foi enviado pelo portal fica registrado, com data e responsável.",
    quem: "Representante legal",
    acesso: "Login Único gov.br",
    marca: "ADV",
  },
];

export default function CarrosselPerfis() {
  const [ativo, setAtivo] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const aplicar = () => {
      const track = trackRef.current;
      const primeiro = track?.children[0] as HTMLElement | undefined;
      if (!track || !primeiro) return;
      const passo = primeiro.getBoundingClientRect().width + 64;
      track.style.transform = `translateX(${-passo * ativo}px)`;
    };
    aplicar();
    window.addEventListener("resize", aplicar);
    return () => window.removeEventListener("resize", aplicar);
  }, [ativo]);

  useEffect(() => {
    const definirSb = () => {
      document.documentElement.style.setProperty(
        "--sb",
        `${window.innerWidth - document.documentElement.clientWidth}px`,
      );
    };
    definirSb();
    window.addEventListener("resize", definirSb);
    return () => window.removeEventListener("resize", definirSb);
  }, []);

  return (
    <>
      <div className="col">
        <p>Cada perfil de usuário encontra no portal uma visão diferente da mesma informação:</p>
      </div>

      <div className={`col block ${styles.carousel}`}>
        <div className="tabs" role="tablist">
          {PERFIS.map((perfil, i) => (
            <button key={perfil.aba} role="tab" aria-selected={ativo === i} onClick={() => setAtivo(i)}>
              {perfil.aba}
            </button>
          ))}
        </div>
        <div className={styles.trackWrap}>
          <div className={styles.track} ref={trackRef}>
            {PERFIS.map((perfil, i) => (
              <div
                key={perfil.aba}
                className={`${styles.card} ${ativo === i ? styles.on : ""}`}
                onClick={() => setAtivo(i)}
              >
                <p className={styles.k}>Cenário</p>
                <p>{perfil.cenario}</p>
                <div className={styles.who}>
                  <div>
                    <b>{perfil.quem}</b>
                    <em>{perfil.acesso}</em>
                  </div>
                  <span className={styles.mark}>{perfil.marca}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
