import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/manrope";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast, { BaseToast, ToastConfigParams } from "react-native-toast-message";
import { Colors, Fonts } from "../constants";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const toastBase = {
  borderLeftWidth: 6,
  borderRadius: 16,
  backgroundColor: Colors.surface,
};

const toastText = {
  text1Style: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.text.primary,
  },
  text2Style: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.text.muted,
  },
};

const toastConfig = {
  success: (props: ToastConfigParams<unknown>) => (
    <BaseToast
      {...props}
      style={{ ...toastBase, borderLeftColor: Colors.primary }}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      {...toastText}
    />
  ),
  error: (props: ToastConfigParams<unknown>) => (
    <BaseToast
      {...props}
      style={{ ...toastBase, borderLeftColor: Colors.danger }}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      {...toastText}
    />
  ),
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  const ready = fontsLoaded || !!fontError;

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView
        style={{
          flex: 1,
          backgroundColor: Colors.background,
          ...(Platform.OS === "android" && {
            paddingTop: 0,
          }),
        }}
      >
        <QueryClientProvider client={queryClient}>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: Colors.background },
            }}
          >
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="(app)" />
          </Stack>
          <Toast config={toastConfig} />
        </QueryClientProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
