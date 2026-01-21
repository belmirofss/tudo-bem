import { StyleSheet, Text, View } from "react-native";
import { ThemeView } from "../../components/ThemeView";
import { ThemedButton } from "../../components/ThemedButton";
import { Colors } from "../../constants";

export default function HomeScreen() {
  return (
    <ThemeView>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Tudo bem?</Text>
          <Text style={styles.advice}>
            Você tem 48 horas para responder. Caso contrário, entraremos em
            contato com seu contato de emergência.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <ThemedButton title="Sim, estou bem 👍" variant="good" size="large" />
          <ThemedButton title="Não estou bem" variant="bad" />
        </View>
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
  title: {
    fontSize: 36,
    fontWeight: "bold",
  },
  advice: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.secondary,
  },
  buttonContainer: {
    flexDirection: "column",
    gap: 8,
    width: "100%",
  },
});
