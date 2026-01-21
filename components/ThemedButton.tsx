import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";

type ButtonVariant = "good" | "bad";
type ButtonSize = "normal" | "large";

type Props = TouchableOpacityProps & {
  title: string;
  variant: ButtonVariant;
  size?: ButtonSize;
};

export const ThemedButton = ({
  title,
  variant,
  size = "normal",
  style,
  ...props
}: Props) => {
  const getButtonStyle = () => {
    const buttonStyle: StyleProp<ViewStyle> = [styles.button];

    if (size === "large") {
      buttonStyle.push(styles.largeButton);
    }

    if (variant === "good") {
      buttonStyle.push(styles.goodButton);
    }

    if (variant === "bad") {
      buttonStyle.push(styles.badButton);
    }

    return buttonStyle;
  };

  return (
    <TouchableOpacity style={[getButtonStyle(), style]} {...props}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 16,
    paddingVertical: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
    width: "100%",
  },
  goodButton: {
    backgroundColor: "#0B6623",
  },
  badButton: {
    backgroundColor: "#990F02",
  },
  largeButton: {
    paddingVertical: 48,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});
