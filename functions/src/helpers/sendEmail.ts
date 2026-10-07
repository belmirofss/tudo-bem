import { Resend } from "resend";
import { CHECKIN_WINDOW_HOURS } from "../constants";

const EMAIL_FROM = "Tudo bem? <alerta@apptudobem.com.br>";

// Mirrors the app's "Anel" palette (constants.ts in the app).
const C = {
  background: "#F4F6F5",
  surface: "#FFFFFF",
  border: "#DCE5E2",
  divider: "#E8EEEC",
  primary: "#0F6B5C",
  primaryTint: "#E3F0EC",
  text: "#12201C",
  secondary: "#3E4D48",
  muted: "#5E6D68",
  onTint: "#23413A",
} as const;

const TONES = {
  warning: {
    accent: "#E9B44C",
    tint: "#FDF5E4",
    text: "#8A5A00",
  },
  danger: {
    accent: "#B4362A",
    tint: "#FBEDEB",
    text: "#B4362A",
  },
} as const;

const FONT =
  "Manrope, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const EMERGENCY_NUMBERS = [
  { number: "192", label: "SAMU" },
  { number: "190", label: "Polícia" },
  { number: "188", label: "CVV" },
];

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const firstName = (name: string) => name.trim().split(/\s+/)[0];

// e.g. "segunda-feira, 5 de outubro às 21:14"
export const formatEmailDate = (date: Date) => {
  const day = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
  const time = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
  return `${day} às ${time}`;
};

type AlertLayout = {
  tone: keyof typeof TONES;
  preheader: string;
  ringLabel: string;
  overline: string;
  title: string;
  intro: string;
  details: { label: string; value: string }[];
  steps: string[];
  note?: string;
  userName: string;
};

