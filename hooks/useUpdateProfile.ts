import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import { useDeviceId } from "./useDeviceId";

interface UpdateProfileData {
  name: string;
  emergencyContactName: string;
  emergencyContactEmail: string;
}

interface UpdateProfileResponse {
  message: string;
}

export const useUpdateProfile = () => {
  const { deviceId } = useDeviceId();
  const queryClient = useQueryClient();

  return useMutation<UpdateProfileResponse, Error, UpdateProfileData>({
    mutationFn: async (data: UpdateProfileData) => {
      if (!deviceId) {
        throw new Error("Device ID not found");
      }

      const response = await axios.put<UpdateProfileResponse>(
        `${BACKEND_URL}/updateProfile`,
        data,
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
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};
