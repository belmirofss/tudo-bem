import cors from "cors";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { v4 as uuidv4 } from "uuid";
import { CHECKIN_WINDOW_HOURS } from "./constants";

admin.initializeApp();
const db = admin.firestore();
const corsHandler = cors({ origin: true });

export const register = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

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
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const deviceId = req.header("x-device-id");

    if (!deviceId) {
      return res.status(400).json({
        error: "x-device-id header is required",
      });
    }

    const installationRef = db.collection("installations").doc(deviceId);

    const installationSnap = await installationRef.get();

    if (!installationSnap.exists) {
      return res.status(404).json({
        error: "Device not found",
      });
    }

    const now = admin.firestore.Timestamp.now();

    await installationRef.update({
      lastCheckinAt: now,
      updatedAt: now,
    });

    await db.collection("checkins").add({
      deviceId,
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
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const deviceId = req.header("x-device-id");

    if (!deviceId) {
      return res.status(400).json({
        error: "x-device-id header is required",
      });
    }

    const installationRef = db.collection("installations").doc(deviceId);
    const installationSnap = await installationRef.get();

    if (!installationSnap.exists) {
      return res.status(404).json({
        error: "Device not found",
      });
    }

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
