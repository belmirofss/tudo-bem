import cors from "cors";
import * as functions from "firebase-functions";
// eslint-disable-next-line import/no-unresolved
import { defineSecret } from "firebase-functions/params";
import { v4 as uuidv4 } from "uuid";
import { CHECKIN_WINDOW_HOURS } from "./constants";
import { admin } from "./firebase";
import {
  createEmergency48HoursAlertEmailContent,
  sendEmail,
} from "./helpers/sendEmail";
import { sendExpoPush } from "./helpers/sendExpoPush";
import { validateDeviceWithId } from "./helpers/validateDevice";
import { validateMethod } from "./helpers/validateMethod";

const db = admin.firestore();
const corsHandler = cors({ origin: true });

const RESEND_API_KEY = defineSecret("RESEND_API_KEY");

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

async function maybeSendReminder(
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

export const register = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (!validateMethod(req, res, "POST")) return;

    const { name, emergencyContactName, emergencyContactEmail, fcmToken } =
      req.body;

    if (!name || !emergencyContactName || !emergencyContactEmail) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const deviceId = uuidv4();

    await db
      .collection("installations")
      .doc(deviceId)
      .set({
        deviceId,
        name,
        emergencyContactName,
        emergencyContactEmail,
        fcmToken: fcmToken || null,
        disabled: false,
        alertSent: false,
        lastCheckinAt: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        remindersSent: {
          "24h": false,
          "12h": false,
          "4h": false,
          "2h": false,
          "1h": false,
          "30m": false,
          "10m": false,
        },
      });

    return res.status(201).json({
      deviceId,
    });
  });
});

export const checkin = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (!validateMethod(req, res, "POST")) return;

    const deviceData = await validateDeviceWithId(req, res);
    if (!deviceData) return;

    const { installationRef } = deviceData;

    const now = admin.firestore.Timestamp.now();

    await installationRef.update({
      lastCheckinAt: now,
      alertSent: false,
      updatedAt: now,
      remindersSent: {
        "24h": false,
        "12h": false,
        "4h": false,
        "2h": false,
        "1h": false,
        "30m": false,
        "10m": false,
      },
    });

    await db.collection("checkins").add({
      deviceId: deviceData.deviceId,
      checkedAt: now,
    });

    const checkinUntil = now.toDate();
    checkinUntil.setHours(checkinUntil.getHours() + CHECKIN_WINDOW_HOURS);

    return res.status(200).json({
      checkedAt: now.toDate().toISOString(),
      checkinUntil: checkinUntil.toISOString(),
    });
  });
});

export const me = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (!validateMethod(req, res, "GET")) return;

    const deviceData = await validateDeviceWithId(req, res);
    if (!deviceData) return;

    const { installationSnap } = deviceData;

    const { name, emergencyContactName, emergencyContactEmail, lastCheckinAt } =
      installationSnap.data()!;

    const checkinUntil = lastCheckinAt.toDate();
    checkinUntil.setHours(checkinUntil.getHours() + CHECKIN_WINDOW_HOURS);

    return res.status(200).json({
      name,
      emergencyContactName,
      emergencyContactEmail,
      lastCheckinAt: lastCheckinAt.toDate().toISOString(),
      checkinUntil: checkinUntil.toISOString(),
    });
  });
});

export const disableDevice = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (!validateMethod(req, res, "POST")) return;

    const deviceData = await validateDeviceWithId(req, res);
    if (!deviceData) return;

    const { installationRef } = deviceData;

    await installationRef.update({
      disabled: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({});
  });
});

export const sendReminders = functions.scheduler.onSchedule(
  "every 5 minutes",
  async () => {
    const now = Date.now();
    const limit48h = 48 * 60 * 60 * 1000;

    const snapshot = await db
      .collection("installations")
      .where("disabled", "==", false)
      .where("lastCheckinAt", "!=", null)
      .get();

    for (const doc of snapshot.docs) {
      const data = doc.data();

      // Filter out documents without fcmToken in memory
      if (!data.fcmToken) continue;

      const last = data.lastCheckinAt.toMillis();
      const elapsed = now - last;
      const remaining = limit48h - elapsed;

      if (remaining > 0) {
        await maybeSendReminder(doc.ref, data, remaining);
      }
    }

    console.log("Reminder scheduler executed at", new Date(now).toISOString());
  },
);

export const checkInactiveUsers = functions.scheduler.onSchedule(
  {
    schedule: "every 5 minutes",
    secrets: [RESEND_API_KEY],
  },
  async () => {
    const now = admin.firestore.Timestamp.now();
    const limit = admin.firestore.Timestamp.fromDate(
      new Date(now.toMillis() - 48 * 60 * 60 * 1000),
    );

    const snapshot = await db
      .collection("installations")
      .where("disabled", "==", false)
      .where("alertSent", "==", false)
      .where("lastCheckinAt", "<", limit)
      .get();

    for (const doc of snapshot.docs) {
      const data = doc.data();

      try {
        await sendEmail(
          data.emergencyContactEmail,
          `Alerta de segurança - ${data.name}`,
          createEmergency48HoursAlertEmailContent(data.name),
        );

        if (data.fcmToken) {
          await sendExpoPush(
            data.fcmToken,
            "⚠️ Alerta",
            "Seu contato de emergência foi notificado! 🚨",
          );
          console.log(`Push notification sent for 48h alert: ${data.name}`);
        }

        await doc.ref.update({
          alertSent: true,
          updatedAt: now,
        });

        console.log(`Alert sent for user: ${data.name}`);
      } catch (error) {
        console.error(`Failed to send alert for user ${data.name}:`, error);
      }
    }

    console.log("Cron executed at", now.toDate().toISOString());
  },
);
