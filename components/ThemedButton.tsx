import { MaterialIcons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { Colors, Fonts } from "../constants";

type ButtonVariant = "primary" | "danger" | "dangerOutline" | "ghost";

type Props = Omit<PressableProps, "style"> & {
  title: string;
  variant?: ButtonVariant;
  icon?: keyof typeof MaterialIcons.glyphMap;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

const palette: Record<
  ButtonVariant,
  { background: string; pressed: string; text: string; border?: string }
> = {
  primary: {
    background: Colors.primary,
    pressed: Colors.primaryDark,
    text: Colors.text.inverse,
  },
  danger: {
    background: Colors.danger,
    pressed: Colors.dangerDark,
    text: Colors.text.inverse,
  },
  dangerOutline: {
    background: "transparent",
    pressed: Colors.dangerTint,
    text: Colors.danger,
    border: Colors.danger,
  },
  ghost: {
    background: "transparent",
    pressed: Colors.divider,
    text: Colors.text.secondary,
  },
};

export const ThemedButton = ({
  title,
  variant = "primary",
  icon,
  loading = false,
  disabled,
  style,
  ...props
}: Props) => {
  const colors = palette[variant];
  const isDisabled = disabled || loading;
  const isFilled = variant === "primary" || variant === "danger";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        variant === "ghost" && styles.ghost,
        {
          backgroundColor: pressed ? colors.pressed : colors.background,
          borderColor: colors.border ?? "transparent",
        },
        isDisabled && isFilled && styles.disabledFilled,
        isDisabled && !isFilled && styles.disabledOutline,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <View style={styles.content}>
          {icon && <MaterialIcons name={icon} size={20} color={colors.text} />}
          <Text style={[styles.text, { color: colors.text }]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 60,
    borderRadius: 30,
    borderWidth: 2,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  ghost: {
    minHeight: 48,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: {
    fontFamily: Fonts.bold,
    fontSize: 18,
  },
  disabledFilled: {
    backgroundColor: Colors.disabled,
  },
  disabledOutline: {
    opacity: 0.5,
  },
});
