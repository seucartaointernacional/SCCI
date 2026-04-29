import type { Metadata } from "next";
import LegalPageLayout from "@/components/homepage/LegalPageLayout";

export const metadata: Metadata = {
  title: "Termos de Uso · Seu Cartão Internacional",
  description:
    "Termos e condições de uso da plataforma Seu Cartão Internacional, intermediadora de ofertas de cartões de crédito internacionais.",
};

export default function TermosPage() {
  return (
    <LegalPageLayout
      title="Termos de Uso"
      intro="Estes termos regulam o uso do site Seu Cartão Internacional e a relação entre o usuário e a plataforma. Ao utilizar nossos serviços, você concorda integralmente com as condições abaixo."
      lastUpdated="28 de abril de 2026"
    >
      <div className="legal-callout">
        <strong>Importante:</strong> O Seu Cartão Internacional é uma{" "}
        <strong>plataforma intermediária</strong>. Não somos um banco, instituição
        financeira, administradora de cartão de crédito nem emissora de cartões. Atuamos
        como ponte entre o usuário e bancos parceiros internacionais que avaliam cada
        pedido de forma independente.
      </div>

      <h2>1. Sobre nós</h2>
      <p>
        Esta plataforma é operada por <strong>Seu Cartão Internacional</strong>, inscrito
        no CNPJ <strong>85.557.385/0001-45</strong>, com sede na Travessa Henrique Maine,
        nº 1138, sala 1001, 10º andar, Vila Ipojuca, São Paulo/SP, CEP 05056-023
        (&ldquo;Empresa&rdquo;, &ldquo;nós&rdquo;).
      </p>
      <p>
        Para qualquer questão relacionada a estes Termos, o canal oficial é{" "}
        <a href="mailto:contato@seucartaointernacional.com.br">
          contato@seucartaointernacional.com.br
        </a>
        .
      </p>

      <h2>2. O serviço</h2>
      <p>
        O usuário preenche, gratuitamente, um formulário com seus dados pessoais e
        financeiros. A Empresa encaminha esses dados a bancos e instituições parceiras
        internacionais, que realizam análise de crédito independente e podem ou não
        apresentar uma proposta de cartão de crédito internacional.
      </p>
      <p>
        A Empresa <strong>não garante</strong> aprovação. As taxas de aprovação divulgadas
        no site refletem médias históricas e <strong>não constituem promessa</strong> de
        resultado individual. A decisão final é exclusiva da instituição emissora.
      </p>

      <h2>3. Cadastro e veracidade dos dados</h2>
      <p>
        Ao preencher o formulário, o usuário declara que:
      </p>
      <ul>
        <li>É maior de 18 anos e plenamente capaz para contratar serviços financeiros;</li>
        <li>
          Os dados informados são verdadeiros, completos e atualizados, sob pena de
          recusa da proposta e responsabilização civil e criminal;
        </li>
        <li>
          Está ciente de que a análise de crédito é feita por terceiros (bancos
          parceiros) sob seus próprios critérios.
        </li>
      </ul>

      <h2>4. Custos e pagamentos</h2>
      <p>
        A solicitação e a intermediação são <strong>gratuitas</strong> para o usuário. A
        Empresa é remunerada exclusivamente pelos bancos parceiros, sem qualquer
        cobrança ao solicitante. Eventuais taxas de emissão, anuidade ou tarifas do
        próprio cartão, quando existirem, serão informadas <strong>antes</strong> da
        aceitação da proposta pelo usuário.
      </p>
      <p>
        A Empresa <strong>nunca</strong> solicitará pagamentos antecipados, depósitos ou
        transferências para liberação de cartão. Caso receba esse tipo de pedido em nome
        do Seu Cartão Internacional, denuncie pelo nosso canal oficial.
      </p>

      <h2>5. Uso aceitável</h2>
      <p>
        É vedado ao usuário:
      </p>
      <ul>
        <li>Fornecer dados falsos, de terceiros ou obtidos de forma irregular;</li>
        <li>Tentar burlar mecanismos de segurança ou validação;</li>
        <li>Utilizar o serviço para fins ilícitos, fraude, lavagem de dinheiro ou financiamento ao terrorismo;</li>
        <li>Reproduzir, copiar ou explorar comercialmente conteúdos do site sem autorização.</li>
      </ul>

      <h2>6. Limitação de responsabilidade</h2>
      <p>
        A Empresa não se responsabiliza por:
      </p>
      <ul>
        <li>Decisões de aprovação ou recusa por parte dos bancos parceiros;</li>
        <li>Atrasos, falhas ou interrupções de serviços de terceiros (correios, instituições financeiras, redes de cartão, etc.);</li>
        <li>Uso indevido do cartão pelo titular após sua emissão;</li>
        <li>Indisponibilidades técnicas pontuais do site, sempre dentro do esforço razoável de manutenção.</li>
      </ul>

      <h2>7. Propriedade intelectual</h2>
      <p>
        Todo o conteúdo do site — textos, logotipo, marcas, layout, imagens e códigos —
        é de titularidade da Empresa ou licenciado a ela, protegido pela legislação
        brasileira de propriedade intelectual. Reprodução sem autorização é proibida.
      </p>

      <h2>8. Alterações destes Termos</h2>
      <p>
        Estes Termos podem ser atualizados a qualquer tempo. A versão vigente é sempre a
        publicada nesta página, com a data da última atualização indicada acima. O uso
        continuado da plataforma após uma atualização configura aceite das novas
        condições.
      </p>

      <h2>9. Lei aplicável e foro</h2>
      <p>
        Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica
        eleito o foro da Comarca de São Paulo/SP para dirimir eventuais controvérsias,
        com renúncia a qualquer outro, por mais privilegiado que seja.
      </p>

      <h2>10. Contato</h2>
      <p>
        Em caso de dúvidas, sugestões ou notificações, entre em contato:
      </p>
      <ul>
        <li>
          <strong>E-mail:</strong>{" "}
          <a href="mailto:contato@seucartaointernacional.com.br">
            contato@seucartaointernacional.com.br
          </a>
        </li>
        <li>
          <strong>Telefone:</strong> +55 21 98873-9888
        </li>
        <li>
          <strong>Endereço:</strong> Travessa Henrique Maine, 1138 — Sala 1001, 10º
          andar — Vila Ipojuca, São Paulo/SP — CEP 05056-023
        </li>
      </ul>
    </LegalPageLayout>
  );
}
