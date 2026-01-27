import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { Colors } from "../constants";

const queryClient = new QueryClient();

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: Colors.button.good }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 18,
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: Colors.button.bad }}
      text1Style={{
        fontSize: 18,
      }}
      text2Style={{
        fontSize: 18,
      }}
    />
  ),
};

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
        <Toast config={toastConfig} />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
