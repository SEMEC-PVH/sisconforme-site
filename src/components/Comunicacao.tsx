import styles from "./Comunicacao.module.css";

export default function Comunicacao() {
  return (
    <>
      <div className="col">
        <h2 id="comunicacao">Comunicação</h2>
        <p>
          Uma divergência fiscal não precisa ser uma carta difícil de entender. Comparamos a notificação
          tradicional com o alerta do SISConforme para a mesma situação: receita por cartão maior que as notas
          emitidas em maio de 2026.
        </p>
      </div>

      <div className="wide block">
        <div className="tabs" role="tablist">
          <button role="tab" aria-selected>
            Receita sem nota
          </button>
        </div>
        <div className={styles.sbs}>
          <div>
            <p className={styles.lab}>
              <i></i>Notificação tradicional
            </p>
            <div className={styles.msg}>
              <p>
                Fica o contribuinte acima qualificado NOTIFICADO a apresentar, no prazo de 10 (dez) dias,
                documentação comprobatória referente às operações do período de apuração 05/2026, tendo em vista
                indícios de omissão de receitas apurados em procedimento de cruzamento de informações, sob pena de
                lançamento de ofício do crédito tributário e aplicação das penalidades cabíveis previstas na
                legislação tributária municipal.
              </p>
            </div>
          </div>
          <div>
            <p className={styles.lab}>
              <i></i>Alerta SISConforme
            </p>
            <div className={styles.msg}>
              <p>
                <b>Maio de 2026: R$ 26.240,00 recebidos por cartão sem nota fiscal correspondente.</b>
              </p>
              <p>Cartão: R$ 97.540,00 · NFS-e emitidas: R$ 71.300,00 · PGDAS: R$ 71.300,00</p>
              <p>Você pode resolver sem multa até o início de qualquer fiscalização:</p>
              <span className={styles.mono}>
                {
                  "1. Emitir as NFS-e faltantes da competência 05/2026\n2. Retificar o PGDAS de maio\n3. Ou justificar (ex.: venda de mercadoria, estorno)"
                }
              </span>
            </div>
          </div>
        </div>
        <p className="caption">Exemplo com CNPJ fictício. O texto final dos alertas será validado pela Procuradoria.</p>
      </div>
    </>
  );
}
