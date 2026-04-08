# KardBank — Design Document

## Overview

Plataforma que conecta pessoas com cartões de crédito internacionais. O usuário preenche um formulário, recebe uma proposta de cartão com limite aleatório, aceita, paga uma taxa de importação via PIX e recebe confirmação por e-mail.

## Stack

- **Framework:** Next.js 14 (App Router) — monolito (frontend + API + admin)
- **Banco:** SQLite + Prisma ORM (migrável para PostgreSQL)
- **Animações:** Framer Motion
- **Estilo:** Tailwind CSS + frontend-design skill (clean, fundo branco, cores de finanças)
- **E-mail:** Resend
- **PIX:** Simulado (pronto para API real)
- **Cartões visuais:** 5 cartões genéricos via CSS/SVG

## Fluxo do Usuário (7 telas)

### Tela 1 — Formulário de Cadastro
- Campos: Nome completo, CPF/CNPJ, E-mail, Telefone, Endereço (CEP, cidade, estado), Renda mensal, Limite desejado, Negativado (sim/não)
- Botão "Solicitar Cartão"

### Tela 2 — Análise (animação ~12-15s)
Barra de progresso com etapas sequenciais:
1. "Verificando CPF..."
2. "Analisando renda compatível..."
3. "Buscando melhor localidade..."
4. "Consultando bancos parceiros..."
5. "Negociando melhores limites..."

### Tela 3 — Proposta do Cartão
- Imagem de cartão internacional (aleatório entre 5 opções)
- Limite em moeda estrangeira (EUR, USD ou THB) com BRL entre parênteses
- Limite BRL: aleatório entre R$1.100 e R$2.400
- Mesmo CPF/CNPJ = mesma proposta sempre
- Botões: "Aceitar Proposta" / "Deixar para Próxima"

### Tela 3b — Recusa
- "Não temos mais propostas para você neste momento."
- Botões: "Finalizar Atendimento" (volta tela 1) / "Voltar à Proposta Anterior" (volta tela 3)

### Tela 4 — Processamento (animação)
Etapas:
1. "Entrando em contato com o banco..."
2. "Finalizando proposta..."
3. "Gerando documentos..."

### Tela 5 — Proposta Aceita + Taxa
- Proposta efetivada, pagar taxa de importação e envio: R$ 36,40
- Disclaimers:
  - Apresentar documento ao receber cartão físico
  - Foto do rosto com documento para ativação
  - Após ativação, cartão liberado para uso
- Botão "OK, Pagar Taxa"

### Tela 6 — Pagamento PIX
- QR Code (simulado, API futura)
- Valor: R$ 36,40 (importação + frete)
- Disclaimer: nome do recebedor pode variar
- Pagamento confirmado → avança automaticamente

### Tela 7 — Confirmação Final
- "Tudo certo! Processo de importação e envio iniciado."
- Prazo: 22 a 36 dias úteis
- Confirmação enviada por e-mail (Resend) com: dados do cartão, nome da pessoa, data estimada

## Modelo de Dados

### leads
- id, nome, cpf_cnpj (unique), email, telefone, endereco (cep, cidade, estado), renda, limite_desejado, negativado, created_at

### proposals
- id, lead_id (FK), card_id (FK), moeda, limite_estrangeiro, limite_brl, status (pendente/aceita/recusada), created_at

### payments
- id, proposal_id (FK), valor, status (aguardando/pago), paid_at, created_at

### cards
- id, nome, bandeira, imagem_config (dados para renderizar SVG/CSS), moedas (array)

## Regras de Negócio

- CPF/CNPJ único: se já existe, retorna proposta existente (mesmo cartão, mesmo limite)
- Cartão e limite sorteados apenas na primeira consulta
- Pagamento confirmado → atualiza status + dispara e-mail via Resend
- Limite BRL aleatório entre R$1.100 e R$2.400
- Conversão para moeda estrangeira com taxa fixa (simulada)

## Painel Admin (/admin)

Protegido por login/senha (variável de ambiente).

### Dashboard
- Total de leads, propostas aceitas, pagamentos, valor arrecadado

### Listagem de Leads
- Tabela: nome, CPF/CNPJ, email, telefone, renda, data
- Filtro por status (todos / proposta aceita / pagamento feito)
- Busca por nome ou CPF

### Detalhe do Lead
- Dados completos + proposta + status pagamento
- Botão reenviar e-mail de confirmação
