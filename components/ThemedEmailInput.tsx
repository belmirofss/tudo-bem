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
  onChangeText?: (email: string) => void;
  value?: string;
};

export const ThemedEmailInput = ({
  style,
  onChangeText,
  value = "",
  ...props
}: Props) => {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor={Colors.text.secondary}
      value={value}
      onChangeText={onChangeText}
      keyboardType="email-address"
      autoCapitalize="none"
      autoComplete="email"
      placeholder="email@exemplo.com"
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
