import { Text, TextStyle } from "react-native";
import { Colors } from "../constants";

type TextVariant = "title" | "strongBody" | "body" | "secondaryBody";

type Props = {
  children: React.ReactNode;
  variant: TextVariant;
  style?: TextStyle;
};

export const ThemedText = ({ children, variant, style }: Props) => {
  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case "title":
        return {
          fontSize: 36,
          fontWeight: "bold",
          color: Colors.text.primary,
        };
      case "strongBody":
        return {
          fontSize: 22,
          fontWeight: "bold",
          color: Colors.text.primary,
        };
      case "body":
        return {
          fontSize: 18,
          fontWeight: "600",
          color: Colors.text.primary,
        };
      case "secondaryBody":
        return {
          fontSize: 16,
          fontWeight: "600",
          color: Colors.text.secondary,
        };
      default:
        return {
          fontSize: 16,
          color: Colors.text.primary,
        };
    }
  };

  return <Text style={[getTextStyle(), style]}>{children}</Text>;
};
