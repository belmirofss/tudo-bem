import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import { useDeviceId } from "./useDeviceId";

interface DeleteAccountResponse {
  message: string;
}

export const useDeleteAccount = () => {
  const { deviceId } = useDeviceId();
  const queryClient = useQueryClient();

  return useMutation<DeleteAccountResponse, Error>({
    mutationFn: async () => {
      if (!deviceId) {
        throw new Error("Device ID not found");
      }

      const response = await axios.delete<DeleteAccountResponse>(
        `${BACKEND_URL}/deleteAccount`,
        {
          headers: {
            "x-device-id": deviceId,
          },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      // Clear all cached queries since account is deleted
      queryClient.clear();
    },
  });
};
