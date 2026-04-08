# Design: Homepage + Redesign Completo — Seu Cartao Internacional

**Data:** 2026-04-08
**Abordagem:** Fintech Confiavel (estilo Nubank/C6)
**Escopo:** Homepage nova + redesign visual completo das 7 telas do fluxo + 4 telas admin

---

## Decisoes de Alinhamento

- Empresa intermediaria conectando clientes a bancos parceiros
- CNPJ: 85.557.385/0001-45
- Taxa de R$36,40 NAO aparece na homepage (so no fluxo)
- Prova social: depoimentos ficticios + numeros
- Imagens: foto de pessoa no hero + icones nas demais secoes
- Redesign visual completo de todas as telas
- Estilo: fintech moderna (clean, minimalista)
- Cores: branco dominante, azul primario, verde sucesso/CTA
- O usuario pode gerar imagens (logo, fotos) via API — fornecemos prompts

---

## Paleta de Cores

- **Primaria:** Azul (#2563EB / blue-600) — botoes, links, destaques
- **Primaria escura:** Azul escuro (#1E40AF / blue-800) — header, footer, secao numeros
- **Sucesso/CTA:** Verde (#16A34A / green-600) — botao aceitar, checks, confirmacao
- **Fundo principal:** Branco (#FFFFFF)
- **Fundo alternado:** Cinza claro (#F9FAFB / gray-50) — secoes alternadas
- **Texto principal:** Cinza escuro (#111827 / gray-900)
- **Texto secundario:** Cinza medio (#6B7280 / gray-500)
- **Erro/Alerta:** Vermelho (#DC2626 / red-600)
- **Badges:** Amarelo (#EAB308), Roxo (#7C3AED), Amber (#D97706)

## Tipografia

- Font: Inter (ja em uso)
- Headlines: font-bold, text-3xl a text-5xl
- Body: font-normal, text-base
- Captions: font-medium, text-sm, text-gray-500

---

## Homepage — Estrutura

### 1. Header/Navbar
- Logo "Seu Cartao Internacional" a esquerda
- Links: Como Funciona | Beneficios | Depoimentos | FAQ (scroll suave)
- Botao CTA: "Solicitar Cartao" (azul) a direita
- Fundo branco, sombra sutil ao scrollar (sticky)

### 2. Hero Section
- **Layout:** 2 colunas (desktop), 1 coluna (mobile)
- **Esquerda:**
  - Headline: copy forte (definida pelo copywriting skill)
  - Subtitulo: 1-2 linhas explicativas
  - Botao CTA grande (azul)
  - Mini selo: icone cadeado + "Seus dados estao protegidos"
- **Direita:** Foto de pessoa profissional/sorridente
- **Abaixo do hero:** Barra com 3 numeros em destaque
  - "+5.000 cartoes emitidos"
  - "98% de aprovacao"
  - "Sem consulta ao SPC/Serasa"

### 3. Como Funciona (3 passos)
- Titulo da secao centralizado
- 3 cards lado a lado (desktop), empilhados (mobile)
- Cada card: numero em circulo azul + icone + titulo + descricao
- Passo 1: "Preencha seus dados" — icone formulario
- Passo 2: "Receba sua proposta" — icone cartao
- Passo 3: "Receba em casa" — icone entrega/casa

### 4. Beneficios (grid 2x3)
- Titulo da secao centralizado
- 6 cards com icone + titulo + descricao
  1. Aceito mundialmente
  2. Compras em dolar, euro e libra
  3. Sem anuidade no primeiro ano
  4. Aprovacao em minutos
  5. Entrega em todo o Brasil
  6. Mesmo negativado pode solicitar
- Fundo: gray-50 (secao alternada)

### 5. Depoimentos (3 cards)
- Fundo: branco
- 3 cards com:
  - Foto avatar (circular)
  - Nome + Cidade
  - Texto do depoimento (2-3 linhas)
  - Estrelas (5/5)
- Depoimentos ficticios mas realistas

### 6. Numeros/Credibilidade
- Fundo azul escuro (blue-800), texto branco
- 4 metricas em linha:
  - +5.000 cartoes emitidos
  - 98% de aprovacao
  - 4.8 avaliacao
  - Todos os estados do Brasil

### 7. FAQ (Accordion)
- Titulo centralizado
- 6 perguntas com expand/collapse
  1. "O que e o Seu Cartao Internacional?"
  2. "Como funciona o processo?"
  3. "Preciso ter nome limpo?"
  4. "Quanto tempo demora pra receber?"
  5. "E seguro?"
  6. "Quais bandeiras estao disponiveis?"

### 8. CTA Final
- Fundo com gradiente azul sutil
- Headline: "Solicite seu cartao internacional agora"
- Botao CTA grande (verde ou branco)

### 9. Footer
- Fundo escuro (gray-900)
- Logo + descricao: "Seu Cartao Internacional e uma plataforma intermediaria que conecta voce as melhores ofertas de cartoes internacionais de bancos parceiros."
- Links uteis
- CNPJ: 85.557.385/0001-45
- Icones: cadeado SSL + dados protegidos
- (C) 2026 Seu Cartao Internacional. Todos os direitos reservados.

---

## Fluxo do Usuario — Redesign (7 telas)

### Elementos Globais (todas as telas do fluxo)
- **Progress bar horizontal no topo** — etapa atual destacada com icone e label
- **Header:** logo + "Voltar ao inicio"
- **Footer mini:** CNPJ + "Ambiente seguro" com icone cadeado
- **Visual:** cards brancos centralizados, rounded-2xl, sombra suave
- **Animacoes:** Framer Motion — fade-in, scale, spring

### Tela 1: Formulario (`/`)
- Titulo: "Solicite seu cartao"
- Formulario em card branco
- Campos em grid 2 colunas (desktop), 1 coluna (mobile)
- Agrupamento visual: Dados Pessoais | Endereco | Dados Financeiros
- Botao CTA azul largo: "Solicitar Proposta"
- Abaixo: icone cadeado + "Seus dados estao protegidos e nao serao compartilhados"

### Tela 2: Analise (`/analise`)
- 5 etapas com animacao sequencial
- Icone proprio por etapa (lupa, grafico, mapa, banco, aperto de mao)
- Check verde animado ao completar cada etapa
- Spinner azul na etapa ativa
- Rodape: "Conectando voce as melhores ofertas de nossos bancos parceiros"

### Tela 3: Proposta (`/proposta`)
- Card de credito 3D centralizado (manter componente atual, refinar visual)
- Detalhes da proposta em grid organizado abaixo
- Botoes: "Aceitar Proposta" (verde) | "Recusar" (cinza outline)
- Selo: "Proposta valida por 24h"
- Tela de recusa: tom respeitoso

### Tela 4: Processando (`/processando`)
- 3 etapas com animacao (banco, documento, check)
- Tom: "Estamos finalizando com o banco parceiro"

### Tela 5: Proposta Aceita (`/aceita`)
- Check verde grande animado
- Valor R$36,40 em destaque
- "Taxa unica de importacao e envio"
- 3 passos do que acontece depois
- Botao: "Pagar Taxa via PIX"

### Tela 6: Pagamento (`/pagamento`)
- QR Code grande centralizado
- Valor em destaque
- Botao "Copiar codigo PIX"
- Countdown 30min
- Selo: "Pagamento processado em ambiente seguro"

### Tela 7: Confirmacao (`/confirmacao`)
- Check verde com animacao spring
- "Tudo certo! Seu cartao esta a caminho"
- Box prazo de entrega (22-36 dias uteis + datas)
- Box confirmacao email
- Botao: "Voltar ao Inicio"

---

## Painel Admin — Redesign (4 telas)

### Elementos Globais
- **Sidebar esquerda fixa** — logo, Dashboard, Leads, Sair
- **Visual:** fundo gray-50, cards brancos com sombra

### Admin 1: Login (`/admin/login`)
- Centralizado, fundo gray-50
- Card branco com logo + "Painel Administrativo"
- Campos: usuario + senha
- Botao azul "Entrar"

### Admin 2: Dashboard (`/admin`)
- Saudacao: "Bom dia, Admin" + data
- 4 cards metricas (azul, verde, roxo, amber)
- Tabela "Ultimos leads" (5 recentes)

### Admin 3: Lista de Leads (`/admin/leads`)
- Busca + filtros (status, data)
- Tabela: Nome | CPF | Email | Status | Data
- Badges coloridos por status
- Paginacao
- Clique → detalhe

### Admin 4: Detalhe do Lead (`/admin/leads/[id]`)
- Breadcrumb: Dashboard > Leads > Nome
- 2 colunas: Dados Pessoais | Proposta + Pagamento
- Timeline visual do status
- Acoes: "Reenviar Email" | "Excluir Lead"

---

## Imagens Necessarias (prompts para API do usuario)

### 1. Logo
**Prompt:** "Minimalist fintech logo for 'Seu Cartao Internacional', clean modern design, blue and white color scheme, simple geometric icon suggesting a credit card or globe, flat design, vector style, white background, professional financial branding"

### 2. Hero — Foto de pessoa
**Prompt:** "Professional young Brazilian woman smiling confidently, holding a credit card, wearing smart casual business attire, clean white/light blue background, natural lighting, fintech advertising style, high quality portrait photo, warm and approachable expression"

### 3. Avatar Depoimento 1 (mulher)
**Prompt:** "Professional headshot portrait of a Brazilian woman in her 30s, friendly smile, neutral background, natural lighting, business casual, high quality photo"

### 4. Avatar Depoimento 2 (homem)
**Prompt:** "Professional headshot portrait of a Brazilian man in his 40s, confident smile, neutral background, natural lighting, business casual, high quality photo"

### 5. Avatar Depoimento 3 (mulher)
**Prompt:** "Professional headshot portrait of a young Brazilian woman in her 20s, warm smile, neutral background, natural lighting, casual professional, high quality photo"

---

## Proximos Passos

1. Gerar copy com /copywriting skill
2. Gerar imagens com API do usuario (prompts acima)
3. Criar plano de implementacao com /writing-plans
4. Implementar homepage
5. Redesign das 7 telas do fluxo
6. Redesign das 4 telas admin
