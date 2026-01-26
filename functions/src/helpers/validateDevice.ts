import { Response } from "express";
import * as admin from "firebase-admin";

const db = admin.firestore();

interface DeviceData {
  deviceId: string;
  installationRef: admin.firestore.DocumentReference;
  installationSnap: admin.firestore.DocumentSnapshot;
}

async function validateDeviceWithId(
  req: any,
  res: Response,
): Promise<DeviceData | null> {
  const deviceId = req.header("x-device-id");
  if (!deviceId) {
    res.status(400).json({
      error: "x-device-id header is required",
    });
    return null;
  }

  const installationRef = db.collection("installations").doc(deviceId);
  const installationSnap = await installationRef.get();

  if (!installationSnap.exists) {
    res.status(404).json({
      error: "Device not found",
    });
    return null;
  }

  return { deviceId, installationRef, installationSnap };
}

export { validateDeviceWithId };
