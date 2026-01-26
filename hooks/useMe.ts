import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import { useDeviceId } from "./useDeviceId";

interface MeResponse {
  name: string;
  emergencyContactName: string;
  emergencyContactWhatsapp: string;
  lastCheckinAt: string | null;
}

export const useMe = () => {
  const { deviceId } = useDeviceId();

  return useQuery<MeResponse, Error>({
    queryKey: ["me", deviceId],
    queryFn: async () => {
      if (!deviceId) {
        throw new Error("Device ID not found");
      }

      const response = await axios.get<MeResponse>(`${BACKEND_URL}/me`, {
        headers: {
          "x-device-id": deviceId,
        },
      });
      return response.data;
    },
    enabled: !!deviceId, // Only run query if deviceId exists
  });
};
