import { ThemedTextInput, ThemedTextInputProps } from "./ThemedTextInput";

export const ThemedEmailInput = (props: ThemedTextInputProps) => {
  return (
    <ThemedTextInput
      keyboardType="email-address"
      autoCapitalize="none"
      autoComplete="email"
      autoCorrect={false}
      placeholder="email@exemplo.com"
      {...props}
    />
  );
};
