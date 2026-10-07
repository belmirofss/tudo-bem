import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { Colors } from "../constants";

type Props = {
  onPress?: () => void;
};

export const BackButton = ({ onPress = () => router.back() }: Props) => {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Voltar"
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <MaterialIcons name="chevron-left" size={28} color={Colors.text.primary} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    backgroundColor: Colors.divider,
  },
});
