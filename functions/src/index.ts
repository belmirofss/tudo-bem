import cors from "cors";
import * as functions from "firebase-functions";
// eslint-disable-next-line import/no-unresolved
import { defineSecret } from "firebase-functions/params";
import { Twilio } from "twilio";
import { v4 as uuidv4 } from "uuid";
import { CHECKIN_WINDOW_HOURS } from "./constants";
import { admin } from "./firebase";
import { sendWhatsapp } from "./helpers/sendWhatsapp";
import { validateDeviceWithId } from "./helpers/validateDevice";
import { validateMethod } from "./helpers/validateMethod";

const db = admin.firestore();
const corsHandler = cors({ origin: true });

const TWILIO_SID = defineSecret("TWILIO_SID");
const TWILIO_TOKEN = defineSecret("TWILIO_TOKEN");

export const register = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (!validateMethod(req, res, "POST")) return;

    const { name, emergencyContactName, emergencyContactWhatsapp } = req.body;

    if (!name || !emergencyContactName || !emergencyContactWhatsapp) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const deviceId = uuidv4();

    await db.collection("installations").doc(deviceId).set({
      deviceId,
      name,
      emergencyContactName,
      emergencyContactWhatsapp,
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

    const {
      name,
      emergencyContactName,
      emergencyContactWhatsapp,
      lastCheckinAt,
    } = installationSnap.data()!;

    const checkinUntil = lastCheckinAt.toDate();
    checkinUntil.setHours(checkinUntil.getHours() + CHECKIN_WINDOW_HOURS);

    return res.status(200).json({
      name,
      emergencyContactName,
      emergencyContactWhatsapp,
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
    secrets: [TWILIO_SID, TWILIO_TOKEN],
  },
  async () => {
    const twilio = new Twilio(TWILIO_SID.value(), TWILIO_TOKEN.value());
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
        await sendWhatsapp(twilio, data.emergencyContactWhatsapp, data.name);

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
