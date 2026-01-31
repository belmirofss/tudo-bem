import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Configurações",
        }}
      />
      <Stack.Screen
        name="update-profile"
        options={{
          title: "Atualizar dados",
        }}
      />
    </Stack>
  );
}
