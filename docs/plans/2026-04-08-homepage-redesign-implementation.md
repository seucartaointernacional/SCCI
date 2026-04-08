# Homepage + Full Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a new marketing homepage and completely redesign all 12 screens (7 user flow + 4 admin + 1 new homepage) with a modern fintech visual identity that maximizes credibility and trust.

**Architecture:** The current form at `/` moves to `/solicitar`. The new homepage takes over `/`. All screens get a consistent design system: shared layout components (FlowHeader, FlowFooter, FlowProgress), updated color palette, and refined typography. Copy is generated via /copywriting skill before implementation. /frontend-design skill guides all visual implementation.

**Tech Stack:** Next.js 14 (App Router), Tailwind CSS, Framer Motion, React, TypeScript

**Design Doc:** `docs/plans/2026-04-08-homepage-redesign-design.md`

---

## Pre-Implementation: Generate Assets

Before any code, the user needs to generate images via their API. Prompts are in the design doc under "Imagens Necessarias". Required images:
- Logo (save as `public/images/logo.png`)
- Hero photo (save as `public/images/hero.png`)
- 3 avatar photos (save as `public/images/avatar-1.png`, `avatar-2.png`, `avatar-3.png`)

Placeholder images will be used until real ones are provided.

---

## Task 1: Generate Copy with /copywriting Skill

**Files:**
- Create: `docs/copy/homepage-copy.md`

**Step 1:** Invoke /copywriting skill to generate all homepage copy:
- Hero headline + subtitle
- "Como Funciona" section (3 steps titles + descriptions)
- "Beneficios" section (6 cards titles + descriptions)
- 3 fictional testimonials (name, city, quote)
- FAQ answers (6 questions)
- CTA final headline + subtitle
- Footer description
- All micro-copy (security badges, trust signals)

**Step 2:** Save generated copy to `docs/copy/homepage-copy.md`

**Step 3:** Commit
```bash
git add docs/copy/homepage-copy.md
git commit -m "docs: add homepage copy generated via copywriting skill"
```

---

## Task 2: Update Global Styles and Design System

**Files:**
- Modify: `src/app/globals.css`
- Modify: `tailwind.config.ts`
- Create: `public/images/` directory (placeholder images)

**Step 1:** Update `tailwind.config.ts` to add the design system colors:
```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A5F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
```

