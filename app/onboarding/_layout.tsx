import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="welcome">
      <Stack.Screen name="welcome" />
      <Stack.Screen name="input-your-name" />
      <Stack.Screen name="input-your-emergency-contact" />
      <Stack.Screen name="review" />
    </Stack>
  );
}
