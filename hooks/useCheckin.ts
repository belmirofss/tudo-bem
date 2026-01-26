import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import { useDeviceId } from "./useDeviceId";

interface CheckinResponse {
  checkedAt: string;
}

export const useCheckin = () => {
  const { deviceId } = useDeviceId();

  return useMutation<CheckinResponse, Error>({
    mutationFn: async () => {
      if (!deviceId) {
        throw new Error("Device ID not found");
      }

      const response = await axios.post<CheckinResponse>(
        `${BACKEND_URL}/checkin`,
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
