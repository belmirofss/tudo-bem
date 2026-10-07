import { StyleSheet, View } from "react-native";
import { Colors } from "../constants";
import { BackButton } from "./BackButton";
import { ThemedText } from "./ThemedText";

type Props = {
  // 1-based; pass `total + 1` for the review step
  step: number;
  total: number;
  label?: string;
};

export const StepHeader = ({ step, total, label }: Props) => {
  return (
    <View style={styles.container}>
      <BackButton />
      <View
        style={styles.bars}
        accessible
        accessibilityLabel={label ?? `Passo ${step} de ${total}`}
      >
        {Array.from({ length: total }, (_, index) => (
          <View
            key={index}
            style={[styles.bar, index < step && styles.barActive]}
          />
        ))}
      </View>
      <ThemedText variant="label">{label ?? `${step} de ${total}`}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 48,
  },
  bars: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
  },
  bar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.track,
  },
  barActive: {
    backgroundColor: Colors.primary,
  },
});
