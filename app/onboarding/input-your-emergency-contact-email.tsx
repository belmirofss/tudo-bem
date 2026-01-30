import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { ThemedEmailInput } from "../../components/ThemedEmailInput";
import { ThemeView } from "../../components/ThemeView";
import { useOnboarding } from "./context/OnboardingContext";

export default function InputYourEmergencyContactEmail() {
  const router = useRouter();
  const { data, updateEmergencyContactEmail, isValidEmergencyContactEmail } =
    useOnboarding();

  return (
    <ThemeView>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <ThemedText variant="title">
            Qual o e-mail do seu contato de emergência?
          </ThemedText>
          <ThemedEmailInput
            value={data.emergencyContactEmail}
            onChangeText={updateEmergencyContactEmail}
          />
        </View>

        <View style={styles.buttonsContainer}>
          <ThemedButton
            title="Continuar"
            variant="neutral"
            disabled={!isValidEmergencyContactEmail}
            onPress={() => router.push("/onboarding/review")}
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
