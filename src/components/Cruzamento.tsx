import styles from "./Cruzamento.module.css";

export default function Cruzamento() {
  return (
    <>
      <div className="wide block">
        {/* rolável no celular: precisa receber foco para rolar pelo teclado */}
        <div className={styles.tscroll} tabIndex={0} role="region" aria-label="Comparação entre o SISConforme e os outros canais">
          <table className={styles.cmp}>
            <thead>
              <tr>
                <th>
                  <span className="sr-only">Critério</span>
                </th>
                <th className={styles.hl}>SISConforme</th>
                <th>Fiscalização de ofício</th>
                <th>Atendimento presencial</th>
                <th>Consulta formal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>
                  Quando a empresa descobre<small>após o fato gerador</small>
                </th>
                <td className={styles.hl}>
                  Na competência seguinte<small>alerta no portal</small>
                </td>
                <td>
                  Meses ou anos depois<small>na intimação</small>
                </td>
                <td>Quando procura a secretaria</td>
                <td>—</td>
              </tr>
              <tr>
                <th>
                  Multa de ofício<small>CTN, art. 138</small>
                </th>
                <td className={styles.hl}>
                  Não se aplica<small>denúncia espontânea</small>
                </td>
                <td>
                  Aplica-se<small>lançamento de ofício</small>
                </td>
                <td>Depende do momento</td>
                <td>Não se aplica</td>
              </tr>
              <tr>
                <th>Canal de resolução</th>
                <td className={styles.hl}>
                  100% digital<small>e-CNPJ ou gov.br</small>
                </td>
                <td>Processo administrativo</td>
                <td>Balcão da SEMEC</td>
                <td>Processo administrativo</td>
              </tr>
              <tr>
                <th>
                  Visibilidade das fontes<small>cartão · NFS-e · PGDAS</small>
                </th>
                <td className={styles.hl}>As três, lado a lado</td>
                <td>Só no auto de infração</td>
                <td>Parcial</td>
                <td>—</td>
              </tr>
              <tr>
                <th>
                  Revisão humana<small>antes do contato</small>
                </th>
                <td className={styles.hl}>
                  Sempre<small>auditor valida a malha</small>
                </td>
                <td>Sempre</td>
                <td>—</td>
                <td>Sempre</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="col foot">
        <p>
          <sup>1</sup> <b>Denúncia espontânea:</b> nos termos do art. 138 do CTN, a responsabilidade por infração é
          excluída quando o contribuinte a denuncia e paga o tributo com juros antes do início de qualquer
          procedimento fiscal. O alerta do portal não constitui início de procedimento.
        </p>
        <p>
          <sup>2</sup> <b>Autorregularização:</b> o art. 45 do Código Tributário Municipal reforça que “§ 2º Não
          será afastada a espontaneidade quando o sujeito passivo for notificado à autorregularização, nos termos
          do § 1º do Art. 105 deste Código.”
        </p>
        <p>
          <sup>3</sup> <b>Meios de pagamento:</b> os valores de recebimentos por cartão vêm do sistema Cartão Cidade
          da SEFIN-RO, compartilhados sob o Termo de Convênio nº 225/2026/PGE-SEFIN.
        </p>
      </div>

      <div className="col">
        <h3 style={{ marginTop: 72 }}>Como o cruzamento se comporta</h3>
        <p>
          Nos testes internos com a base de 2026, a maior parte das divergências veio de receita por cartão sem
          nota correspondente. Divergências entre NFS-e e PGDAS são menos frequentes, mas têm valor médio maior —
          normalmente um mês inteiro declarado a menor.
        </p>
      </div>
    </>
  );
}
