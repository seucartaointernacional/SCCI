import { Resend } from "resend";

let resendClient: Resend | null = null;
function getResend(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

export interface ConfirmationEmailData {
  nome: string;
  cardName: string;
  cardBandeira: string;
  limiteBrl: number;
  moeda: string;
  limiteEstrangeiro: number;
}

export function buildConfirmationEmailHtml(data: ConfirmationEmailData): string {
  const formatBrl = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formatForeign = (value: number, moeda: string) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: moeda });

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmação - Seu Cartão Internacional</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background-color:#2563eb;padding:28px 32px;text-align:center;">
              <h1 style="margin:0;font-size:22px;color:#ffffff;font-weight:700;letter-spacing:0.5px;">
                Seu Cartão Internacional
              </h1>
            </td>
          </tr>

          <!-- Green checkmark -->
          <tr>
            <td style="padding:32px 32px 0;text-align:center;">
              <div style="width:64px;height:64px;border-radius:50%;background-color:#22c55e;display:inline-block;line-height:64px;text-align:center;">
                <span style="font-size:32px;color:#ffffff;">&#10003;</span>
              </div>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:24px 32px 0;text-align:center;">
              <h2 style="margin:0;font-size:24px;color:#18181b;font-weight:700;">
                Tudo certo, ${data.nome}!
              </h2>
            </td>
          </tr>

          <!-- Subtitle -->
          <tr>
            <td style="padding:12px 32px 0;text-align:center;">
              <p style="margin:0;font-size:16px;color:#52525b;line-height:1.6;">
                Seu cartão internacional foi aprovado e o processo de importação já foi iniciado.
              </p>
            </td>
          </tr>

          <!-- Card details box -->
          <tr>
            <td style="padding:28px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4ff;border-radius:8px;border:1px solid #dbeafe;">
                <tr>
                  <td style="padding:20px 24px;">
                    <h3 style="margin:0 0 16px;font-size:14px;color:#2563eb;text-transform:uppercase;letter-spacing:1px;font-weight:700;">
                      Detalhes do cartão
                    </h3>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;font-size:14px;color:#71717a;width:40%;">Cartão</td>
                        <td style="padding:6px 0;font-size:14px;color:#18181b;font-weight:600;">${data.cardName}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:14px;color:#71717a;width:40%;">Limite</td>
                        <td style="padding:6px 0;font-size:14px;color:#18181b;font-weight:600;">
                          ${formatForeign(data.limiteEstrangeiro, data.moeda)} (${formatBrl(data.limiteBrl)})
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:14px;color:#71717a;width:40%;">Bandeira</td>
                        <td style="padding:6px 0;font-size:14px;color:#18181b;font-weight:600;">${data.cardBandeira}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Delivery estimate box -->
          <tr>
            <td style="padding:16px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;">
                <tr>
                  <td style="padding:20px 24px;text-align:center;">
                    <p style="margin:0 0 4px;font-size:13px;color:#16a34a;text-transform:uppercase;letter-spacing:1px;font-weight:700;">
                      Prazo estimado de entrega
                    </p>
                    <p style="margin:0;font-size:22px;color:#15803d;font-weight:700;">
                      22 a 36 dias úteis
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Document reminder -->
          <tr>
            <td style="padding:24px 32px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fffbeb;border-radius:8px;border:1px solid #fde68a;">
                <tr>
                  <td style="padding:16px 24px;">
                    <p style="margin:0;font-size:14px;color:#92400e;line-height:1.6;">
                      <strong>Lembrete:</strong> Para ativar seu cartão, será necessário apresentar um documento com foto. Tenha em mãos seu RG ou CNH no momento da ativação.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:32px 32px;text-align:center;border-top:1px solid #e4e4e7;margin-top:32px;">
              <p style="margin:0;font-size:12px;color:#a1a1aa;">
                &copy; 2026 Seu Cartão Internacional
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
}

export async function sendConfirmationEmail(
  to: string,
  data: ConfirmationEmailData
): Promise<{ success: boolean; error?: string }> {
  try {
    const html = buildConfirmationEmailHtml(data);

    const { error } = await getResend().emails.send({
      from: "Seu Cartão Internacional <noreply@seucartaointernacional.com>",
      to,
      subject: "Seu cartão internacional foi aprovado!",
      html,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido ao enviar e-mail";
    return { success: false, error: message };
  }
}
