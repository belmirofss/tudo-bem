import { useRouter } from "expo-router";
import { OnboardingStep } from "../../components/OnboardingStep";
import { ThemedTextInput } from "../../components/ThemedTextInput";
import { useOnboarding } from "./context/OnboardingContext";

export default function InputYourName() {
  const router = useRouter();
  const { updateName, data, isValidName } = useOnboarding();

  const handleContinue = () =>
    router.push("/onboarding/input-your-emergency-contact-name");

  return (
    <OnboardingStep
      step={1}
      overline="Sobre você"
      title="Como podemos te chamar?"
      canContinue={isValidName}
      onContinue={handleContinue}
    >
      <ThemedTextInput
        label="Seu nome"
        size="large"
        value={data.name}
        onChangeText={updateName}
        placeholder="Digite seu nome"
        autoCapitalize="words"
        autoComplete="name"
        autoFocus
        isValid={isValidName}
        returnKeyType="next"
        onSubmitEditing={() => isValidName && handleContinue()}
      />
    </OnboardingStep>
  );
}
