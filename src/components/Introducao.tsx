export default function Introducao() {
  return (
    <div className="col" id="introducao">
      <h2 style={{ marginTop: 0 }}>Conheça o SISConforme</h2>
      <p className="lead">
        O SISConforme é o portal de autorregularização do Imposto Sobre Serviços de Qualquer Natureza (ISSQN) de
        Porto Velho. Ele mostra a cada contribuinte as mesmas divergências que a malha fiscal encontra, antes que
        elas virem auto de infração.
      </p>

      <p>
        O sistema é o primeiro serviço da Secretaria da Receita Municipal, da Secretaria Municipal de Economia
        (Semec), criado para comparar informações de diferentes fontes. São analisadas informações de notas
        fiscais, inclusive do repositório nacional, declarações e pagamentos do Simples Nacional e valores
        recebidos por cartão de débito, crédito e Pix, compartilhados pela Secretaria de Estado de Finanças de
        Rondônia (SEFIN-RO) por meio de convênio.
      </p>
      <p>
        Antes de um alerta chegar ao contribuinte, cada divergência é revisada por auditores fiscais. O
        contribuinte somente recebe alertas que passaram por conferência humana, e pode resolvê-los por conta
        própria, mediante autorregularização, prevista no Código Tributário Municipal.
      </p>

      <h3>O que muda para o contribuinte?</h3>
      <p>
        <b>Transparência.</b> A empresa consegue consultar os dados usados no cruzamento. Quando existe uma
        diferença, o portal mostra qual informação não confere e qual é o valor, sem que o contribuinte precise
        esperar uma intimação.
      </p>
      <p>
        <b>Autorregularização.</b> Ao identificar uma diferença, o contribuinte pode corrigir as informações pelo
        próprio portal, antes do início da fiscalização, conforme as regras previstas na legislação. Não é
        necessário abrir um processo ou ir até a Secretaria.
      </p>
      <p>
        <b>Sigilo.</b> Cada CNPJ acessa apenas os próprios dados, autenticado por certificado digital e-CNPJ ou pelo
        Login Único gov.br. Contadores enxergam somente as empresas que representam, por procuração eletrônica. Os
        detalhes estão na seção de <a href="#seguranca">Segurança</a>.
      </p>
      <p>
        <b>Comunicação.</b> Os alertas mostram de forma direta o que foi identificado, qual é o valor da diferença
        e o que pode ser feito para corrigi-la. Assim, o contribuinte consegue entender a situação sem precisar
        buscar atendimento presencial.
      </p>

      <h2 id="cruzamento">Cruzamento e custo da conformidade</h2>
      <p>
        O principal diferencial do SISConforme é mostrar a possível divergência antes do início da fiscalização. No
        modelo tradicional, o contribuinte pode descobrir o problema apenas após receber uma intimação. Com o
        portal, o alerta chega enquanto a correção ainda pode ser feita de forma voluntária.
      </p>
    </div>
  );
}
