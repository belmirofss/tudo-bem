import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
import { ThemeView } from "../../components/ThemeView";
import { DEVICE_ID_KEY } from "../../constants";
import { formatWhatsApp } from "../../helpers/formatWhatsApp";
import { useRegister } from "../../hooks/useRegister";
import { useOnboarding } from "./context/OnboardingContext";

export default function Review() {
  const { data } = useOnboarding();
  const registerMutation = useRegister();

  const handleConfirm = async () => {
    try {
      const result = await registerMutation.mutateAsync({
        name: data.name,
        emergencyContactName: data.emergencyContactName,
        emergencyContactWhatsapp: data.emergencyContactWhatsapp,
      });

      await SecureStore.setItemAsync(DEVICE_ID_KEY, result.deviceId);

      Toast.show({
        type: "success",
        text1: "Sucesso!",
        text2: "Cadastro realizado!",
      });

      setTimeout(() => {
        router.replace("/(app)");
      }, 1000);
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro ao registrar!",
      });
    }
  };

  return (
    <ThemeView>
      <View style={styles.container}>
        <ThemedText variant="title">Confirmação dos dados</ThemedText>

        <View style={styles.infoContainer}>
          {[
            ["Nome", data.name],
            ["Contato de Emergência", data.emergencyContactName],
            [
              "WhatsApp do Contato de Emergência",
              formatWhatsApp(data.emergencyContactWhatsapp),
            ],
          ].map(([title, value]) => (
            <View key={title}>
              <ThemedText variant="body">{title}</ThemedText>
              <ThemedText variant="strongBody">{value}</ThemedText>
            </View>
          ))}
        </View>
      </View>

      <ThemedButton
        title={registerMutation.isPending ? "Registrando..." : "Confirmar"}
        variant="good"
        onPress={handleConfirm}
        disabled={registerMutation.isPending}
      />
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  infoContainer: {
    marginTop: 24,
    flex: 1,
    gap: 24,
  },
});
