import * as Notifications from "expo-notifications";

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Error requesting notification permissions:", error);
    return false;
  }
}

export async function getFCMToken(): Promise<string | null> {
  try {
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
}

export async function initializeNotifications(): Promise<string | null> {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    console.log("Notification permissions not granted");
    return null;
  }

  const token = await getFCMToken();
  if (!token) {
    console.log("Failed to get FCM token");
    return null;
  }

  console.log("FCM Token obtained:", token);
  return token;
}