**Step 2:** Rewrite `src/app/globals.css` with the new design system utility classes:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl
      hover:bg-blue-700 transition-all duration-200 shadow-md
      hover:shadow-lg active:scale-[0.98];
  }
  .btn-secondary {
    @apply bg-white text-gray-700 font-semibold py-3 px-8 rounded-xl
      border border-gray-200 hover:bg-gray-50 transition-all duration-200;
  }
  .btn-success {
    @apply bg-green-600 text-white font-semibold py-3 px-8 rounded-xl
      hover:bg-green-700 transition-all duration-200 shadow-md
      hover:shadow-lg active:scale-[0.98];
  }
  .input-field {
    @apply w-full px-4 py-3 bg-white border border-gray-200 rounded-xl
      text-gray-900 placeholder-gray-400
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
      transition-all duration-200;
  }
  .card-container {
    @apply bg-white rounded-2xl shadow-sm border border-gray-100 p-8;
  }
  .section-title {
    @apply text-3xl md:text-4xl font-bold text-gray-900 text-center;
  }
  .section-subtitle {
    @apply text-lg text-gray-500 text-center mt-4 max-w-2xl mx-auto;
  }
}
```

**Step 3:** Create placeholder SVG images for development:
- `public/images/` directory with placeholder files

**Step 4:** Commit
```bash
git add tailwind.config.ts src/app/globals.css public/images/
git commit -m "feat: update design system with new color palette and utility classes"
```

---

## Task 3: Create Shared Layout Components

**Files:**
- Create: `src/components/FlowHeader.tsx`
- Create: `src/components/FlowFooter.tsx`
- Create: `src/components/FlowProgress.tsx`
- Create: `src/components/icons.tsx`

**Step 1:** Create `src/components/icons.tsx` — SVG icon components used across the app:
- ShieldCheckIcon, LockIcon, CheckCircleIcon, SearchIcon, ChartIcon, MapIcon, BankIcon, HandshakeIcon, DocumentIcon, CreditCardIcon, TruckIcon, GlobeIcon, ClockIcon, StarIcon, ChevronDownIcon, ArrowLeftIcon, MenuIcon, XIcon, LogOutIcon, UsersIcon, LayoutDashboardIcon, CalendarIcon, MailIcon, TrashIcon

**Step 2:** Create `src/components/FlowHeader.tsx`:
```tsx
"use client";
// Logo left + "Voltar ao inicio" link
// White bg, subtle bottom border
// Props: showBack?: boolean
```

**Step 3:** Create `src/components/FlowFooter.tsx`:
```tsx
// Mini footer: CNPJ 85.557.385/0001-45 + lock icon + "Ambiente seguro"
// Centered, gray-500 text, text-sm
```

**Step 4:** Create `src/components/FlowProgress.tsx`:
```tsx
"use client";
// Horizontal progress bar showing current step out of total
// Props: currentStep: number, totalSteps: number, labels: string[]
// Each step: circle with number/check + label below
// Active step: blue, completed: green check, future: gray
```

**Step 5:** Commit
```bash
git add src/components/FlowHeader.tsx src/components/FlowFooter.tsx src/components/FlowProgress.tsx src/components/icons.tsx
git commit -m "feat: add shared layout components (FlowHeader, FlowFooter, FlowProgress, icons)"
```

---

## Task 4: Build the Homepage (`/`)

**Files:**
- Rename: `src/app/page.tsx` → `src/app/solicitar/page.tsx`
- Create: `src/app/page.tsx` (new homepage)
- Create: `src/components/homepage/Navbar.tsx`
- Create: `src/components/homepage/HeroSection.tsx`
- Create: `src/components/homepage/StatsBar.tsx`
- Create: `src/components/homepage/HowItWorks.tsx`
- Create: `src/components/homepage/Benefits.tsx`
- Create: `src/components/homepage/Testimonials.tsx`
- Create: `src/components/homepage/CredibilityNumbers.tsx`
- Create: `src/components/homepage/FAQ.tsx`
- Create: `src/components/homepage/CTAFinal.tsx`
- Create: `src/components/homepage/Footer.tsx`

**Step 1:** Move current `src/app/page.tsx` to `src/app/solicitar/page.tsx`. Create `src/app/solicitar/` directory. The form page now lives at `/solicitar`.

**Step 2:** Use /frontend-design skill. Create each homepage section as its own component inside `src/components/homepage/`:

**Navbar.tsx** — Sticky header, white bg, shadow on scroll. Logo left, nav links center (smooth scroll), CTA button right "Solicitar Cartao". Mobile: hamburger menu.

**HeroSection.tsx** — 2 columns. Left: headline (from copy), subtitle, CTA button, shield+lock mini badge. Right: hero image. Below: 3 stat counters with CountUp animation.

**StatsBar.tsx** — 3 metrics inline: "+5.000 cartoes", "98% aprovacao", "Sem consulta SPC/Serasa". Blue-50 bg, icons.

**HowItWorks.tsx** — Section title, 3 cards with step number in blue circle, icon, title, description. Connected by subtle line/arrow between them.

**Benefits.tsx** — Gray-50 bg. Section title, 2x3 grid of cards with icon + title + description. Icons: globe, dollar, calendar, clock, truck, check-shield.

**Testimonials.tsx** — 3 cards: circular avatar, name, city, 5 stars, quote text. Subtle shadow.

**CredibilityNumbers.tsx** — Blue-800 bg, white text. 4 metrics: +5.000 cartoes, 98% aprovacao, 4.8 avaliacao, todos os estados.

**FAQ.tsx** — Accordion with ChevronDown animation. 6 questions/answers. Only one open at a time.

**CTAFinal.tsx** — Blue gradient bg. Headline, subtitle, large CTA button (white).

**Footer.tsx** — Gray-900 bg, white text. Logo, description with intermediary disclaimer, CNPJ, links, SSL/security icons, copyright.

**Step 3:** Create `src/app/page.tsx` that composes all homepage sections:
```tsx
import { Navbar } from "@/components/homepage/Navbar";
import { HeroSection } from "@/components/homepage/HeroSection";
// ... all sections
export default function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <StatsBar />
      <HowItWorks />
      <Benefits />
      <Testimonials />
      <CredibilityNumbers />
      <FAQ />
      <CTAFinal />
      <Footer />
    </>
  );
}
```

**Step 4:** Update `src/app/layout.tsx` — remove any homepage-specific layout (the homepage has its own Navbar/Footer, flow pages use FlowHeader/FlowFooter).

**Step 5:** Commit
```bash
git add src/app/page.tsx src/app/solicitar/ src/components/homepage/
git commit -m "feat: add marketing homepage with all sections, move form to /solicitar"
```

---

## Task 5: Redesign Form Page (`/solicitar`)

**Files:**
- Modify: `src/app/solicitar/page.tsx`
- Modify: `src/components/LeadForm.tsx`
- Modify: `src/components/ui/FormInput.tsx`

**Step 1:** Use /frontend-design skill. Update `src/app/solicitar/page.tsx`:
- Add FlowHeader (with back link to `/`)
- Add FlowProgress (step 1 of 5)
- Wrap form in card-container
- Add FlowFooter

**Step 2:** Redesign `src/components/LeadForm.tsx`:
- Group fields visually: "Dados Pessoais" (nome, cpf, email, telefone), "Endereco" (cep, cidade, estado), "Dados Financeiros" (renda, limite, negativado)
- Each group: subtle label heading (text-sm, font-medium, text-gray-500, uppercase tracking)
- 2-column grid on desktop for fields within groups
- Updated button: "Solicitar Proposta" with arrow icon
- Below button: lock icon + "Seus dados estao protegidos e nao serao compartilhados"

**Step 3:** Update `src/components/ui/FormInput.tsx` to use new input-field styling.

**Step 4:** Update any internal links that pointed to `/` for the form (check store.ts, API redirects).

**Step 5:** Commit
```bash
git add src/app/solicitar/ src/components/LeadForm.tsx src/components/ui/FormInput.tsx
git commit -m "feat: redesign form page at /solicitar with grouped fields and trust signals"
```

---

## Task 6: Redesign Analysis Page (`/analise`)

**Files:**
- Modify: `src/app/analise/page.tsx`
- Modify: `src/components/ProgressStep.tsx`

**Step 1:** Use /frontend-design skill. Rewrite `src/app/analise/page.tsx`:
- FlowHeader + FlowProgress (step 2 of 5)
- 5 steps with unique icons per step (SearchIcon, ChartIcon, MapIcon, BankIcon, HandshakeIcon)
- Each step: icon in circle (blue active, green complete, gray pending) + label
- Animated progress line connecting steps
- Bottom text: "Conectando voce as melhores ofertas de nossos bancos parceiros"
- FlowFooter

**Step 2:** Update `src/components/ProgressStep.tsx` to accept an `icon` prop and use the new icon set.

**Step 3:** Commit
```bash
git add src/app/analise/page.tsx src/components/ProgressStep.tsx
git commit -m "feat: redesign analysis page with unique step icons and trust messaging"
```

---

## Task 7: Redesign Proposal Page (`/proposta`)

**Files:**
- Modify: `src/app/proposta/page.tsx`
- Modify: `src/components/CreditCard.tsx`

**Step 1:** Use /frontend-design skill. Rewrite `src/app/proposta/page.tsx`:
- FlowHeader + FlowProgress (step 3 of 5)
- CreditCard 3D component centered (keep and refine)
- Proposal details in organized 2x2 grid below card
- "Proposta valida por 24h" badge with clock icon
- Two buttons: "Aceitar Proposta" (btn-success, green) | "Recusar" (btn-secondary, outline)
- Decline view: respectful tone, subtle icon
- FlowFooter

**Step 2:** Refine `src/components/CreditCard.tsx` — update gradients to use new brand colors, improve chip/logo rendering.

**Step 3:** Commit
```bash
git add src/app/proposta/page.tsx src/components/CreditCard.tsx
git commit -m "feat: redesign proposal page with validity badge and refined card component"
```

---

## Task 8: Redesign Processing Page (`/processando`)

**Files:**
- Modify: `src/app/processando/page.tsx`

**Step 1:** Use /frontend-design skill. Rewrite `src/app/processando/page.tsx`:
- FlowHeader + FlowProgress (step 3 of 5, same as proposal — sub-step)
- 3 steps with icons: BankIcon, DocumentIcon, CheckCircleIcon
- Text: "Estamos finalizando com o banco parceiro"
- Same visual pattern as /analise but with green progress bar
- FlowFooter

**Step 2:** Commit
```bash
git add src/app/processando/page.tsx
git commit -m "feat: redesign processing page with bank partner messaging"
```

---

## Task 9: Redesign Acceptance Page (`/aceita`)

**Files:**
- Modify: `src/app/aceita/page.tsx`

**Step 1:** Use /frontend-design skill. Rewrite `src/app/aceita/page.tsx`:
- FlowHeader + FlowProgress (step 4 of 5)
- Large animated green check (spring animation)
- "Proposta Efetivada!" heading
- Fee highlight box: R$ 36,40 — "Taxa unica de importacao e envio"
- 3 numbered steps explaining next process (present ID, photo, activation)
- CTA: "Pagar Taxa via PIX" (btn-primary)
- FlowFooter

**Step 2:** Commit
```bash
git add src/app/aceita/page.tsx
git commit -m "feat: redesign acceptance page with clear fee display and next steps"
```

---

## Task 10: Redesign Payment Page (`/pagamento`)

**Files:**
- Modify: `src/app/pagamento/page.tsx`

**Step 1:** Use /frontend-design skill. Rewrite `src/app/pagamento/page.tsx`:
- FlowHeader + FlowProgress (step 4 of 5)
- QR Code large and centered with white border and subtle shadow
- Amount box: R$ 36,40 with "Importacao + Frete" subtitle
- "Copiar codigo PIX" button with copy feedback
- Countdown timer (30 min) with clock icon — red when < 5 min
- Security badge: "Pagamento processado em ambiente seguro" with shield icon
- PIX receiver disclaimer
- Demo simulation button (kept for dev)
- FlowFooter

**Step 2:** Commit
```bash
git add src/app/pagamento/page.tsx
git commit -m "feat: redesign payment page with security badge and improved QR display"
```

---

## Task 11: Redesign Confirmation Page (`/confirmacao`)

**Files:**
- Modify: `src/app/confirmacao/page.tsx`

**Step 1:** Use /frontend-design skill. Rewrite `src/app/confirmacao/page.tsx`:
- FlowHeader + FlowProgress (step 5 of 5, all complete)
- Large green check with spring + rotation animation
- "Tudo certo! Seu cartao esta a caminho"
- Delivery estimate box (gray-50): calendar icon + "22 a 36 dias uteis" + date range
- Email confirmation box (blue-50): envelope icon + "Confirmacao enviada por e-mail"
- CTA: "Voltar ao Inicio" → links to `/` (new homepage)
- FlowFooter

**Step 2:** Commit
```bash
git add src/app/confirmacao/page.tsx
git commit -m "feat: redesign confirmation page with delivery estimate and email status"
```

---

## Task 12: Redesign Admin — Sidebar Layout + Login

**Files:**
- Modify: `src/app/admin/layout.tsx`
- Modify: `src/app/admin/login/page.tsx`

**Step 1:** Use /frontend-design skill. Rewrite `src/app/admin/layout.tsx`:
- Fixed sidebar left (w-64):
  - Logo at top (small)
  - Nav items: Dashboard (LayoutDashboardIcon), Leads (UsersIcon)
  - "Sair" button at bottom (LogOutIcon)
  - Active item: blue-50 bg + blue-600 text
- Main content area: bg-gray-50, p-8
- Mobile: sidebar collapses to hamburger

**Step 2:** Rewrite `src/app/admin/login/page.tsx`:
- Centered card on gray-50 background
- Logo at top of card
- "Painel Administrativo" subtitle
- Username + password fields (input-field class)
- "Entrar" button (btn-primary)
- Error display in red box

**Step 3:** Commit
```bash
git add src/app/admin/layout.tsx src/app/admin/login/page.tsx
git commit -m "feat: redesign admin layout with sidebar navigation and login page"
```

---

## Task 13: Redesign Admin Dashboard (`/admin`)

**Files:**
- Modify: `src/app/admin/page.tsx`

**Step 1:** Use /frontend-design skill. Rewrite `src/app/admin/page.tsx`:
- Greeting: "Bom dia, Admin" + current date (using pt-BR locale)
- 4 metric cards in grid (1 col mobile, 2 col tablet, 4 col desktop):
  - Total de Leads (blue icon/accent)
  - Propostas Aceitas (green icon/accent)
  - Pagamentos Confirmados (purple icon/accent)
  - Valor Arrecadado (amber icon/accent)
- Each card: icon, label, large number, subtle bg color
- Below: "Ultimos leads" table (5 most recent) with "Ver todos" link

**Step 2:** Commit
```bash
git add src/app/admin/page.tsx
git commit -m "feat: redesign admin dashboard with metric cards and recent leads"
```

---

## Task 14: Redesign Admin Leads List (`/admin/leads`)

**Files:**
- Modify: `src/app/admin/leads/page.tsx`

**Step 1:** Use /frontend-design skill. Rewrite `src/app/admin/leads/page.tsx`:
- Search bar with SearchIcon + text input
- Filter dropdown: status (Todos, Sem proposta, Proposta aceita, Pago, Pendente)
- Table in card-container:
  - Columns: Nome | CPF | Email | Status | Data
  - Status badges with colors (gray/blue/green/yellow)
  - Hover row highlight
  - Click → navigate to detail
- Pagination below table

**Step 2:** Commit
```bash
git add src/app/admin/leads/page.tsx
git commit -m "feat: redesign admin leads list with search, filters, and status badges"
```

---

## Task 15: Redesign Admin Lead Detail (`/admin/leads/[id]`)

**Files:**
- Modify: `src/app/admin/leads/[id]/page.tsx`

**Step 1:** Use /frontend-design skill. Rewrite `src/app/admin/leads/[id]/page.tsx`:
- Breadcrumb: Dashboard > Leads > [Nome do Lead]
- 2-column layout (desktop):
  - Left card: "Dados Pessoais" — all lead fields in organized grid
  - Right top card: "Proposta" — card info, limits, status
  - Right bottom card: "Pagamento" — valor, status, paidAt
- Status timeline (visual): Cadastro → Proposta → Pagamento (with dates)
- Action buttons: "Reenviar Email" (btn-primary) | "Excluir Lead" (btn-secondary, red text)

**Step 2:** Commit
```bash
git add src/app/admin/leads/[id]/page.tsx
git commit -m "feat: redesign admin lead detail with timeline and organized layout"
```

---

## Task 16: Update Root Layout and Fix All Links

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/lib/store.ts` (if any redirect references to `/`)

