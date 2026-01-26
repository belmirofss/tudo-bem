import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { ThemedTextInput } from "../../components/ThemedTextInput";
import { ThemeView } from "../../components/ThemeView";
import { useOnboarding } from "./context/OnboardingContext";

export default function InputYourName() {
  const router = useRouter();
  const { updateName, data, isValidName } = useOnboarding();

  return (
    <ThemeView>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <ThemedText variant="title">Qual é seu nome?</ThemedText>
          <ThemedTextInput
            value={data.name}
            onChangeText={updateName}
            placeholder="Digite seu nome"
          />
        </View>

        <View style={styles.buttonsContainer}>
          <ThemedButton
            title="Continuar"
            variant="neutral"
            disabled={!isValidName}
            onPress={() =>
              router.push("/onboarding/input-your-emergency-contact-name")
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
