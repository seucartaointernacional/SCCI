# KardBank Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a platform that connects users with international credit cards through a guided funnel: form → analysis animation → card proposal → payment → confirmation.

**Architecture:** Next.js 14 App Router monolith handling frontend pages, API routes, and admin panel. SQLite via Prisma for persistence. State machine flow managed client-side with React state, API calls for data persistence.

**Tech Stack:** Next.js 14, Prisma + SQLite, Tailwind CSS, Framer Motion, Resend, TypeScript

---

## Task 1: Project Setup

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `prisma/schema.prisma`, `.env.example`, `.gitignore`

**Step 1: Initialize Next.js project**

```bash
cd C:/Users/mateu/Desktop/KardBank
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

**Step 2: Install dependencies**

```bash
npm install prisma @prisma/client framer-motion resend
npm install -D @types/node
```

**Step 3: Initialize Prisma with SQLite**

```bash
npx prisma init --datasource-provider sqlite
```

**Step 4: Create .env.example**

```env
DATABASE_URL="file:./dev.db"
RESEND_API_KEY="re_your_key_here"
ADMIN_USER="admin"
ADMIN_PASSWORD="admin123"
```

**Step 5: Update .gitignore**

Add to `.gitignore`:
```
prisma/dev.db
prisma/dev.db-journal
.env
```

**Step 6: Commit**

```bash
git init
git add .
git commit -m "feat: initialize Next.js project with Prisma, Tailwind, Framer Motion"
```

---

## Task 2: Database Schema + Seed Data

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Modify: `package.json` (add seed script)

**Step 1: Write Prisma schema**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Card {
  id        String   @id @default(cuid())
  nome      String
  bandeira  String
  corFundo  String
  corTexto  String
  moedas    String   // JSON array: ["EUR","USD","THB"]
  createdAt DateTime @default(now())

  proposals Proposal[]
}

model Lead {
  id              String   @id @default(cuid())
  nome            String
  cpfCnpj         String   @unique
  email           String
  telefone        String
  cep             String
  cidade          String
  estado          String
  renda           Float
  limiteDesejado  Float
  negativado      Boolean
  createdAt       DateTime @default(now())

  proposals Proposal[]
}

model Proposal {
  id               String   @id @default(cuid())
  leadId           String
  cardId           String
  moeda            String
  limiteEstrangeiro Float
  limiteBrl        Float
  status           String   @default("pendente") // pendente, aceita, recusada
  createdAt        DateTime @default(now())

  lead    Lead    @relation(fields: [leadId], references: [id])
  card    Card    @relation(fields: [cardId], references: [id])
  payment Payment?
}

model Payment {
  id         String    @id @default(cuid())
  proposalId String    @unique
  valor      Float
  status     String    @default("aguardando") // aguardando, pago
  paidAt     DateTime?
  createdAt  DateTime  @default(now())

  proposal Proposal @relation(fields: [proposalId], references: [id])
}
```

**Step 2: Write seed file**

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const cards = [
  {
    nome: 'Global Platinum',
    bandeira: 'Visa',
    corFundo: '#1a1a2e',
    corTexto: '#e0e0e0',
    moedas: JSON.stringify(['EUR', 'USD']),
  },
  {
    nome: 'World Elite',
    bandeira: 'Mastercard',
    corFundo: '#16213e',
    corTexto: '#f0f0f0',
    moedas: JSON.stringify(['EUR', 'USD']),
  },
  {
    nome: 'Travel Plus',
    bandeira: 'Visa',
    corFundo: '#0f3460',
    corTexto: '#ffffff',
    moedas: JSON.stringify(['USD', 'THB']),
  },
  {
    nome: 'Premium Black',
    bandeira: 'Mastercard',
    corFundo: '#1b1b2f',
    corTexto: '#d4af37',
    moedas: JSON.stringify(['EUR', 'USD', 'THB']),
  },
  {
    nome: 'Explorer Gold',
    bandeira: 'Visa',
    corFundo: '#2c3e50',
    corTexto: '#f1c40f',
    moedas: JSON.stringify(['EUR', 'THB']),
  },
]

