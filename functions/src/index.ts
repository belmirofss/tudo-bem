import cors from "cors";
import * as functions from "firebase-functions";
// eslint-disable-next-line import/no-unresolved
import { defineSecret } from "firebase-functions/params";
import { v4 as uuidv4 } from "uuid";
import { CHECKIN_WINDOW_HOURS } from "./constants";
import { admin } from "./firebase";
import { sendEmail } from "./helpers/sendEmail";
import { validateDeviceWithId } from "./helpers/validateDevice";
import { validateMethod } from "./helpers/validateMethod";

const db = admin.firestore();
const corsHandler = cors({ origin: true });

const RESEND_API_KEY = defineSecret("RESEND_API_KEY");

export const register = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (!validateMethod(req, res, "POST")) return;

    const { name, emergencyContactName, emergencyContactEmail } = req.body;

    if (!name || !emergencyContactName || !emergencyContactEmail) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const deviceId = uuidv4();

    await db.collection("installations").doc(deviceId).set({
      deviceId,
      name,
      emergencyContactName,
      emergencyContactEmail,
      disabled: false,
      alertSent: false,
      lastCheckinAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
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
        await sendEmail(data.emergencyContactEmail, data.name);

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
