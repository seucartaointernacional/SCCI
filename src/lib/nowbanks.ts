const DEFAULT_BASE_URL = "https://api.nowbanks.com.br";

export class NowBanksError extends Error {
  constructor(
    public readonly status: number,
    public readonly detail: string,
    public readonly endpoint: string
  ) {
    super(`NowBanks ${endpoint} returned ${status}: ${detail}`);
    this.name = "NowBanksError";
  }
}

export interface CreateDepositParams {
  amount: number;
  externalId: string;
  payer?: {
    name: string;
    document: string;
  };
  callbackUrl?: string;
}

export interface CreateDepositResult {
  transactionId: string;
  status: string;
  pixCopyPaste: string;
  pixQrCode: string;
  amount: number;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface DepositResponse {
  transaction_id: string;
  status: string;
  pix_copy_paste: string;
  pix_qr_code: string;
  amount: number;
}

function getBaseUrl(): string {
  return process.env.NOWBANKS_BASE_URL || DEFAULT_BASE_URL;
}

function getCredentials(): { clientId: string; clientSecret: string } {
  const clientId = process.env.NOWBANKS_CLIENT_ID;
  const clientSecret = process.env.NOWBANKS_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new NowBanksError(
      500,
      "NOWBANKS_CLIENT_ID or NOWBANKS_CLIENT_SECRET env var is missing",
      "config"
    );
  }
  return { clientId, clientSecret };
}