async function main() {
  for (const card of cards) {
    await prisma.card.upsert({
      where: { id: card.nome.toLowerCase().replace(/\s/g, '-') },
      update: card,
      create: { id: card.nome.toLowerCase().replace(/\s/g, '-'), ...card },
    })
  }
  console.log('Seed completed: 5 cards created')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
```

**Step 3: Add seed script to package.json**

Add to `package.json`:
```json
"prisma": {
  "seed": "npx tsx prisma/seed.ts"
}
```

**Step 4: Install tsx and run migration + seed**

```bash
npm install -D tsx
npx prisma migrate dev --name init
npx prisma db seed
```

**Step 5: Create Prisma client singleton**

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**Step 6: Commit**

```bash
git add .
git commit -m "feat: add database schema, seed data with 5 cards, Prisma client"
```

---

## Task 3: Shared Layout + Global Styles

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Create: `src/components/Logo.tsx`

**Step 1: Set up global styles in globals.css**

Keep Tailwind directives. Add finance-themed CSS variables:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #0066cc;
  --primary-dark: #004d99;
  --accent: #00a86b;
  --bg: #ffffff;
  --text: #1a1a1a;
  --text-muted: #6b7280;
  --border: #e5e7eb;
  --card-bg: #f9fafb;
}

body {
  background: var(--bg);
  color: var(--text);
}
```

**Step 2: Create Logo component**

```tsx
// src/components/Logo.tsx
export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-sm">K</span>
      </div>
      <span className="text-xl font-bold text-[var(--primary)]">KardBank</span>
    </div>
  )
}
```

**Step 3: Update layout.tsx**

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Logo } from '@/components/Logo'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KardBank - Seu Cartão Internacional',
  description: 'Solicite seu cartão de crédito internacional',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} min-h-screen`}>
        <header className="border-b border-[var(--border)] bg-white">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Logo />
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
```

**Step 4: Verify**

```bash
npm run dev
```
Open http://localhost:3000 — should see KardBank header with logo on white background.

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add layout, global styles, Logo component"
```

---

## Task 4: Lead Form (Tela 1)

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/components/LeadForm.tsx`
- Create: `src/lib/validators.ts`

**Step 1: Create CPF/CNPJ validator**

```typescript
// src/lib/validators.ts
export function formatCpfCnpj(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }
  return digits
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
}

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '')
  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2')
}

export function formatCurrency(value: string): string {
  const digits = value.replace(/\D/g, '')
  const number = parseInt(digits) / 100
  return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
```

**Step 2: Create LeadForm component**

```tsx
// src/components/LeadForm.tsx
'use client'

import { useState } from 'react'
import { formatCpfCnpj, formatPhone } from '@/lib/validators'

interface LeadFormData {
  nome: string
  cpfCnpj: string
  email: string
  telefone: string
  cep: string
  cidade: string
  estado: string
  renda: string
  limiteDesejado: string
  negativado: boolean
}

interface LeadFormProps {
  onSubmit: (data: LeadFormData) => void
  loading?: boolean
}

const ESTADOS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'
]

export function LeadForm({ onSubmit, loading }: LeadFormProps) {
  const [form, setForm] = useState<LeadFormData>({
    nome: '', cpfCnpj: '', email: '', telefone: '',
    cep: '', cidade: '', estado: '', renda: '',
    limiteDesejado: '', negativado: false,
  })

  const update = (field: keyof LeadFormData, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[var(--text)]">
          Solicite seu Cartão Internacional
        </h1>
        <p className="text-[var(--text-muted)] mt-2">
          Preencha seus dados para receber uma proposta personalizada
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Nome completo</label>
          <input
            required
            type="text"
            value={form.nome}
            onChange={e => update('nome', e.target.value)}
            className="w-full border border-[var(--border)] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            placeholder="Seu nome completo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">CPF ou CNPJ</label>
          <input
            required
            type="text"
            value={form.cpfCnpj}
            onChange={e => update('cpfCnpj', formatCpfCnpj(e.target.value))}
            maxLength={18}
            className="w-full border border-[var(--border)] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            placeholder="000.000.000-00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">E-mail</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={e => update('email', e.target.value)}
            className="w-full border border-[var(--border)] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Telefone</label>
          <input
            required
            type="text"
            value={form.telefone}
            onChange={e => update('telefone', formatPhone(e.target.value))}
            maxLength={15}
            className="w-full border border-[var(--border)] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            placeholder="(00) 00000-0000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">CEP</label>
          <input
            required
            type="text"
            value={form.cep}
            onChange={e => update('cep', e.target.value.replace(/\D/g, '').slice(0, 8))}
            maxLength={9}
            className="w-full border border-[var(--border)] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            placeholder="00000000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cidade</label>
          <input
            required
            type="text"
            value={form.cidade}
            onChange={e => update('cidade', e.target.value)}
            className="w-full border border-[var(--border)] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            placeholder="Sua cidade"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Estado</label>
          <select
            required
            value={form.estado}
            onChange={e => update('estado', e.target.value)}
            className="w-full border border-[var(--border)] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          >
            <option value="">Selecione</option>
            {ESTADOS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Renda mensal</label>
          <input
            required
            type="number"
            value={form.renda}
            onChange={e => update('renda', e.target.value)}
            className="w-full border border-[var(--border)] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            placeholder="R$ 0,00"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Limite desejado</label>
          <input
            required
            type="number"
            value={form.limiteDesejado}
            onChange={e => update('limiteDesejado', e.target.value)}
            className="w-full border border-[var(--border)] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            placeholder="R$ 0,00"
            min="0"
            step="0.01"
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.negativado}
              onChange={e => update('negativado', e.target.checked)}
              className="w-5 h-5 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
            />
            <span className="text-sm">Estou negativado(a)</span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-semibold py-4 rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? 'Processando...' : 'Solicitar Cartão'}
      </button>
    </form>
  )
}
```

