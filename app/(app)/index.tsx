import { StyleSheet, View } from "react-native";
import { ThemeView } from "../../components/ThemeView";
import { ThemedButton } from "../../components/ThemedButton";
import { ThemedText } from "../../components/ThemedText";

export default function HomeScreen() {
  return (
    <ThemeView>
      <View style={styles.container}>
        <View>
          <ThemedText variant="title">Tudo bem?</ThemedText>
        </View>

        <View style={styles.buttonContainer}>
          <ThemedButton title="Sim, estou bem 👍" variant="good" size="large" />
          <ThemedButton title="Não estou bem" variant="bad" />
        </View>
        <ThemedText variant="secondaryBody">
          Se você não responder em 03:00, uma mensagem será enviada para seu
          contato de emergência.
        </ThemedText>
        <ThemedText variant="secondaryBody">
          Última resposta: 21/01/2025 14:30
        </ThemedText>
      </View>
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-end",
    gap: 12,
  },
  buttonContainer: {
    flexDirection: "column",
    gap: 8,
    width: "100%",
  },
});
