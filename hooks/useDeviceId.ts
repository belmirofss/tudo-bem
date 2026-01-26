import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { DEVICE_ID_KEY } from "../constants";

export const useDeviceId = () => {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkDeviceId = async () => {
      try {
        const storedDeviceId = await SecureStore.getItemAsync(DEVICE_ID_KEY);
        setDeviceId(storedDeviceId);
      } catch (error) {
        console.error("Error checking deviceId:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkDeviceId();
  }, []);

  return { deviceId, isLoading };
};
