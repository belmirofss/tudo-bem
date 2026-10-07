import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { StepHeader } from "./StepHeader";
import { ThemedButton } from "./ThemedButton";
import { ThemedText } from "./ThemedText";
import { ThemeView } from "./ThemeView";

export const ONBOARDING_STEPS = 3;

type Props = {
  step: number;
  overline: string;
  title: string;
  children: React.ReactNode;
  canContinue: boolean;
  onContinue: () => void;
};

export const OnboardingStep = ({
  step,
  overline,
  title,
  children,
  canContinue,
  onContinue,
}: Props) => {
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ThemeView>
        <StepHeader step={step} total={ONBOARDING_STEPS} />

        <View style={styles.texts}>
          <ThemedText variant="overline">{overline}</ThemedText>
          <ThemedText variant="title" accessibilityRole="header">
            {title}
          </ThemedText>
        </View>

        <View style={styles.content}>{children}</View>

        <View style={styles.footer}>
          <ThemedButton
            title="Continuar"
            disabled={!canContinue}
            onPress={onContinue}
          />
        </View>
      </ThemeView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  texts: {
    gap: 12,
    marginTop: 40,
  },
  content: {
    gap: 24,
    marginTop: 32,
  },
  footer: {
    marginTop: "auto",
    paddingTop: 32,
  },
});
