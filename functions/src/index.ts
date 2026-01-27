import cors from "cors";
import * as functions from "firebase-functions";
import { v4 as uuidv4 } from "uuid";
import { CHECKIN_WINDOW_HOURS } from "./constants";
import { admin } from "./firebase";
import { validateDeviceWithId } from "./helpers/validateDevice";
import { validateMethod } from "./helpers/validateMethod";

const db = admin.firestore();
const corsHandler = cors({ origin: true });

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
