import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import { Colors } from "../constants";

type ButtonVariant = "good" | "bad" | "neutral" | "link";
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

    if (variant === "neutral") {
      buttonStyle.push(styles.neutralButton);
    }

    if (variant === "link") {
      buttonStyle.push(styles.linkButton);
    }

    if (props.disabled) {
      buttonStyle.push(styles.disabledButton);
    }

    return buttonStyle;
  };

  const getTextStyle = () => {
    const textStyle: StyleProp<TextStyle> = [styles.buttonText];

    if (props.disabled) {
      textStyle.push(styles.disabledButtonText);
    }

    if (variant === "link") {
      textStyle.push(styles.linkButtonText);
    }

    return textStyle;
  };

  return (
    <TouchableOpacity style={[getButtonStyle(), style]} {...props}>
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 16,
    paddingVertical: 24,
    borderRadius: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
    width: "100%",
  },
  goodButton: {
    backgroundColor: Colors.button.good,
  },
  badButton: {
    backgroundColor: Colors.button.bad,
  },
  neutralButton: {
    backgroundColor: Colors.button.neutral,
  },
  linkButton: {
    backgroundColor: "transparent",
    shadowOpacity: 0,
    elevation: 0,
  },
  largeButton: {
    paddingVertical: 48,
  },
  disabledButton: {
    backgroundColor: Colors.button.disabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: Colors.text.white,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  disabledButtonText: {
    color: Colors.text.disabled,
  },
  linkButtonText: {
    color: Colors.text.secondary,
  },
});
