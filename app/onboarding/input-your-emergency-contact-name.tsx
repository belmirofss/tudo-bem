import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { ThemedTextInput } from "../../components/ThemedTextInput";
import { ThemeView } from "../../components/ThemeView";
import { useOnboarding } from "./context/OnboardingContext";

export default function InputYourEmergencyContactName() {
  const router = useRouter();
  const { updateEmergencyContactName, data, isValidEmergencyContactName } =
    useOnboarding();

  return (
    <ThemeView>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <ThemedText variant="title">
            Qual o nome do seu contato de emergência?
          </ThemedText>
          <ThemedTextInput
            value={data.emergencyContactName}
            onChangeText={updateEmergencyContactName}
            placeholder="Digite o nome do contato"
          />
        </View>

        <View style={styles.buttonsContainer}>
          <ThemedButton
            title="Continuar"
            variant="neutral"
            disabled={!isValidEmergencyContactName}
            onPress={() =>
              router.push("/onboarding/input-your-emergency-contact-whatsapp")
            }
          />
          <ThemedButton
            title="Voltar"
            variant="link"
            onPress={() => router.back()}
          />
        </View>
      </View>
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  contentContainer: {
    gap: 24,
    width: "100%",
  },
  buttonsContainer: {
    gap: 8,
    width: "100%",
  },
});
