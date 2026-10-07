import { ActivityIndicator, View } from "react-native";
import { ThemeView } from "../components/ThemeView";
import { Colors } from "../constants";

interface LoadingStateProps {
  size?: "small" | "large";
  color?: string;
}

export function LoadingState({
  size = "large",
  color = Colors.primary,
}: LoadingStateProps) {
  return (
    <ThemeView>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={size} color={color} />
      </View>
    </ThemeView>
  );
}
