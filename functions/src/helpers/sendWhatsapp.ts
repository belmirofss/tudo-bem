import { Twilio } from "twilio";
import { TWILIO_SANDBOX_NUMBER } from "../constants";

const twilio = new Twilio(process.env.TWILIO_SID!, process.env.TWILIO_TOKEN!);

export async function sendWhatsapp(to: string, userName: string) {
  const fromNumber =
    process.env.NODE_ENV === "production"
      ? `whatsapp:+55${to}`
      : `whatsapp:${TWILIO_SANDBOX_NUMBER}`;
  await twilio.messages.create({
    from: fromNumber,
    to: `whatsapp:+55${to}`,
    body: `
Olá!

Nós somos o app "Tudo bem?" e você foi cadastrado como um contato de emergência de ${userName}. Nós não recebemos uma confirmação de vida há mais de 48 horas.

Por favor, tente contato para averiguar a integridade de ${userName}.

Obrigado.
`.trim(),
  });
}
