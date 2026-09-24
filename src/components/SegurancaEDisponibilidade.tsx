export default function SegurancaEDisponibilidade() {
  return (
    <div className="col">
      <h2 id="seguranca">Segurança</h2>
      <p>
        Dado fiscal é sigiloso por lei. O art. 198 do CTN veda a divulgação da situação econômica do contribuinte, e
        a LGPD rege o tratamento de dados pessoais de sócios e representantes. O SISConforme foi desenhado a partir
        dessas duas regras.
      </p>

      <h3>Autenticação</h3>
      <p>
        A entrada é feita com certificado digital e-CNPJ ou pelo Login Único gov.br, via OpenID Connect. Não existem
        senhas próprias do portal para vazar ou esquecer.
      </p>

      <h3>Autorização por objeto</h3>
      <p>
        Cada consulta é filtrada pelo CNPJ do titular no backend, e não na tela. Não há rota, parâmetro ou relatório
        que devolva dados de outra empresa — nem para contadores, que só veem as empresas vinculadas por procuração.
      </p>

      <h3>Origem dos dados</h3>
      <p>
        NFS-e vem da base tributária do município e do repositório nacional de notas. O PGDAS vem da Receita
        Federal. Os recebimentos dos meios de pagamento chegam pela API do Cartão Cidade da SEFIN-RO, sob o Termo de
        Convênio nº 225/2026/PGE-SEFIN, e são usados exclusivamente para fins fiscais.
      </p>

      <h3>Somente leitura</h3>
      <p>
        O portal consome, por REST, apenas resultados já validados no TRAMA. As bases de origem ficam atrás de
        conexões somente leitura; nenhuma ação no portal altera dados de outro sistema sem passar pelos fluxos
        oficiais de emissão e retificação.
      </p>

      <h2 id="disponibilidade">Disponibilidade</h2>
      <p>
        O SISConforme está em implantação. A primeira fase atende empresas prestadoras de serviço com inscrição
        municipal em Porto Velho, incluindo optantes do Simples Nacional. O acesso para escritórios de contabilidade
        e o painel interno da auditoria entram na sequência.
      </p>
      <p>
        Dúvidas sobre o portal podem ser encaminhadas à Secretaria Municipal de Economia pelos canais oficiais de
        atendimento da Prefeitura de Porto Velho.
      </p>
    </div>
  );
}
