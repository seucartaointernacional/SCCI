import type { Metadata } from "next";
import LegalPageLayout from "@/components/homepage/LegalPageLayout";

export const metadata: Metadata = {
  title: "LGPD — Direitos do Titular · Seu Cartão Internacional",
  description:
    "Como exercer seus direitos como titular de dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD).",
};

export default function LGPDPage() {
  return (
    <LegalPageLayout
      title="LGPD — Direitos do Titular"
      intro="Você é o dono dos seus dados. Aqui está o passo a passo para exercer cada um dos direitos garantidos pela Lei Geral de Proteção de Dados (Lei nº 13.709/2018)."
      lastUpdated="28 de abril de 2026"
    >
      <div className="legal-callout">
        <strong>Canal único de atendimento LGPD:</strong>{" "}
        <a href="mailto:contato@seucartaointernacional.com.br">
          contato@seucartaointernacional.com.br
        </a>{" "}
        — coloque <strong>&ldquo;LGPD&rdquo;</strong> no assunto. Respondemos em até{" "}
        <strong>15 dias</strong>, conforme prazo legal.
      </div>

      <h2>Quem é o Encarregado (DPO)?</h2>
      <p>
        O Encarregado pelo Tratamento de Dados Pessoais é a pessoa responsável por
        atender suas solicitações e dialogar com a Autoridade Nacional de Proteção de
        Dados (ANPD). No Seu Cartão Internacional, ele pode ser contatado pelo e-mail{" "}
        <a href="mailto:contato@seucartaointernacional.com.br">
          contato@seucartaointernacional.com.br
        </a>
        .
      </p>

      <h2>Seus direitos (art. 18 da LGPD)</h2>

      <h3>1. Confirmação e acesso</h3>
      <p>
        Você pode pedir <strong>confirmação</strong> de que tratamos dados sobre você e
        ter <strong>acesso</strong> a esses dados. Resposta em até 15 dias.
      </p>

      <h3>2. Correção</h3>
      <p>
        Pedir <strong>correção</strong> de dados incompletos, inexatos ou desatualizados.
      </p>

      <h3>3. Anonimização, bloqueio ou eliminação</h3>
      <p>
        Pedir <strong>anonimização, bloqueio ou eliminação</strong> de dados
        desnecessários, excessivos ou tratados em desconformidade com a LGPD.
      </p>

      <h3>4. Portabilidade</h3>
      <p>
        Solicitar a <strong>portabilidade</strong> dos seus dados a outro fornecedor de
        serviço, em formato estruturado e interoperável.
      </p>

      <h3>5. Eliminação dos dados tratados com consentimento</h3>
      <p>
        Solicitar a <strong>eliminação</strong> dos dados pessoais tratados com base no
        seu consentimento. Ressalvadas as hipóteses legais de retenção (ex.: obrigação
        legal, exercício regular de direito).
      </p>

      <h3>6. Informação sobre compartilhamento</h3>
      <p>
        Saber com quais entidades públicas e privadas <strong>compartilhamos</strong>{" "}
        seus dados.
      </p>

      <h3>7. Informação sobre não fornecer consentimento</h3>
      <p>
        Saber as <strong>consequências</strong> de não fornecer consentimento e a
        possibilidade de não fornecê-lo.
      </p>

      <h3>8. Revogação do consentimento</h3>
      <p>
        <strong>Revogar</strong> o consentimento a qualquer tempo, mediante manifestação
        expressa ao Encarregado.
      </p>

      <h3>9. Revisão de decisões automatizadas</h3>
      <p>
        Pedir <strong>revisão</strong> de decisões tomadas exclusivamente com base em
        tratamento automatizado que afetem seus interesses.
      </p>

      <h3>10. Reclamar à ANPD</h3>
      <p>
        Se você entende que seus direitos não foram atendidos, pode apresentar petição à
        Autoridade Nacional de Proteção de Dados em{" "}
        <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer">
          gov.br/anpd
        </a>
        .
      </p>

      <hr />

      <h2>Como solicitar?</h2>
      <ol>
        <li>
          Envie um e-mail para{" "}
          <a href="mailto:contato@seucartaointernacional.com.br">
            contato@seucartaointernacional.com.br
          </a>{" "}
          com o assunto <strong>&ldquo;LGPD — [direito que deseja exercer]&rdquo;</strong>;
        </li>
        <li>
          No corpo, descreva o pedido e informe seu nome completo e CPF (necessário para
          validar a identidade);
        </li>
        <li>
          Caso a solicitação seja feita em nome de outra pessoa, anexe a procuração
          correspondente;
        </li>
        <li>Você receberá resposta em até 15 dias corridos.</li>
      </ol>

      <h2>Custos</h2>
      <p>
        O exercício dos seus direitos é <strong>gratuito</strong>. Não cobramos para
        atender solicitações LGPD.
      </p>

      <h2>Validação de identidade</h2>
      <p>
        Para sua proteção, podemos solicitar informações adicionais para confirmar que
        você é, de fato, o titular dos dados antes de executar a solicitação.
      </p>
    </LegalPageLayout>
  );
}
