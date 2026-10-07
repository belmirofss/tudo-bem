import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { ThemeView } from "../components/ThemeView";
import { Colors } from "../constants";
import { ThemedButton } from "./ThemedButton";
import { ThemedText } from "./ThemedText";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Erro ao carregar dados.",
  onRetry,
}: ErrorStateProps) {
  return (
    <ThemeView>
      <View style={styles.container}>
        <MaterialIcons name="cloud-off" size={40} color={Colors.text.muted} />
        <ThemedText variant="body" style={styles.message}>
          {message}
        </ThemedText>
        {onRetry && (
          <ThemedButton
            title="Tentar novamente"
            variant="ghost"
            onPress={onRetry}
          />
        )}
      </View>
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  message: {
    textAlign: "center",
  },
});
