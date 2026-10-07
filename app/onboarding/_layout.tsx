import { Stack } from "expo-router";
import { Colors } from "../../constants";
import { OnboardingProvider } from "./context/OnboardingContext";

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
        }}
        initialRouteName="welcome"
      >
        <Stack.Screen name="welcome" />
        <Stack.Screen name="input-your-name" />
        <Stack.Screen name="input-your-emergency-contact-name" />
        <Stack.Screen name="input-your-emergency-contact-email" />
        <Stack.Screen name="review" />
      </Stack>
    </OnboardingProvider>
  );
}
