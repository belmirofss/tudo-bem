import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import { useDeviceId } from "./useDeviceId";

interface SendEmergencyAlertResponse {
  message: string;
}

export const useSendEmergencyAlert = () => {
  const { deviceId } = useDeviceId();

  return useMutation<SendEmergencyAlertResponse, Error>({
    mutationFn: async () => {
      if (!deviceId) {
        throw new Error("Device ID not found");
      }

      const response = await axios.post<SendEmergencyAlertResponse>(
        `${BACKEND_URL}/iAmNotWellAndSendEmail`,
        {},
        {
          headers: {
            "x-device-id": deviceId,
          },
        },
      );
      return response.data;
    },
  });
};
