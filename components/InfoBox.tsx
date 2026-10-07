import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Colors } from "../constants";
import { ThemedText } from "./ThemedText";

type Props = {
  icon: keyof typeof MaterialIcons.glyphMap;
  children: React.ReactNode;
  tone?: "tint" | "surface";
};

export const InfoBox = ({ icon, children, tone = "tint" }: Props) => {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: tone === "tint" ? Colors.primaryTint : Colors.surface },
      ]}
    >
      <MaterialIcons name={icon} size={22} color={Colors.primary} />
      <ThemedText
        variant="caption"
        style={[
          styles.text,
          tone === "tint" && { color: Colors.text.onTint },
        ]}
      >
        {children}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 16,
    borderRadius: 16,
  },
  text: {
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
  },
});
