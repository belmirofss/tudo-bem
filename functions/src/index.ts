import cors from "cors";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { v4 as uuidv4 } from "uuid";

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
      lastCheckinAt: null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(201).json({
      deviceId,
    });
  });
});
