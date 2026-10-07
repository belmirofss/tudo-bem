import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { ProgressRing } from "../../components/ProgressRing";
import { ThemedButton } from "../../components/ThemedButton";
import { ThemedText } from "../../components/ThemedText";
import { ThemeView } from "../../components/ThemeView";
import { Colors, Fonts } from "../../constants";

const STEPS: [string, string][] = [
  ["Um toque a cada 48 horas", " confirma que está tudo certo."],
  ["Lembretes", " chegam antes do prazo acabar."],
  ["Sem resposta?", " Seu contato de confiança recebe um e-mail."],
];

export default function Welcome() {
  const router = useRouter();

  return (
    <ThemeView>
      <View style={styles.hero} accessibilityElementsHidden>
        <ProgressRing size={200} strokeWidth={14} progress={0.75} />
        <View style={styles.heroCenter}>
          <MaterialIcons name="check" size={64} color={Colors.text.inverse} />
        </View>
      </View>

      <View style={styles.texts}>
        <ThemedText variant="display" accessibilityRole="header">
          Tudo bem?
        </ThemedText>
        <ThemedText variant="body" style={styles.subtitle}>
          Às vezes, tudo o que a gente precisa é avisar que está bem.
        </ThemedText>
      </View>

      <View style={styles.steps}>
        {STEPS.map(([strong, rest], index) => (
          <View key={strong} style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <ThemedText variant="body" style={styles.stepText}>
              <Text style={styles.stepStrong}>{strong}</Text>
              {rest}
            </ThemedText>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <ThemedButton
          title="Começar"
          onPress={() => router.push("/onboarding/input-your-name")}
        />
        <ThemedText variant="caption" style={styles.footerText}>
          Leva menos de 1 minuto
        </ThemedText>
      </View>
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  heroCenter: {
    position: "absolute",
    width: 136,
    height: 136,
    borderRadius: 68,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  texts: {
    gap: 12,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 26,
  },
  steps: {
    gap: 16,
    marginTop: 32,
  },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryTint,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    fontFamily: Fonts.extrabold,
    fontSize: 15,
    color: Colors.primary,
  },
  stepText: {
    flex: 1,
    paddingTop: 4,
    color: Colors.text.primary,
  },
  stepStrong: {
    fontFamily: Fonts.bold,
  },
  footer: {
    marginTop: "auto",
    paddingTop: 32,
    gap: 12,
  },
  footerText: {
    textAlign: "center",
  },
});
