import { useRouter } from "expo-router";
import { InfoBox } from "../../components/InfoBox";
import { OnboardingStep } from "../../components/OnboardingStep";
import { ThemedTextInput } from "../../components/ThemedTextInput";
import { useOnboarding } from "./context/OnboardingContext";

export default function InputYourEmergencyContactName() {
  const router = useRouter();
  const { updateEmergencyContactName, data, isValidEmergencyContactName } =
    useOnboarding();

  const handleContinue = () =>
    router.push("/onboarding/input-your-emergency-contact-email");

  return (
    <OnboardingStep
      step={2}
      overline="Contato de emergência"
      title="Quem devemos avisar se você não responder?"
      canContinue={isValidEmergencyContactName}
      onContinue={handleContinue}
    >
      <ThemedTextInput
        label="Nome do contato"
        size="large"
        value={data.emergencyContactName}
        onChangeText={updateEmergencyContactName}
        placeholder="Digite o nome do contato"
        autoCapitalize="words"
        autoFocus
        isValid={isValidEmergencyContactName}
        returnKeyType="next"
        onSubmitEditing={() => isValidEmergencyContactName && handleContinue()}
      />
      <InfoBox icon="shield">
        Essa pessoa só recebe um e-mail se você ficar 48 horas sem responder ou
        tocar em “Não estou bem”.
      </InfoBox>
    </OnboardingStep>
  );
}
