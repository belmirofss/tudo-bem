import { useRouter } from "expo-router";
import { InfoBox } from "../../components/InfoBox";
import { OnboardingStep } from "../../components/OnboardingStep";
import { ThemedEmailInput } from "../../components/ThemedEmailInput";
import { useOnboarding } from "./context/OnboardingContext";

export default function InputYourEmergencyContactEmail() {
  const router = useRouter();
  const { data, updateEmergencyContactEmail, isValidEmergencyContactEmail } =
    useOnboarding();

  const contactFirstName = data.emergencyContactName.trim().split(" ")[0];
  const handleContinue = () => router.push("/onboarding/review");

  return (
    <OnboardingStep
      step={3}
      overline="Contato de emergência"
      title={
        contactFirstName
          ? `Qual é o e-mail de ${contactFirstName}?`
          : "Qual é o e-mail do seu contato?"
      }
      canContinue={isValidEmergencyContactEmail}
      onContinue={handleContinue}
    >
      <ThemedEmailInput
        label="E-mail do contato"
        size="large"
        value={data.emergencyContactEmail}
        onChangeText={updateEmergencyContactEmail}
        autoFocus
        isValid={isValidEmergencyContactEmail}
        returnKeyType="next"
        onSubmitEditing={() => isValidEmergencyContactEmail && handleContinue()}
      />
      <InfoBox icon="mail-outline">
        Dica: avise essa pessoa que ela é seu contato, assim ela não estranha o
        e-mail se um dia chegar.
      </InfoBox>
    </OnboardingStep>
  );
}