**Step 3: Update page.tsx as the main funnel controller**

```tsx
// src/app/page.tsx
'use client'

import { useState } from 'react'
import { LeadForm } from '@/components/LeadForm'

type FunnelStep = 'form' | 'analysis' | 'proposal' | 'declined' | 'processing' | 'accepted' | 'payment' | 'confirmation'

interface ProposalData {
  leadId: string
  proposalId: string
  cardNome: string
  cardBandeira: string
  cardCorFundo: string
  cardCorTexto: string
  moeda: string
  limiteEstrangeiro: number
  limiteBrl: number
}

export default function Home() {
  const [step, setStep] = useState<FunnelStep>('form')
  const [proposal, setProposal] = useState<ProposalData | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFormSubmit = async (data: any) => {
    setLoading(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      setProposal(result.proposal)
      setStep('analysis')
    } catch (error) {
      alert('Erro ao processar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  // Each step component will be added in subsequent tasks
  return (
    <div>
      {step === 'form' && (
        <LeadForm onSubmit={handleFormSubmit} loading={loading} />
      )}
      {step === 'analysis' && <div>Tela 2: Analysis - TODO</div>}
      {step === 'proposal' && <div>Tela 3: Proposal - TODO</div>}
      {step === 'declined' && <div>Tela 3b: Declined - TODO</div>}
      {step === 'processing' && <div>Tela 4: Processing - TODO</div>}
      {step === 'accepted' && <div>Tela 5: Accepted - TODO</div>}
      {step === 'payment' && <div>Tela 6: Payment - TODO</div>}
      {step === 'confirmation' && <div>Tela 7: Confirmation - TODO</div>}
    </div>
  )
}
```

**Step 4: Verify** — `npm run dev`, open localhost:3000, form should render with all fields.

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add lead form with validation and funnel controller"
```

---

## Task 5: API Routes (Lead + Proposal)

**Files:**
- Create: `src/app/api/leads/route.ts`
- Create: `src/lib/proposal.ts`

**Step 1: Create proposal generation logic**

```typescript
// src/lib/proposal.ts
const EXCHANGE_RATES: Record<string, number> = {
  EUR: 0.18,  // 1 BRL = 0.18 EUR (approx)
  USD: 0.20,  // 1 BRL = 0.20 USD (approx)
  THB: 6.5,   // 1 BRL = 6.5 THB (approx)
}

export function generateLimiteBrl(): number {
  const min = 1100
  const max = 2400
  return Math.round((Math.random() * (max - min) + min) * 100) / 100
}

export function convertToForeign(brl: number, moeda: string): number {
  const rate = EXCHANGE_RATES[moeda] || 1
  return Math.round(brl * rate * 100) / 100
}

export function pickRandomMoeda(moedasJson: string): string {
  const moedas: string[] = JSON.parse(moedasJson)
  return moedas[Math.floor(Math.random() * moedas.length)]
}
```

**Step 2: Create leads API route**

```typescript
// src/app/api/leads/route.ts
import { prisma } from '@/lib/prisma'
import { generateLimiteBrl, convertToForeign, pickRandomMoeda } from '@/lib/proposal'