**Step 1:** Update `src/app/layout.tsx`:
- Keep Inter font import
- Remove any page-specific wrapper styling
- Clean metadata: title "Seu Cartao Internacional", description with brand copy

**Step 2:** Search all files for links/redirects to `/` that should now go to `/solicitar` (form page). Update:
- Any `router.push('/')` that meant "go to form" → `router.push('/solicitar')`
- The "Voltar ao Inicio" links should go to `/` (homepage, this is correct)
- CTA buttons on homepage link to `/solicitar`

**Step 3:** Verify the flow works end-to-end:
- Homepage `/` → CTA → `/solicitar` → submit → `/analise` → `/proposta` → accept → `/processando` → `/aceita` → `/pagamento` → `/confirmacao` → "Voltar ao Inicio" → `/`

**Step 4:** Commit
```bash
git add src/app/layout.tsx src/lib/store.ts
git commit -m "feat: update root layout and fix navigation links for new homepage"
```

---

## Task 17: Final QA and Polish

**Step 1:** Run `npm run build` to verify no TypeScript errors or build failures.

**Step 2:** Run `npm run dev` and manually verify all 12 screens render correctly.

**Step 3:** Check responsive design on mobile viewport (375px width).

**Step 4:** Fix any issues found.

**Step 5:** Final commit
```bash
git add -A
git commit -m "fix: polish and fix issues from QA pass"
```