const renderAlertEmail = (layout: AlertLayout) => {
  const tone = TONES[layout.tone];

  const details = layout.details
    .map(
      ({ label, value }, index) => `
        <tr>
          <td style="padding:${index === 0 ? "0" : "12px"} 0 0;">
            <div style="font-size:13px; line-height:18px; font-weight:700; color:${C.muted};">${label}</div>
            <div style="font-size:16px; line-height:22px; font-weight:700; color:${C.text};">${value}</div>
          </td>
        </tr>`,
    )
    .join("");

  const steps = layout.steps
    .map(
      (step, index) => `
        <tr>
          <td width="28" valign="top" style="padding:0 12px 14px 0;">
            <div style="width:28px; height:28px; border-radius:14px; background-color:${C.primaryTint}; color:${C.primary}; font-size:14px; line-height:28px; font-weight:800; text-align:center;">${index + 1}</div>
          </td>
          <td valign="top" style="padding:3px 0 14px; font-size:16px; line-height:23px; color:${C.secondary};">${step}</td>
        </tr>`,
    )
    .join("");

  const numbers = EMERGENCY_NUMBERS.map(
    ({ number, label }, index) => `${index > 0 ? `
          <td width="8" style="font-size:0; line-height:0;">&nbsp;</td>` : ""}
          <td width="33%">
            <a href="tel:${number}" style="display:block; text-decoration:none; border:1.5px solid ${C.border}; border-radius:16px; padding:12px 4px; text-align:center;">
              <span style="display:block; font-size:22px; line-height:28px; font-weight:800; color:${C.text};">${number}</span>
              <span style="display:block; font-size:13px; line-height:18px; font-weight:700; color:${C.muted};">${label}</span>
            </a>
          </td>`,
  ).join("");

  const note = layout.note ?
    `<p style="margin:20px 0 0; font-size:14px; line-height:20px; color:${C.muted};">${layout.note}</p>` :
    "";

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light only">
  <title>${layout.overline} - ${layout.userName}</title>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&display=swap" rel="stylesheet">
  <style>
    :root { color-scheme: light only; }
    body { margin:0; padding:0; }
    a[x-apple-data-detectors] { color:inherit !important; text-decoration:none !important; }
    @media (max-width: 520px) {
      .outer { padding:20px 12px !important; }
      .card { padding:28px 20px !important; border-radius:20px !important; }
      .title { font-size:24px !important; line-height:30px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:${C.background};">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all;">${layout.preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${C.background}; font-family:${FONT};">
    <tr>
      <td align="center" class="outer" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Brand -->
          <tr>
            <td style="padding:0 4px 16px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td valign="middle" style="padding-right:8px;">
                    <div style="width:12px; height:12px; border:4px solid ${C.primary}; border-radius:10px;"></div>
                  </td>
                  <td valign="middle" style="font-size:18px; line-height:24px; font-weight:800; letter-spacing:-0.3px; color:${C.text};">Tudo bem?</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td class="card" style="background-color:${C.surface}; border-radius:24px; padding:36px 32px;">

              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td valign="middle" style="padding-right:14px;">
                    <div style="width:44px; height:44px; border:5px solid ${tone.accent}; border-radius:27px; text-align:center; font-size:15px; line-height:44px; font-weight:800; color:${tone.text};">${layout.ringLabel}</div>
                  </td>
                  <td valign="middle" style="font-size:13px; line-height:18px; font-weight:800; letter-spacing:1px; text-transform:uppercase; color:${tone.text};">${layout.overline}</td>
                </tr>
              </table>

              <h1 class="title" style="margin:24px 0 0; font-size:28px; line-height:34px; font-weight:800; letter-spacing:-0.6px; color:${C.text};">${layout.title}</h1>

              <p style="margin:14px 0 0; font-size:16px; line-height:24px; font-weight:500; color:${C.secondary};">${layout.intro}</p>

              <!-- Details -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px; background-color:${tone.tint}; border-radius:16px;">
                <tr>
                  <td style="padding:16px 18px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${details}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Steps -->
              <h2 style="margin:32px 0 14px; font-size:18px; line-height:24px; font-weight:800; color:${C.text};">O que fazer agora</h2>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${steps}
              </table>

              <!-- Emergency numbers -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:4px;">
                <tr>${numbers}
                </tr>
              </table>
              ${note}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 8px 0; font-size:12px; line-height:18px; color:${C.muted}; text-align:center;">
              Você recebeu este e-mail porque ${layout.userName} cadastrou este endereço como contato de emergência no app Tudo&nbsp;bem?.<br>
              Esta é uma mensagem automática. Respostas a este e-mail não são lidas.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

type InactivityAlertParams = {
  userName: string;
  contactName: string;
  lastCheckinAt: Date;
};

export const createEmergency48HoursAlertEmailContent = ({
  userName,
  contactName,
  lastCheckinAt,
}: InactivityAlertParams) => {
  const name = escapeHtml(userName.trim());
  const first = escapeHtml(firstName(userName));
  const contact = escapeHtml(firstName(contactName));
  const deadline = new Date(
    lastCheckinAt.getTime() + CHECKIN_WINDOW_HOURS * 60 * 60 * 1000,
  );

  return renderAlertEmail({
    tone: "warning",
    preheader: `${name} não confirma que está bem há mais de ${CHECKIN_WINDOW_HOURS} horas. Tente falar com ${first} o quanto antes.`,
    ringLabel: `${CHECKIN_WINDOW_HOURS}h`,
    overline: "Alerta de segurança",
    title: `${name} não dá sinal há mais de ${CHECKIN_WINDOW_HOURS} horas`,
    intro: `Olá, ${contact}. ${first} usa o app Tudo bem? para confirmar que está tudo certo a cada ${CHECKIN_WINDOW_HOURS} horas e indicou você como contato de emergência. O prazo terminou sem nenhuma resposta.`,
    details: [
      { label: "Último check-in", value: formatEmailDate(lastCheckinAt) },
      { label: "Prazo para responder", value: formatEmailDate(deadline) },
    ],
    steps: [
      `Ligue ou mande uma mensagem para ${first}.`,
      "Se não conseguir falar, peça a alguém próximo que vá até lá.",
      "Se suspeitar de uma emergência, ligue para um dos serviços abaixo.",
    ],
    note: `Muitas vezes é só um celular sem bateria ou um esquecimento, mas vale a pena verificar. Assim que ${first} fizer o check-in, o monitoramento volta ao normal.`,
    userName: name,
  });
};

type ManualAlertParams = {
  userName: string;
  contactName: string;
  sentAt: Date;
};

export const createManualAlertEmailContent = ({
  userName,
  contactName,
  sentAt,
}: ManualAlertParams) => {
  const name = escapeHtml(userName.trim());
  const first = escapeHtml(firstName(userName));
  const contact = escapeHtml(firstName(contactName));

  return renderAlertEmail({
    tone: "danger",
    preheader: `${name} tocou em “Não estou bem” e pediu que você fosse avisado(a). Entre em contato agora.`,
    ringLabel: "!",
    overline: "Alerta de emergência",
    title: `${name} avisou que não está bem`,
    intro: `Olá, ${contact}. ${first} tocou em <strong style="color:${C.text};">“Não estou bem”</strong> no app Tudo bem? e pediu que você, seu contato de emergência, fosse avisado(a) imediatamente.`,
    details: [{ label: "Alerta enviado", value: formatEmailDate(sentAt) }],
    steps: [
      `Ligue para ${first} agora.`,
      "Se não atender, procure alguém que possa ir até lá.",
      "Em caso de emergência, ligue para um dos serviços abaixo.",
    ],
    userName: name,
  });
};

export async function sendEmail(to: string, subject: string, content: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject,
    html: content,
  });
}
