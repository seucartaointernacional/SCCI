import type { Metadata } from "next";
import LegalPageLayout from "@/components/homepage/LegalPageLayout";

export const metadata: Metadata = {
  title: "Política de Privacidade · Seu Cartão Internacional",
  description:
    "Como o Seu Cartão Internacional coleta, usa, compartilha e protege seus dados pessoais, em conformidade com a LGPD (Lei nº 13.709/2018).",
};

export default function PrivacidadePage() {
  return (
    <LegalPageLayout
      title="Política de Privacidade"
      intro="Esta Política descreve como tratamos seus dados pessoais, com base na Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Levamos sua privacidade a sério."
      lastUpdated="28 de abril de 2026"
    >
      <h2>1. Quem é o controlador dos seus dados</h2>
      <p>
        <strong>Seu Cartão Internacional</strong>, CNPJ 85.557.385/0001-45, com sede na
        Travessa Henrique Maine, nº 1138, sala 1001, 10º andar, Vila Ipojuca, São
        Paulo/SP, CEP 05056-023, é o controlador dos dados pessoais coletados nesta
        plataforma.
      </p>

      <h2>2. Quais dados coletamos</h2>
      <h3>2.1 Dados informados por você</h3>
      <ul>
        <li>
          <strong>Dados de identificação:</strong> nome completo, CPF, data de nascimento,
          telefone, e-mail.
        </li>
        <li>
          <strong>Dados de endereço:</strong> CEP, logradouro, número, complemento,
          bairro, cidade, estado.
        </li>
        <li>
          <strong>Dados financeiros:</strong> renda mensal declarada, ocupação, situação
          de crédito (informada por você).
        </li>
      </ul>

      <h3>2.2 Dados coletados automaticamente</h3>
      <ul>
        <li>
          <strong>Dados de navegação:</strong> endereço IP, tipo de dispositivo,
          navegador, sistema operacional, páginas visitadas, data/hora.
        </li>
        <li>
          <strong>Cookies e tecnologias similares:</strong> ver Seção 8.
        </li>
      </ul>

      <h2>3. Para que usamos seus dados (finalidades)</h2>
      <ul>
        <li>
          <strong>Intermediação da solicitação:</strong> encaminhar seus dados a bancos
          parceiros internacionais para análise de crédito e proposta de cartão.
        </li>
        <li>
          <strong>Comunicação com você:</strong> envio de status da solicitação,
          confirmações, suporte e respostas a contatos.
        </li>
        <li>
          <strong>Prevenção a fraudes:</strong> validação de identidade e detecção de
          atividades suspeitas.
        </li>
        <li>
          <strong>Cumprimento de obrigações legais:</strong> retenção de dados conforme
          exigido pelas autoridades.
        </li>
        <li>
          <strong>Melhoria do serviço:</strong> análises estatísticas agregadas para
          aprimorar a plataforma.
        </li>
      </ul>

      <h2>4. Bases legais (LGPD, art. 7º)</h2>
      <ul>
        <li>
          <strong>Execução de contrato:</strong> tratamento necessário para a
          intermediação solicitada por você.
        </li>
        <li>
          <strong>Cumprimento de obrigação legal ou regulatória.</strong>
        </li>
        <li>
          <strong>Legítimo interesse:</strong> prevenção a fraudes e melhoria do serviço,
          sempre observando seus direitos fundamentais.
        </li>
        <li>
          <strong>Consentimento:</strong> quando especificamente solicitado (ex.: envio de
          comunicações de marketing). Você pode revogar a qualquer tempo.
        </li>
      </ul>

      <h2>5. Com quem compartilhamos seus dados</h2>
      <p>Compartilhamos seus dados, na medida estritamente necessária, com:</p>
      <ul>
        <li>
          <strong>Bancos e instituições financeiras parceiras:</strong> para análise da
          sua solicitação;
        </li>
        <li>
          <strong>Bureaus de crédito e antifraude:</strong> para validação de dados;
        </li>
        <li>
          <strong>Prestadores de serviço (operadores):</strong> hospedagem em nuvem,
          ferramentas de e-mail, gestão de relacionamento, sob contrato de
          confidencialidade;
        </li>
        <li>
          <strong>Autoridades públicas:</strong> quando legalmente exigido, mediante
          requisição formal.
        </li>
      </ul>
      <p>
        <strong>Não vendemos</strong> seus dados a terceiros para fins de marketing.
      </p>

      <h2>6. Transferência internacional de dados</h2>
      <p>
        Como os bancos parceiros estão sediados no exterior, seus dados podem ser
        transferidos para países que oferecem grau de proteção adequado ou com base em
        cláusulas contratuais e garantias específicas, conforme art. 33 da LGPD.
      </p>

      <h2>7. Por quanto tempo guardamos seus dados</h2>
      <ul>
        <li>
          Pelo tempo necessário para cumprir as finalidades descritas;
        </li>
        <li>
          Pelo prazo exigido por obrigação legal ou regulatória (em geral, até 5 anos
          após o término do relacionamento, conforme Código Civil e legislações
          aplicáveis);
        </li>
        <li>
          Para exercício regular de direitos em processo judicial, administrativo ou
          arbitral.
        </li>
      </ul>

      <h2>8. Cookies</h2>
      <p>
        Usamos cookies essenciais para o funcionamento do site (sessão, segurança) e
        cookies analíticos agregados (medição de uso). Você pode bloquear cookies nas
        configurações do seu navegador, mas isso pode prejudicar funcionalidades do
        site.
      </p>

      <h2>9. Como protegemos seus dados</h2>
      <ul>
        <li>Conexão criptografada (HTTPS/TLS) em todo o site;</li>
        <li>Armazenamento em provedores de nuvem com certificações de segurança;</li>
        <li>Controle de acesso restrito por necessidade;</li>
        <li>Monitoramento de incidentes e plano de resposta.</li>
      </ul>

      <h2>10. Seus direitos como titular</h2>
      <p>
        Você pode exercer, a qualquer tempo, os direitos do art. 18 da LGPD, conforme
        descrito em detalhe na nossa página{" "}
        <a href="/lgpd">LGPD — Direitos do Titular</a>.
      </p>

      <h2>11. Encarregado pelo Tratamento de Dados (DPO)</h2>
      <p>
        Para exercer seus direitos ou tirar dúvidas sobre privacidade, fale com nosso
        Encarregado pelo e-mail{" "}
        <a href="mailto:contato@seucartaointernacional.com.br">
          contato@seucartaointernacional.com.br
        </a>{" "}
        (assunto: &ldquo;LGPD&rdquo;).
      </p>

      <h2>12. Atualizações desta Política</h2>
      <p>
        Esta Política pode ser atualizada para refletir mudanças regulatórias ou
        operacionais. A versão vigente é sempre a publicada nesta página.
      </p>
    </LegalPageLayout>
  );
}
