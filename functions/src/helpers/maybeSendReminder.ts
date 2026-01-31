import { sendExpoPush } from "./sendExpoPush";

function getMessage(
  level: "24h" | "12h" | "4h" | "2h" | "1h" | "30m" | "10m",
): string {
  const map = {
    "24h": "Falta 24 horas para seu check-in. Tudo bem por aí? 🤗",
    "12h": "Olá! Lembre-se de fazer seu check-in. Faltam 12 horas! 👋",
    "4h": "Ei! Só mais 4 horas para o check-in. Não esqueça! ⏰",
    "2h": "Atenção! Faltam apenas 2 horas para seu check-in! 🚨",
    "1h": "Última hora! Faça seu check-in agora mesmo! ⏳",
    "30m": "Só 30 minutos restantes! Check-in urgente! 🏃‍♂️",
    "10m": "⚠️ Últimos 10 minutos! Check-in imediato! Por favor! 🙏",
  };

  return map[level] || "Está na hora do seu check-in! ✅";
}

async function sendPush(
  token: string,
  level: "24h" | "12h" | "4h" | "2h" | "1h" | "30m" | "10m",
): Promise<void> {
  await sendExpoPush(token, "Tudo bem com você? 🫶", getMessage(level));
}

export async function maybeSendReminder(
  ref: FirebaseFirestore.DocumentReference,
  data: any,
  remainingMs: number,
): Promise<void> {
  const reminders: {
    key: "24h" | "12h" | "4h" | "2h" | "1h" | "30m" | "10m";
    time: number;
  }[] = [
    { key: "24h", time: 24 * 60 * 60 * 1000 },
    { key: "12h", time: 12 * 60 * 60 * 1000 },
    { key: "4h", time: 4 * 60 * 60 * 1000 },
    { key: "2h", time: 2 * 60 * 60 * 1000 },
    { key: "1h", time: 1 * 60 * 60 * 1000 },
    { key: "30m", time: 30 * 60 * 1000 },
    { key: "10m", time: 10 * 60 * 1000 },
  ];

  for (const r of reminders) {
    if (remainingMs <= r.time && !data.remindersSent?.[r.key]) {
      await sendPush(data.fcmToken, r.key);
      await ref.update({
        [`remindersSent.${r.key}`]: true,
      });
      break;
    }
  }
}
