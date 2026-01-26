import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        ...(Platform.OS === "android" && {
          paddingTop: 0,
        }),
      }}
    >
      <QueryClientProvider client={queryClient}>
        <StatusBar style="auto" hidden={true} />
        <Stack
          screenOptions={{
            headerShown: false,
            ...(Platform.OS === "android" && {
              navigationBarHidden: true,
            }),
          }}
        >
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(app)" />
        </Stack>
        <Toast />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