---

## Execution Order & Dependencies

```
Task 1 (Copy) ──────────────────────────────────┐
Task 2 (Global Styles) ─────────────────────────┤
Task 3 (Shared Components) ─────────────────────┤
                                                 ├──→ Task 4 (Homepage)
                                                 │
Task 5 (Form /solicitar) ◄──────────────────────┘
Task 6 (Analise) ─── can run after Task 3
Task 7 (Proposta) ── can run after Task 3
Task 8 (Processando) ── can run after Task 3
Task 9 (Aceita) ──── can run after Task 3
Task 10 (Pagamento) ── can run after Task 3
Task 11 (Confirmacao) ── can run after Task 3
Task 12 (Admin Layout + Login) ── can run after Task 2
Task 13 (Admin Dashboard) ── after Task 12
Task 14 (Admin Leads) ── after Task 12
Task 15 (Admin Lead Detail) ── after Task 12
Task 16 (Links/Layout Fix) ── after ALL above
Task 17 (QA) ── after ALL above
```

**Parallelizable groups:**
- Group A (sequential): Task 1 → Task 4 (copy needed for homepage)
- Group B (parallel after Task 3): Tasks 5-11 (all flow pages, independent)
- Group C (sequential): Task 12 → Tasks 13-15 (admin, layout first)
- Group D (sequential, last): Task 16 → Task 17
