import * as Haptics from "expo-haptics";
import { useRef } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";

type Props = {
  children: React.ReactNode;
  onComplete: () => void;
  accessibilityLabel: string;
  accessibilityHint?: string;
  duration?: number;
  disabled?: boolean;
  fillColor: string;
  fillDirection?: "up" | "right";
  style?: StyleProp<ViewStyle>;
};

/**
 * A button that only fires after being held for `duration` ms, to avoid
 * accidental taps. Screen reader users trigger it with a regular activation.
 */
export const HoldButton = ({
  children,
  onComplete,
  accessibilityLabel,
  accessibilityHint,
  duration = 800,
  disabled = false,
  fillColor,
  fillDirection = "up",
  style,
}: Props) => {
  const progress = useRef(new Animated.Value(0)).current;
  const animation = useRef<Animated.CompositeAnimation | null>(null);

  const complete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onComplete();
  };

  const handlePressIn = () => {
    Haptics.selectionAsync();
    animation.current = Animated.timing(progress, {
      toValue: 1,
      duration,
      easing: Easing.linear,
      useNativeDriver: true,
    });
    animation.current.start(({ finished }) => {
      animation.current = null;
      if (finished) {
        progress.setValue(0);
        complete();
      }
    });
  };

  const handlePressOut = () => {
    if (!animation.current) {
      return;
    }
    animation.current.stop();
    animation.current = null;
    Animated.timing(progress, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const fillTransform =
    fillDirection === "up"
      ? { transform: [{ scaleY: progress }], transformOrigin: "bottom" }
      : { transform: [{ scaleX: progress }], transformOrigin: "left" };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      accessibilityActions={[{ name: "activate" }]}
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === "activate" && !disabled) {
          complete();
        }
      }}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.container, style]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: fillColor, pointerEvents: "none" },
          fillTransform,
        ]}
      />
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
});
