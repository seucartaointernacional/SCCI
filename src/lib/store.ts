import { create } from "zustand";

interface ProposalData {
  id: string;
  moeda: string;
  limiteEstrangeiro: number;
  limiteBrl: number;
  status: string;
  card: {
    id: string;
    nome: string;
    bandeira: string;
    corPrimaria: string;
    corSecundaria: string;
    corTexto: string;
  };
  lead: {
    nome: string;
    cpfCnpj: string;
    email: string;
  };
}

interface FlowState {
  leadId: string | null;
  proposalId: string | null;
  paymentId: string | null;
  proposalData: ProposalData | null;
  setLeadId: (id: string) => void;
  setProposalId: (id: string) => void;
  setPaymentId: (id: string) => void;
  setProposalData: (data: ProposalData) => void;
  reset: () => void;
}

export const useFlowStore = create<FlowState>((set) => ({
  leadId: null,
  proposalId: null,
  paymentId: null,
  proposalData: null,
  setLeadId: (id) => set({ leadId: id }),
  setProposalId: (id) => set({ proposalId: id }),
  setPaymentId: (id) => set({ paymentId: id }),
  setProposalData: (data) => set({ proposalData: data }),
  reset: () => set({ leadId: null, proposalId: null, paymentId: null, proposalData: null }),
}));
