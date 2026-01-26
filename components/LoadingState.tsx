import { ActivityIndicator, View } from "react-native";
import { ThemeView } from "../components/ThemeView";

interface LoadingStateProps {
  size?: "small" | "large";
  color?: string;
}

export function LoadingState({ size = "large", color }: LoadingStateProps) {
  return (
    <ThemeView>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={size} color={color} />
      </View>
    </ThemeView>
  );
}
