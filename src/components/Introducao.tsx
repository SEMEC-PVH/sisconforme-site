export default function Introducao() {
  return (
    <div className="col" id="introducao">
      <p className="lead">
        Apresentamos o SISConforme, o portal de autorregularização do ISSQN de Porto Velho. Ele mostra a cada
        contribuinte as mesmas divergências que a malha fiscal encontra — antes que elas virem auto de infração.
      </p>

      <p>
        O SISConforme é o primeiro serviço da Secretaria da Receita Municipal da Secretaria Municipal de Economia
        construído sobre cruzamento de dados massivos. O sistema cruza diversas fontes de dados, notadamente: as
        notas fiscais, inclusive as do repositório nacional, as declarações e pagamentos do Simples Nacional e os
        meios de recebimentos financeiros (cartão de débito, crédito, Pix etc.), compartilhados pela SEFIN-RO por
        meio de convênio.
      </p>
      <p>
        Cada divergência é revisada por auditores fiscais da receita municipal antes de chegar ao portal. O
        contribuinte somente recebe alertas que passaram por conferência humana, e pode resolvê-los por conta
        própria, mediante autorregularização, prevista no Código Tributário Municipal.
      </p>
      <p>Veja a vantagem para o contribuinte de Porto Velho:</p>
      <p>
        <b>Transparência.</b> A empresa acessa, competência por competência, todos os dados que o Fisco também
        acessa. Quando ocorrem divergências entre os dados cruzados, o portal indica qual fonte diverge e por
        quanto — em vez de uma intimação genérica meses depois.
      </p>
      <p>
        <b>Autorregularização.</b> No mesmo fluxo, o contribuinte pode se regularizar, inclusive antes mesmo de ser
        notificado. Não é preciso abrir processo, marcar atendimento ou ir ao balcão da secretaria.
      </p>
      <p>
        <b>Sigilo.</b> Cada CNPJ acessa apenas os próprios dados, autenticado por certificado digital e-CNPJ ou pelo
        Login Único gov.br. Contadores enxergam somente as empresas que representam, por procuração eletrônica. Os
        detalhes estão na seção de <a href="#seguranca">Segurança</a>.
      </p>
      <p>
        <b>Comunicação.</b> Os alertas dizem o que aconteceu, qual o valor e o que fazer, em linguagem direta. O
        contribuinte entende a divergência sem precisar ligar para a Prefeitura nem procurar atendimento presencial.
      </p>

      <h2 id="cruzamento">Cruzamento e custo da conformidade</h2>
      <p>
        O maior ganho do SISConforme está no momento em que a divergência aparece. No modelo tradicional, a empresa
        só descobre o problema quando a fiscalização já foi iniciada — e aí a multa de ofício é inevitável. No
        portal, o alerta chega enquanto a correção ainda é voluntária.
      </p>
    </div>
  );
}
