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
};

export const ThemedTextInput = ({ style, ...props }: Props) => {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor={Colors.text.secondary}
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
