import { ThemedButton } from "@/components/ThemedButton";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { ThemeView } from "../../components/ThemeView";

export default function Welcome() {
  const router = useRouter();

  return (
    <ThemeView>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Tudo bem?</Text>
          <Text style={styles.secondaryText}>
            Às vezes, tudo o que a gente precisa é avisar que está bem.
          </Text>
          <Text style={styles.secondaryText}>
            Com um toque, você confirma que está tudo certo. Se você não
            responder em 48 horas, um contato de emergência recebe uma mensagem
            via WhatsApp.
          </Text>
        </View>

        <ThemedButton
          title="Começar"
          variant="neutral"
          onPress={() => router.push("/onboarding/input-your-name")}
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
  textContainer: {
    gap: 12,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
  },
  secondaryText: {
    fontSize: 18,
    fontWeight: "600",
  },
});
