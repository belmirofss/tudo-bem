import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import { Colors, Fonts } from "../constants";
import { ThemedText } from "./ThemedText";

export type ThemedTextInputProps = TextInputProps & {
  label: string;
  helper?: string;
  isValid?: boolean;
  size?: "normal" | "large";
};

export const ThemedTextInput = ({
  label,
  helper,
  isValid = false,
  size = "normal",
  style,
  onFocus,
  onBlur,
  ...props
}: ThemedTextInputProps) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      <ThemedText variant="label" style={styles.label}>
        {label}
      </ThemedText>
      <View>
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={Colors.text.subtle}
          style={[
            styles.input,
            size === "large" && styles.inputLarge,
            focused && styles.inputFocused,
            isValid && styles.inputWithIcon,
            style,
          ]}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
        {isValid && (
          <View style={styles.icon}>
            <MaterialIcons name="check" size={22} color={Colors.primary} />
          </View>
        )}
      </View>
      {helper && <ThemedText variant="caption">{helper}</ThemedText>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
    width: "100%",
  },
  label: {
    color: Colors.text.secondary,
  },
  input: {
    minHeight: 56,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.track,
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    fontFamily: Fonts.semibold,
    fontSize: 17,
    color: Colors.text.primary,
  },
  inputLarge: {
    minHeight: 60,
    fontSize: 19,
  },
  inputFocused: {
    borderColor: Colors.primary,
    boxShadow: `0 0 0 4px ${Colors.primaryRing}`,
  },
  inputWithIcon: {
    paddingRight: 48,
  },
  icon: {
    pointerEvents: "none",
    position: "absolute",
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
});
