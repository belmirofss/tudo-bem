import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { Colors } from "../constants";
import { useDeviceId } from "../hooks/useDeviceId";

export default function Index() {
  const { deviceId, isLoading } = useDeviceId();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.background,
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (deviceId) {
    return <Redirect href="/(app)" />;
  }

  return <Redirect href="/onboarding/welcome" />;
}
