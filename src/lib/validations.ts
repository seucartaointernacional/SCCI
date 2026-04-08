import { z } from "zod";

export const leadFormSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  cpfCnpj: z.string().min(11, "CPF/CNPJ inválido"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  cep: z.string().min(8, "CEP inválido"),
  cidade: z.string().min(2, "Cidade obrigatória"),
  estado: z.string().length(2, "Estado deve ter 2 letras"),
  renda: z.number().positive("Renda deve ser maior que zero"),
  limiteDesejado: z.number().positive("Limite deve ser maior que zero"),
  negativado: z.boolean(),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;
