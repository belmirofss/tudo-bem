import { StyleProp, Text, TextProps, TextStyle } from "react-native";
import { Colors, Fonts } from "../constants";

type TextVariant =
  | "display"
  | "title"
  | "heading"
  | "bodyStrong"
  | "body"
  | "caption"
  | "label"
  | "overline";

type Props = TextProps & {
  children: React.ReactNode;
  variant: TextVariant;
  style?: StyleProp<TextStyle>;
};

const variants: Record<TextVariant, TextStyle> = {
  display: {
    fontFamily: Fonts.extrabold,
    fontSize: 44,
    lineHeight: 48,
    letterSpacing: -1.2,
    color: Colors.text.primary,
  },
  title: {
    fontFamily: Fonts.extrabold,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.6,
    color: Colors.text.primary,
  },
  heading: {
    fontFamily: Fonts.extrabold,
    fontSize: 18,
    lineHeight: 24,
    color: Colors.text.primary,
  },
  bodyStrong: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    lineHeight: 22,
    color: Colors.text.primary,
  },
  body: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    lineHeight: 23,
    color: Colors.text.secondary,
  },
  caption: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text.muted,
  },
  label: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    lineHeight: 18,
    color: Colors.text.muted,
  },
  overline: {
    fontFamily: Fonts.extrabold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: Colors.primary,
  },
};

export const ThemedText = ({ children, variant, style, ...props }: Props) => {
  return (
    <Text style={[variants[variant], style]} {...props}>
      {children}
    </Text>
  );
};
