import { Resend } from "resend";

export async function sendEmail(to: string, userName: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: "Tudo bem? <alerta@apptudobem.com.br>",
    to,
    subject: `Alerta de segurança - ${userName}`,
    html: `
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:24px; font-family: Arial, Helvetica, sans-serif;">
  <tr>
    <td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background-color:#ffffff; border-radius:8px; overflow:hidden;">
        
        <!-- Header -->
        <tr>
          <td style="background-color:#000; color:#ffffff; padding:20px 24px;">
            <h1 style="margin:0; font-size:22px;">Tudo bem?</h1>
            <p style="margin:4px 0 0; font-size:14px; opacity:0.8;">
              Alerta de segurança
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:24px; color:#111827; font-size:16px; line-height:1.6;">
            <p>Olá,</p>

            <p>
              Você foi cadastrado como contato de emergência de
              <strong>${userName}</strong>.
            </p>

            <p style="background-color:#fef3c7; border-left:4px solid #f59e0b; padding:12px 16px; border-radius:4px;">
              Não recebemos uma confirmação de vida há mais de
              <strong>48 horas</strong>.
            </p>

            <p>
              Por favor, tente contato com <strong>${userName}</strong>
              o quanto antes para verificar se está tudo bem.
            </p>

            <p style="margin-top:24px;">
              Atenciosamente,<br/>
              <strong>Equipe Tudo bem?</strong>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color:#f4f6f8; padding:16px 24px; font-size:12px; color:#6b7280;">
            <p style="margin:0;">
              Esta é uma mensagem automática enviada pelo app Tudo bem?.
              Não responda este email.
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
    `,
  });
}
