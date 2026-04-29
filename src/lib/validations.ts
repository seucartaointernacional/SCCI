import { z } from "zod";

export const FAIXAS_RENDA = [
  { value: "ate-1500", label: "Até R$ 1.500", media: 1500 },
  { value: "1500-3000", label: "R$ 1.500 a R$ 3.000", media: 2250 },
  { value: "3000-5000", label: "R$ 3.000 a R$ 5.000", media: 4000 },
  { value: "5000-10000", label: "R$ 5.000 a R$ 10.000", media: 7500 },
  { value: "acima-10000", label: "Acima de R$ 10.000", media: 12000 },
] as const;

export const LIMITE_DESEJADO_MAX = 10000;

export const leadFormSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  cpfCnpj: z.string().min(11, "CPF/CNPJ inválido"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  cep: z.string().min(8, "CEP inválido"),
  rua: z.string().min(2, "Rua/Avenida obrigatória"),
  numero: z.string().min(1, "Número obrigatório"),
  complemento: z.string().optional().or(z.literal("")),
  bairro: z.string().min(2, "Bairro obrigatório"),
  cidade: z.string().min(2, "Cidade obrigatória"),
  estado: z.string().length(2, "Estado deve ter 2 letras"),
  renda: z.number().positive("Renda deve ser maior que zero"),
  limiteDesejado: z
    .number()
    .positive("Limite deve ser maior que zero")
    .max(LIMITE_DESEJADO_MAX, `Limite máximo de R$ ${LIMITE_DESEJADO_MAX.toLocaleString("pt-BR")}`),
  negativado: z.boolean(),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;