export async function POST(request: Request) {
  const body = await request.json()

  const cpfCnpj = body.cpfCnpj.replace(/\D/g, '')

  // Check if lead already exists
  const existingLead = await prisma.lead.findUnique({
    where: { cpfCnpj },
    include: {
      proposals: {
        include: { card: true },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  })

  if (existingLead && existingLead.proposals.length > 0) {
    const p = existingLead.proposals[0]
    return Response.json({
      leadId: existingLead.id,
      proposal: {
        leadId: existingLead.id,
        proposalId: p.id,
        cardNome: p.card.nome,
        cardBandeira: p.card.bandeira,
        cardCorFundo: p.card.corFundo,
        cardCorTexto: p.card.corTexto,
        moeda: p.moeda,
        limiteEstrangeiro: p.limiteEstrangeiro,
        limiteBrl: p.limiteBrl,
      },
    })
  }

  // Create lead
  const lead = existingLead || await prisma.lead.create({
    data: {
      nome: body.nome,
      cpfCnpj,
      email: body.email,
      telefone: body.telefone.replace(/\D/g, ''),
      cep: body.cep,
      cidade: body.cidade,
      estado: body.estado,
      renda: parseFloat(body.renda),
      limiteDesejado: parseFloat(body.limiteDesejado),
      negativado: body.negativado,
    },
  })

  // Pick random card
  const cards = await prisma.card.findMany()
  const card = cards[Math.floor(Math.random() * cards.length)]

  // Generate proposal
  const limiteBrl = generateLimiteBrl()
  const moeda = pickRandomMoeda(card.moedas)
  const limiteEstrangeiro = convertToForeign(limiteBrl, moeda)

  const proposal = await prisma.proposal.create({
    data: {
      leadId: lead.id,
      cardId: card.id,
      moeda,
      limiteEstrangeiro,
      limiteBrl,
    },
  })

  return Response.json({
    leadId: lead.id,
    proposal: {
      leadId: lead.id,
      proposalId: proposal.id,
      cardNome: card.nome,
      cardBandeira: card.bandeira,
      cardCorFundo: card.corFundo,
      cardCorTexto: card.corTexto,
      moeda,
      limiteEstrangeiro,
      limiteBrl,
    },
  })
}
```

**Step 3: Verify** — use browser or curl to POST to `/api/leads` with test data.

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add leads API route with proposal generation"
```

---

## Task 6: API Routes (Accept Proposal + Payment)

**Files:**
- Create: `src/app/api/proposals/[id]/accept/route.ts`
- Create: `src/app/api/payments/[id]/confirm/route.ts`

**Step 1: Accept proposal route**

```typescript
// src/app/api/proposals/[id]/accept/route.ts
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const proposal = await prisma.proposal.update({
    where: { id: params.id },
    data: { status: 'aceita' },
  })

  // Create payment record
  const payment = await prisma.payment.create({
    data: {
      proposalId: proposal.id,
      valor: 36.40,
    },
  })

  return Response.json({ proposal, payment })
}
```

**Step 2: Confirm payment route**

```typescript
// src/app/api/payments/[id]/confirm/route.ts
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const payment = await prisma.payment.update({
    where: { id: params.id },
    data: {
      status: 'pago',
      paidAt: new Date(),
    },
    include: {
      proposal: {
        include: {
          lead: true,
          card: true,
        },
      },
    },
  })

  // TODO: Send email via Resend (Task 11)

  return Response.json({ payment })
}
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add proposal accept and payment confirm API routes"
```

---

## Task 7: Card Visual Component

**Files:**
- Create: `src/components/CreditCard.tsx`

**Step 1: Create the card component**

```tsx
// src/components/CreditCard.tsx
'use client'

import { motion } from 'framer-motion'

interface CreditCardProps {
  nome: string
  bandeira: string
  corFundo: string
  corTexto: string
  moeda: string
  limite: number
  limiteBrl: number
}

const MOEDA_SYMBOLS: Record<string, string> = {
  EUR: '\u20AC',
  USD: '$',
  THB: '\u0E3F',
}

const MOEDA_NAMES: Record<string, string> = {
  EUR: 'Euro',
  USD: 'Dolar',
  THB: 'Baht Tailandes',
}

export function CreditCard({ nome, bandeira, corFundo, corTexto, moeda, limite, limiteBrl }: CreditCardProps) {
  const symbol = MOEDA_SYMBOLS[moeda] || moeda

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateY: -10 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md mx-auto"
    >
      <div
        className="relative w-full aspect-[1.586/1] rounded-2xl p-6 flex flex-col justify-between shadow-2xl"
        style={{ backgroundColor: corFundo, color: corTexto }}
      >
        {/* Top row */}
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs opacity-70 uppercase tracking-widest">{bandeira}</div>
            <div className="text-lg font-bold mt-1">{nome}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-lg font-bold">K</span>
          </div>
        </div>

        {/* Chip */}
        <div className="flex items-center gap-2">
          <div className="w-12 h-9 rounded-md bg-gradient-to-br from-yellow-300 to-yellow-600 opacity-80" />
        </div>

        {/* Bottom row */}
        <div className="flex justify-between items-end">
          <div>
            <div className="text-xs opacity-70">Limite disponivel</div>
            <div className="text-xl font-bold">
              {symbol} {limite.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs opacity-60 mt-1">
              (R$ {limiteBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
            </div>
          </div>
          <div className="text-xs opacity-70 uppercase">
            Internacional
          </div>
        </div>
      </div>
    </motion.div>
  )
}
```

**Step 2: Verify** — import in page.tsx temporarily with test props.

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add CreditCard visual component with animations"
```

---

## Task 8: Analysis Animation (Tela 2)

**Files:**
- Create: `src/components/AnalysisAnimation.tsx`

**Step 1: Create analysis animation component**

```tsx
// src/components/AnalysisAnimation.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STEPS = [
  { label: 'Verificando CPF...', duration: 2500 },
  { label: 'Analisando renda compativel...', duration: 3000 },
  { label: 'Buscando melhor localidade...', duration: 2500 },
  { label: 'Consultando bancos parceiros...', duration: 2000 },
  { label: 'Negociando melhores limites...', duration: 3000 },
]

interface AnalysisAnimationProps {
  onComplete: () => void
}

export function AnalysisAnimation({ onComplete }: AnalysisAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (currentStep >= STEPS.length) {
      onComplete()
      return
    }

    const stepDuration = STEPS[currentStep].duration
    const startProgress = (currentStep / STEPS.length) * 100
    const endProgress = ((currentStep + 1) / STEPS.length) * 100

    // Animate progress bar
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + (endProgress - startProgress) / (stepDuration / 50)
        return Math.min(next, endProgress)
      })
    }, 50)

    const timeout = setTimeout(() => {
      clearInterval(interval)
      setProgress(endProgress)
      setCurrentStep(prev => prev + 1)
    }, stepDuration)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [currentStep, onComplete])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Analisando sua solicitacao</h2>
        <p className="text-[var(--text-muted)] text-sm">Aguarde enquanto verificamos seus dados</p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md">
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[var(--primary)] rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <div className="text-right text-sm text-[var(--text-muted)] mt-1">
          {Math.round(progress)}%
        </div>
      </div>

      {/* Current step */}
      <AnimatePresence mode="wait">
        {currentStep < STEPS.length && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3"
          >
            <div className="w-5 h-5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
            <span className="text-[var(--text-muted)]">{STEPS[currentStep].label}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completed steps */}
      <div className="w-full max-w-md space-y-2">
        {STEPS.slice(0, currentStep).map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-sm text-green-600"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {step.label.replace('...', '')}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
```

**Step 2: Integrate into page.tsx** — replace the analysis TODO placeholder.

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add analysis animation with progress bar and steps"
```

---

## Task 9: Proposal Page (Tela 3 + 3b)

**Files:**
- Create: `src/components/ProposalView.tsx`
- Create: `src/components/DeclinedView.tsx`

**Step 1: Create ProposalView**

```tsx
// src/components/ProposalView.tsx
'use client'

import { motion } from 'framer-motion'
import { CreditCard } from './CreditCard'

interface ProposalViewProps {
  proposal: {
    cardNome: string
    cardBandeira: string
    cardCorFundo: string
    cardCorTexto: string
    moeda: string
    limiteEstrangeiro: number
    limiteBrl: number
  }
  onAccept: () => void
  onDecline: () => void
}

export function ProposalView({ proposal, onAccept, onDecline }: ProposalViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center space-y-8"
    >
      <div className="text-center">
        <h2 className="text-xl font-bold text-green-600">
          Conseguimos uma proposta para voce!
        </h2>
        <p className="text-[var(--text-muted)] mt-2">
          Confira os detalhes do seu cartao internacional
        </p>
      </div>

      <CreditCard
        nome={proposal.cardNome}
        bandeira={proposal.cardBandeira}
        corFundo={proposal.cardCorFundo}
        corTexto={proposal.cardCorTexto}
        moeda={proposal.moeda}
        limite={proposal.limiteEstrangeiro}
        limiteBrl={proposal.limiteBrl}
      />

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button
          onClick={onAccept}
          className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-semibold py-4 rounded-lg transition-colors"
        >
          Aceitar Proposta
        </button>
        <button
          onClick={onDecline}
          className="flex-1 border border-[var(--border)] text-[var(--text-muted)] font-semibold py-4 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Deixar para Proxima
        </button>
      </div>
    </motion.div>
  )
}
```

**Step 2: Create DeclinedView**

```tsx
// src/components/DeclinedView.tsx
'use client'

import { motion } from 'framer-motion'

interface DeclinedViewProps {
  onGoBack: () => void
  onFinish: () => void
}

export function DeclinedView({ onGoBack, onFinish }: DeclinedViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[400px] space-y-6"
    >
      <div className="text-center">
        <h2 className="text-xl font-bold">Nao temos mais propostas para voce neste momento</h2>
        <p className="text-[var(--text-muted)] mt-2">
          Deseja finalizar o atendimento ou voltar a proposta anterior?
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button
          onClick={onGoBack}
          className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-semibold py-4 rounded-lg transition-colors"
        >
          Voltar a Proposta
        </button>
        <button
          onClick={onFinish}
          className="flex-1 border border-[var(--border)] text-[var(--text-muted)] font-semibold py-4 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Finalizar Atendimento
        </button>
      </div>
    </motion.div>
  )
}
```

**Step 3: Integrate both into page.tsx**

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add proposal and declined views"
```

---

## Task 10: Processing Animation (Tela 4)

**Files:**
- Create: `src/components/ProcessingAnimation.tsx`

**Step 1: Create processing animation** (similar to AnalysisAnimation but with different steps)

```tsx
// src/components/ProcessingAnimation.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STEPS = [
  { label: 'Entrando em contato com o banco...', duration: 3000 },
  { label: 'Finalizando proposta...', duration: 3000 },
  { label: 'Gerando documentos...', duration: 2500 },
]

