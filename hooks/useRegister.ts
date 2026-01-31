import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "../constants";

interface RegisterData {
  name: string;
  emergencyContactName: string;
  emergencyContactEmail: string;
  fcmToken?: string;
}

interface RegisterResponse {
  deviceId: string;
}

export const useRegister = () => {
  return useMutation<RegisterResponse, Error, RegisterData>({
    mutationFn: async (data: RegisterData) => {
      const response = await axios.post<RegisterResponse>(
        `${BACKEND_URL}/register`,
        data,
      );
      return response.data;
    },
  });
};
