import { View } from "react-native";
import { ThemeView } from "../components/ThemeView";
import { ThemedText } from "./ThemedText";

interface ErrorStateProps {
  message?: string;
}

export function ErrorState({
  message = "Erro ao carregar dados.",
}: ErrorStateProps) {
  return (
    <ThemeView>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ThemedText variant="secondaryBody">{message}</ThemedText>
      </View>
    </ThemeView>
  );
}