interface ProcessingAnimationProps {
  onComplete: () => void
}

export function ProcessingAnimation({ onComplete }: ProcessingAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (currentStep >= STEPS.length) {
      onComplete()
      return
    }

    const stepDuration = STEPS[currentStep].duration
    const startProgress = (currentStep / STEPS.length) * 100
    const endProgress = ((currentStep + 1) / STEPS.length) * 100

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + (endProgress - startProgress) / (stepDuration / 50)
        return Math.min(next, endProgress)
      })
    }, 50)

    const timeout = setTimeout(() => {
      clearInterval(interval)
      setProgress(endProgress)
      setCurrentStep(prev => prev + 1)
    }, stepDuration)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [currentStep, onComplete])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Processando sua proposta</h2>
        <p className="text-[var(--text-muted)] text-sm">Estamos finalizando tudo para voce</p>
      </div>

      <div className="w-full max-w-md">
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[var(--accent)] rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <div className="text-right text-sm text-[var(--text-muted)] mt-1">
          {Math.round(progress)}%
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentStep < STEPS.length && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3"
          >
            <div className="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
            <span className="text-[var(--text-muted)]">{STEPS[currentStep].label}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-md space-y-2">
        {STEPS.slice(0, currentStep).map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-sm text-green-600"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {step.label.replace('...', '')}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
```

**Step 2: Integrate into page.tsx**

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add processing animation for proposal acceptance"
```

---

## Task 11: Accepted + Fee Page (Tela 5)

**Files:**
- Create: `src/components/AcceptedView.tsx`

**Step 1: Create AcceptedView**

```tsx
// src/components/AcceptedView.tsx
'use client'

import { motion } from 'framer-motion'

interface AcceptedViewProps {
  onPay: () => void
}

export function AcceptedView({ onPay }: AcceptedViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center space-y-8"
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-green-600">Proposta Aceita e Efetivada!</h2>
        <p className="text-[var(--text-muted)] mt-2">
          Agora voce precisa pagar a taxa de importacao e envio do cartao.
        </p>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6 w-full max-w-md">
        <div className="text-center mb-4">
          <span className="text-3xl font-bold text-[var(--text)]">R$ 36,40</span>
          <p className="text-sm text-[var(--text-muted)] mt-1">Taxa de importacao + frete internacional</p>
        </div>

        <div className="space-y-3 text-sm text-[var(--text-muted)] border-t border-[var(--border)] pt-4">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5 text-[var(--primary)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Ao receber o cartao fisico, sera necessario apresentar um documento de identidade.</span>
          </div>
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5 text-[var(--primary)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Para ativar o cartao, voce precisara tirar uma foto do rosto junto com o documento.</span>
          </div>
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5 text-[var(--primary)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Apos a ativacao, seu cartao de credito estara liberado para uso imediato.</span>
          </div>
        </div>
      </div>

      <button
        onClick={onPay}
        className="w-full max-w-md bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-semibold py-4 rounded-lg transition-colors"
      >
        OK, Pagar Taxa
      </button>
    </motion.div>
  )
}
```

**Step 2: Integrate into page.tsx**

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add accepted view with fee details and disclaimers"
```

---

## Task 12: PIX Payment Page (Tela 6)

**Files:**
- Create: `src/components/PixPayment.tsx`

**Step 1: Create PIX payment component (simulated)**

```tsx
// src/components/PixPayment.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface PixPaymentProps {
  paymentId: string
  onConfirmed: () => void
}

