import { Stack } from "expo-router";
import { OnboardingProvider } from "./context/OnboardingContext";

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack screenOptions={{ headerShown: false }} initialRouteName="welcome">
        <Stack.Screen name="welcome" />
        <Stack.Screen name="input-your-name" />
        <Stack.Screen name="input-your-emergency-contact-name" />
        <Stack.Screen name="input-your-emergency-contact-whatsapp" />
        <Stack.Screen name="review" />
      </Stack>
    </OnboardingProvider>
  );
}
