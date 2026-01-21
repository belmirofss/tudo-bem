import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { ThemedPhoneInput } from "../../components/ThemedPhoneInput";
import { ThemeView } from "../../components/ThemeView";
import { useOnboarding } from "./context/OnboardingContext";

export default function InputYourEmergencyContactWhatsapp() {
  const router = useRouter();
  const { updateEmergencyContactWhatsapp, isValidEmergencyContactWhatsapp } =
    useOnboarding();

  return (
    <ThemeView>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <ThemedText variant="title">
            Qual o número de WhatsApp do seu contato de emergência?
          </ThemedText>
          <ThemedPhoneInput onChangeText={updateEmergencyContactWhatsapp} />
        </View>

        <ThemedButton
          title="Continuar"
          variant="neutral"
          disabled={!isValidEmergencyContactWhatsapp}
          onPress={() => router.push("/onboarding/review")}
        />
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
});