export function PixPayment({ paymentId, onConfirmed }: PixPaymentProps) {
  const [confirming, setConfirming] = useState(false)

  const handleSimulatePayment = async () => {
    setConfirming(true)
    try {
      await fetch(`/api/payments/${paymentId}/confirm`, { method: 'POST' })
      setTimeout(onConfirmed, 1500) // small delay for UX
    } catch {
      alert('Erro ao confirmar pagamento.')
      setConfirming(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center space-y-8"
    >
      <div className="text-center">
        <h2 className="text-xl font-bold">Pagamento via PIX</h2>
        <p className="text-[var(--text-muted)] mt-2">
          Taxa de importacao + frete internacional
        </p>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-8 w-full max-w-md text-center">
        {/* Simulated QR Code */}
        <div className="w-48 h-48 mx-auto bg-gray-200 rounded-lg flex items-center justify-center mb-4 border-2 border-dashed border-gray-300">
          <div className="text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <span className="text-sm text-gray-400">QR Code PIX</span>
          </div>
        </div>

        <div className="text-3xl font-bold mb-2">R$ 36,40</div>

        <p className="text-xs text-[var(--text-muted)] mt-4 mb-6">
          O nome do recebedor pode variar para o nome do corretor responsavel pela proposta ou da empresa.
        </p>

        {/* Simulate payment button (will be replaced with real PIX) */}
        <button
          onClick={handleSimulatePayment}
          disabled={confirming}
          className="w-full bg-[var(--accent)] hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          {confirming ? 'Confirmando pagamento...' : 'Simular Pagamento PIX'}
        </button>
      </div>
    </motion.div>
  )
}
```

**Step 2: Integrate into page.tsx**

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add PIX payment page with simulated QR code"
```

---

## Task 13: Confirmation Page (Tela 7)

**Files:**
- Create: `src/components/ConfirmationView.tsx`

**Step 1: Create confirmation component**

```tsx
// src/components/ConfirmationView.tsx
'use client'

import { motion } from 'framer-motion'

export function ConfirmationView() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[400px] space-y-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center"
      >
        <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-600">Tudo certo!</h2>
        <p className="text-[var(--text-muted)] mt-2 max-w-md">
          O processo de importacao e envio do seu cartao ja foi iniciado.
        </p>
      </div>

      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6 w-full max-w-md space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <span className="font-medium">Prazo de entrega</span>
            <p className="text-sm text-[var(--text-muted)]">22 a 36 dias uteis</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <span className="font-medium">Confirmacao por e-mail</span>
            <p className="text-sm text-[var(--text-muted)]">Enviamos os detalhes para seu e-mail cadastrado</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
```

**Step 2: Integrate into page.tsx**

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add confirmation page with delivery info"
```

---

## Task 14: Wire Up Complete Funnel in page.tsx

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Update page.tsx to connect all components with proper state transitions**

Import all components and wire up the step transitions:
- `form` → submit → API call → `analysis`
- `analysis` → animation complete → `proposal`
- `proposal` → accept → API call accept → `processing` / decline → `declined`
- `declined` → go back → `proposal` / finish → `form`
- `processing` → animation complete → `accepted`
- `accepted` → pay → `payment`
- `payment` → confirmed → `confirmation`

Track `paymentId` in state (returned from accept API call).

**Step 2: Verify full flow manually**

**Step 3: Commit**

```bash
git add .
git commit -m "feat: wire up complete user funnel with all step transitions"
```

---

## Task 15: Email Integration (Resend)

**Files:**
- Create: `src/lib/email.ts`
- Modify: `src/app/api/payments/[id]/confirm/route.ts`

**Step 1: Create email utility**

```typescript
// src/lib/email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendConfirmationParams {
  to: string
  nome: string
  cardNome: string
  cardBandeira: string
  limiteBrl: number
  moeda: string
  limiteEstrangeiro: number
}

export async function sendConfirmationEmail(params: SendConfirmationParams) {
  const deliveryMin = new Date()
  deliveryMin.setDate(deliveryMin.getDate() + 22)
  const deliveryMax = new Date()
  deliveryMax.setDate(deliveryMax.getDate() + 36)

  const formatDate = (d: Date) => d.toLocaleDateString('pt-BR')

  await resend.emails.send({
    from: 'KardBank <noreply@kardbank.com>',
    to: params.to,
    subject: 'Seu cartao internacional foi aprovado!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #0066cc;">KardBank</h1>
        <h2>Parabens, ${params.nome}!</h2>
        <p>Sua proposta de cartao internacional foi aceita e o pagamento confirmado.</p>

        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3>Detalhes do Cartao</h3>
          <p><strong>Cartao:</strong> ${params.cardNome} (${params.cardBandeira})</p>
          <p><strong>Limite:</strong> ${params.moeda} ${params.limiteEstrangeiro.toFixed(2)} (R$ ${params.limiteBrl.toFixed(2)})</p>
        </div>

        <div style="background: #f0f9ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3>Previsao de Entrega</h3>
          <p>Entre <strong>${formatDate(deliveryMin)}</strong> e <strong>${formatDate(deliveryMax)}</strong></p>
        </div>

        <p style="color: #6b7280; font-size: 14px;">
          Ao receber o cartao, apresente seu documento de identidade.
          Para ativar, tire uma foto do rosto com o documento.
        </p>
      </div>
    `,
  })
}
```

**Step 2: Integrate into payment confirm route** — call `sendConfirmationEmail` after updating payment status.

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add email confirmation via Resend"
```

---

## Task 16: Admin Authentication

**Files:**
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/api/admin/auth/route.ts`
- Create: `src/components/admin/AdminLogin.tsx`

**Step 1: Create admin auth API route**

Simple comparison against env vars `ADMIN_USER` and `ADMIN_PASSWORD`. Return a session cookie or simple token.

**Step 2: Create AdminLogin component** — form with user/password fields.

**Step 3: Create admin layout** — checks auth, shows login if not authenticated.

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add admin authentication with env-based credentials"
```

---

## Task 17: Admin Dashboard

**Files:**
- Create: `src/app/admin/page.tsx`
- Create: `src/app/api/admin/stats/route.ts`

**Step 1: Create stats API route**

Query Prisma for:
- Total leads count
- Proposals with status 'aceita' count
- Payments with status 'pago' count
- Sum of paid payment values

**Step 2: Create dashboard page** — 4 stat cards at top (total leads, propostas aceitas, pagamentos, valor total).

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add admin dashboard with stats"
```

---

## Task 18: Admin Leads List

**Files:**
- Create: `src/app/admin/leads/page.tsx`
- Create: `src/app/api/admin/leads/route.ts`

**Step 1: Create leads API route** — return all leads with proposals and payments, support filters (status) and search (nome, cpfCnpj).

**Step 2: Create leads list page** — table with filters, search bar, pagination.

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add admin leads list with filters and search"
```

---

## Task 19: Admin Lead Detail

**Files:**
- Create: `src/app/admin/leads/[id]/page.tsx`
- Create: `src/app/api/admin/leads/[id]/route.ts`
- Create: `src/app/api/admin/leads/[id]/resend-email/route.ts`

**Step 1: Create lead detail API route** — return full lead with proposal, card, payment data.

**Step 2: Create lead detail page** — show all info, proposal details, payment status, resend email button.

**Step 3: Create resend email route** — re-trigger the confirmation email.

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add admin lead detail with resend email"
```

---

## Task 20: Final Integration + Polish

**Files:**
- Various existing files

**Step 1: Test full flow end to end** — form → analysis → proposal → accept → processing → accepted → payment → confirmation

**Step 2: Test return visitor** — same CPF should get same proposal

**Step 3: Test decline flow** — decline → message → go back / finish

**Step 4: Test admin panel** — login, dashboard stats, leads list, lead detail

**Step 5: Fix any issues found**

**Step 6: Final commit**

```bash
git add .
git commit -m "feat: final integration and polish"
```
