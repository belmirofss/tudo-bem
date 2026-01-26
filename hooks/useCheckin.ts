import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import { useDeviceId } from "./useDeviceId";

interface CheckinResponse {
  checkedAt: string;
  checkinUntil: string;
}

export const useCheckin = () => {
  const { deviceId } = useDeviceId();
  const queryClient = useQueryClient();

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
    onSuccess: () => {
      // Invalidate the me query to refresh user data
      queryClient.invalidateQueries({ queryKey: ["me", deviceId] });
    },
  });
};
