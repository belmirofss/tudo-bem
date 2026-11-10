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
      <View
        style={[
          styles.field,
          size === "large" && styles.fieldLarge,
          focused && styles.fieldFocused,
        ]}
      >
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={Colors.text.subtle}
          style={[styles.input, size === "large" && styles.inputLarge, style]}
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
          <MaterialIcons
            name="check"
            size={22}
            color={Colors.primary}
            style={styles.icon}
          />
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
  // The border, background and padding live on a wrapper View because
  // Android doesn't reliably apply horizontal padding to a styled TextInput.
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 56,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.track,
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
  },
  fieldLarge: {
    minHeight: 60,
  },
  fieldFocused: {
    borderColor: Colors.primary,
    boxShadow: `0 0 0 4px ${Colors.primaryRing}`,
  },
  input: {
    flex: 1,
    alignSelf: "stretch",
    padding: 0,
    fontFamily: Fonts.semibold,
    fontSize: 17,
    color: Colors.text.primary,
  },
  inputLarge: {
    fontSize: 19,
  },
  icon: {
    pointerEvents: "none",
  },
});
