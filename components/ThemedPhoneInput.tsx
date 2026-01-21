import { useState } from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  ViewStyle,
} from "react-native";
import { Colors } from "../constants";

type Props = TextInputProps & {
  style?: StyleProp<ViewStyle>;
  onChangeText?: (digits: string) => void;
  value?: string; // Raw digits value
};

export const ThemedPhoneInput = ({
  style,
  onChangeText,
  value = "",
  ...props
}: Props) => {
  const [displayValue, setDisplayValue] = useState("");

  const formatPhoneMask = (inputValue: string): string => {
    // Remove all non-digit characters
    const digits = inputValue.replace(/\D/g, "");

    // Limit to 11 digits
    const limitedDigits = digits.slice(0, 11);

    // Apply mask based on length
    if (limitedDigits.length <= 2) {
      return limitedDigits;
    } else if (limitedDigits.length <= 7) {
      return `(${limitedDigits.slice(0, 2)}) ${limitedDigits.slice(2)}`;
    } else {
      // Check if it's a 9-digit number (8 or 9 after DDD)
      const afterDDD = limitedDigits.slice(2);
      if (afterDDD.length === 9 && afterDDD[0] === "9") {
        return `(${limitedDigits.slice(0, 2)}) ${afterDDD.slice(0, 5)}-${afterDDD.slice(5)}`;
      } else {
        return `(${limitedDigits.slice(0, 2)}) ${afterDDD.slice(0, 4)}-${afterDDD.slice(4)}`;
      }
    }
  };

  const handleTextChange = (text: string) => {
    const formatted = formatPhoneMask(text);
    setDisplayValue(formatted);

    // Store only digits
    const digits = text.replace(/\D/g, "");
    onChangeText?.(digits);
  };

  // Update display value when prop value changes
  const currentDisplayValue = value ? formatPhoneMask(value) : displayValue;

  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor={Colors.text.secondary}
      value={currentDisplayValue}
      onChangeText={handleTextChange}
      keyboardType="phone-pad"
      placeholder="(99) 99999-9999"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: Colors.text.secondary,
    borderRadius: 16,
    padding: 18,
    fontSize: 18,
    backgroundColor: Colors.text.white,
    color: Colors.text.primary,
  },
});
