import { MaterialIcons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Colors, Fonts } from "../constants";
import { BottomSheet } from "./BottomSheet";
import { HoldButton } from "./HoldButton";
import { ThemedButton } from "./ThemedButton";
import { ThemedText } from "./ThemedText";

const EMERGENCY_NUMBERS = [
  { number: "192", label: "SAMU" },
  { number: "190", label: "Polícia" },
  { number: "188", label: "CVV" },
];

type Props = {
  visible: boolean;
  contactName: string;
  sending: boolean;
  onSend: () => void;
  onClose: () => void;
};

export const EmergencySheet = ({
  visible,
  contactName,
  sending,
  onSend,
  onClose,
}: Props) => {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="warning-amber" size={28} color={Colors.danger} />
      </View>

      <View style={styles.texts}>
        <ThemedText variant="title" accessibilityRole="header">
          Precisa de ajuda?
        </ThemedText>
        <ThemedText variant="body">
          Vamos avisar{" "}
          <Text style={styles.contactName}>{contactName}</Text> agora, por
          e-mail, que você não está bem e precisa de contato.
        </ThemedText>
      </View>

      <HoldButton
        accessibilityLabel={`Avisar ${contactName}`}
        accessibilityHint="Toque e segure para enviar o alerta"
        onComplete={onSend}
        disabled={sending}
        duration={1500}
        fillColor={Colors.dangerDark}
        fillDirection="right"
        style={styles.holdButton}
      >
        {sending ? (
          <ActivityIndicator color={Colors.text.inverse} />
        ) : (
          <View style={styles.holdContent}>
            <MaterialIcons name="send" size={20} color={Colors.text.inverse} />
            <Text style={styles.holdText}>Segure para avisar</Text>
          </View>
        )}
      </HoldButton>

      <ThemedButton title="Cancelar" variant="ghost" onPress={onClose} />

      <View style={styles.numbers}>
        <ThemedText variant="label" style={styles.numbersTitle}>
          Em perigo imediato? Ligue agora
        </ThemedText>
        <View style={styles.numbersRow}>
          {EMERGENCY_NUMBERS.map(({ number, label }) => (
            <Pressable
              key={number}
              accessibilityRole="button"
              accessibilityLabel={`Ligar para ${label}, ${number}`}
              onPress={() => Linking.openURL(`tel:${number}`)}
              style={({ pressed }) => [
                styles.numberButton,
                pressed && styles.numberButtonPressed,
              ]}
            >
              <Text style={styles.number}>{number}</Text>
              <ThemedText variant="label">{label}</ThemedText>
            </Pressable>
          ))}
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.dangerTint,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  texts: {
    gap: 8,
  },
  contactName: {
    fontFamily: Fonts.bold,
    color: Colors.text.primary,
  },
  holdButton: {
    minHeight: 64,
    borderRadius: 32,
    backgroundColor: Colors.danger,
  },
  holdContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  holdText: {
    fontFamily: Fonts.extrabold,
    fontSize: 18,
    color: Colors.text.inverse,
  },
  numbers: {
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 16,
    gap: 10,
  },
  numbersTitle: {
    color: Colors.text.secondary,
  },
  numbersRow: {
    flexDirection: "row",
    gap: 8,
  },
  numberButton: {
    flex: 1,
    minHeight: 56,
    borderRadius: 16,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  numberButtonPressed: {
    backgroundColor: Colors.divider,
  },
  number: {
    fontFamily: Fonts.extrabold,
    fontSize: 18,
    color: Colors.text.primary,
  },
});
