import cors from "cors";
import * as functions from "firebase-functions";
// eslint-disable-next-line import/no-unresolved
import { defineSecret } from "firebase-functions/params";
import { v4 as uuidv4 } from "uuid";
import { CHECKIN_WINDOW_HOURS } from "./constants";
import { admin } from "./firebase";
import { maybeSendReminder } from "./helpers/maybeSendReminder";
import {
  createEmergency48HoursAlertEmailContent,
  createManualAlertEmailContent,
  sendEmail,
} from "./helpers/sendEmail";
import { sendExpoPush } from "./helpers/sendExpoPush";
import { validateDeviceWithId } from "./helpers/validateDevice";
import { validateMethod } from "./helpers/validateMethod";

const db = admin.firestore();
const corsHandler = cors({ origin: true });

const RESEND_API_KEY = defineSecret("RESEND_API_KEY");

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

    const now = admin.firestore.Timestamp.now();
    await db.collection("checkins").add({
      deviceId,
      checkedAt: now,
      source: "register",
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
      source: "checkin",
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

    const {
      name,
      emergencyContactName,
      emergencyContactEmail,
      lastCheckinAt,
      disabled,
    } = installationSnap.data()!;

    const checkinUntil = lastCheckinAt.toDate();
    checkinUntil.setHours(checkinUntil.getHours() + CHECKIN_WINDOW_HOURS);

    return res.status(200).json({
      name,
      emergencyContactName,
      emergencyContactEmail,
      lastCheckinAt: lastCheckinAt.toDate().toISOString(),
      checkinUntil: checkinUntil.toISOString(),
      disabled: disabled || false,
    });
  });
});

export const toggleDevice = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (!validateMethod(req, res, "POST")) return;

    const deviceData = await validateDeviceWithId(req, res);
    if (!deviceData) return;

    const { installationRef, installationSnap } = deviceData;
    const currentDisabledState = installationSnap.data()?.disabled || false;

    const now = admin.firestore.Timestamp.now();
    await installationRef.update({
      disabled: !currentDisabledState,
      lastCheckinAt: now,
      alertSent: false,
      remindersSent: {
        "24h": false,
        "12h": false,
        "4h": false,
        "2h": false,
        "1h": false,
        "30m": false,
        "10m": false,
      },
      updatedAt: now,
    });

    await db.collection("checkins").add({
      deviceId: deviceData.deviceId,
      checkedAt: now,
      source: "toggleDevice",
    });

    return res.status(200).json({
      disabled: !currentDisabledState,
    });
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

export const updateProfile = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (!validateMethod(req, res, "PUT")) return;

    const deviceData = await validateDeviceWithId(req, res);
    if (!deviceData) return;

    const { installationRef } = deviceData;
    const { name, emergencyContactName, emergencyContactEmail } = req.body;

    if (!name || !emergencyContactName || !emergencyContactEmail) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    try {
      await installationRef.update({
        name,
        emergencyContactName,
        emergencyContactEmail,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return res.status(200).json({
        message: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      return res.status(500).json({
        error: "Failed to update profile",
      });
    }
  });
});

export const deleteAccount = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (!validateMethod(req, res, "DELETE")) return;

    const deviceData = await validateDeviceWithId(req, res);
    if (!deviceData) return;

    const { deviceId, installationRef } = deviceData;

    try {
      // Delete all checkins for this device
      const checkinsSnapshot = await db
        .collection("checkins")
        .where("deviceId", "==", deviceId)
        .get();

      const batch = db.batch();

      // Delete checkins
      checkinsSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Delete installation
      batch.delete(installationRef);

      await batch.commit();

      return res.status(200).json({
        message: "Account deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting account:", error);
      return res.status(500).json({
        error: "Failed to delete account",
      });
    }
  });
});

export const iAmNotWellAndSendEmail = functions.https.onRequest(
  { secrets: [RESEND_API_KEY] },
  (req, res) => {
    corsHandler(req, res, async () => {
      if (!validateMethod(req, res, "POST")) return;

      const deviceData = await validateDeviceWithId(req, res);
      if (!deviceData) return;

      const { installationRef, installationSnap } = deviceData;
      const data = installationSnap.data()!;

      try {
        await sendEmail(
          data.emergencyContactEmail,
          `Alerta de emergência - ${data.name}`,
          createManualAlertEmailContent(data.name),
        );

        await installationRef.update({
          alertSent: true,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log(`Manual alert sent for user: ${data.name}`);

        return res.status(200).json({
          message: "Alert sent successfully",
        });
      } catch (error) {
        console.error(
          `Failed to send manual alert for user ${data.name}:`,
          error,
        );
        return res.status(500).json({
          error: "Failed to send alert",
        });
      }
    });
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
