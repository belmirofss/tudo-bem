import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Colors } from "../constants";
import { BottomSheet } from "./BottomSheet";
import { ThemedButton } from "./ThemedButton";
import { ThemedText } from "./ThemedText";

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  tone?: "danger" | "primary";
  icon?: keyof typeof MaterialIcons.glyphMap;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmationModal = ({
  visible,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  tone = "danger",
  icon = "warning-amber",
  onConfirm,
  onCancel,
}: Props) => {
  const isDanger = tone === "danger";

  return (
    <BottomSheet visible={visible} onClose={onCancel}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: isDanger ? Colors.dangerTint : Colors.primaryTint },
        ]}
      >
        <MaterialIcons
          name={icon}
          size={28}
          color={isDanger ? Colors.danger : Colors.primary}
        />
      </View>

      <View style={styles.texts}>
        <ThemedText variant="title" accessibilityRole="header">
          {title}
        </ThemedText>
        <ThemedText variant="body">{message}</ThemedText>
      </View>

      <View style={styles.buttons}>
        <ThemedButton
          title={confirmText}
          variant={isDanger ? "danger" : "primary"}
          onPress={onConfirm}
        />
        <ThemedButton title={cancelText} variant="ghost" onPress={onCancel} />
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  texts: {
    gap: 8,
  },
  buttons: {
    gap: 4,
  },
});
