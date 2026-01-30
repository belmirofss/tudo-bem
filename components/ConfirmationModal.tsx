import { MaterialIcons } from "@expo/vector-icons";
import { Modal, StyleSheet, View } from "react-native";
import { Colors } from "../constants";
import { ThemedButton } from "./ThemedButton";
import { ThemedText } from "./ThemedText";

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmationModal = ({
  visible,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
}: Props) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="warning" size={48} color={Colors.button.bad} />
          </View>

          <ThemedText variant="title" style={styles.title}>
            {title}
          </ThemedText>

          <ThemedText variant="body" style={styles.message}>
            {message}
          </ThemedText>

          <View style={styles.buttonContainer}>
            <ThemedButton
              title={confirmText}
              variant="bad"
              onPress={onConfirm}
            />
            <ThemedButton
              title={cancelText}
              variant="link"
              onPress={onCancel}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
  },
  modalContainer: {
    backgroundColor: Colors.text.white,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    maxWidth: 320,
    width: "100%",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
    color: Colors.text.secondary,
  },
  buttonContainer: {
    flexDirection: "column",
    width: "100%",
    gap: 12,
  },
});
