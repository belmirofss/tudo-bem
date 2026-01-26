import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import { useDeviceId } from "./useDeviceId";

export const useDisableDevice = () => {
  const { deviceId } = useDeviceId();

  return useMutation<void, Error>({
    mutationFn: async () => {
      if (!deviceId) {
        throw new Error("Device ID not found");
      }

      const response = await axios.post(
        `${BACKEND_URL}/disableDevice`,
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
