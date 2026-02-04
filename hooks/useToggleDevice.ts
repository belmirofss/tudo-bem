import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import { useDeviceId } from "./useDeviceId";

interface ToggleDeviceResponse {
  disabled: boolean;
}

export const useToggleDevice = () => {
  const { deviceId } = useDeviceId();
  const queryClient = useQueryClient();

  return useMutation<boolean, Error>({
    mutationFn: async () => {
      if (!deviceId) {
        throw new Error("Device ID not found");
      }

      const response = await axios.post<ToggleDeviceResponse>(
        `${BACKEND_URL}/toggleDevice`,
        {},
        {
          headers: {
            "x-device-id": deviceId,
          },
        },
      );
      return response.data.disabled;
    },
    onSuccess: () => {
      // Invalidate the me query to refresh user data
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};
