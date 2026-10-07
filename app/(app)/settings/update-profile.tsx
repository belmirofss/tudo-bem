import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
import { BackButton } from "../../../components/BackButton";
import { ErrorState } from "../../../components/ErrorState";
import { InfoBox } from "../../../components/InfoBox";
import { LoadingState } from "../../../components/LoadingState";
import { ThemedButton } from "../../../components/ThemedButton";
import { ThemedEmailInput } from "../../../components/ThemedEmailInput";
import { ThemedText } from "../../../components/ThemedText";
import { ThemedTextInput } from "../../../components/ThemedTextInput";
import { ThemeView } from "../../../components/ThemeView";
import { Colors } from "../../../constants";
import {
  isValidEmail,
  isValidEmergencyContactName,
  isValidName,
  isValidProfile,
} from "../../../helpers/validation";
import { useMe } from "../../../hooks/useMe";
import { useUpdateProfile } from "../../../hooks/useUpdateProfile";

export default function UpdateProfileScreen() {
  const { data, isLoading, error, refetch } = useMe();

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !data) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  // Mount the form only once data exists, so the inputs start filled in
  return <UpdateProfileForm initial={data} />;
}

type FormValues = {
  name: string;
  emergencyContactName: string;
  emergencyContactEmail: string;
};

function UpdateProfileForm({ initial }: { initial: FormValues }) {
  const updateProfileMutation = useUpdateProfile();

  const [name, setName] = useState(initial.name);
  const [emergencyContactName, setEmergencyContactName] = useState(
    initial.emergencyContactName,
  );
  const [emergencyContactEmail, setEmergencyContactEmail] = useState(
    initial.emergencyContactEmail,
  );

  const isFormValid = isValidProfile(
    name,
    emergencyContactName,
    emergencyContactEmail,
  );

  const handleUpdateProfile = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        name,
        emergencyContactName,
        emergencyContactEmail,
      });

      Toast.show({
        type: "success",
        text1: "Dados atualizados!",
      });

      router.back();
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro ao atualizar dados!",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ThemeView withBottomInset={false}>
        <View style={styles.header}>
          <BackButton />
          <ThemedText variant="heading" accessibilityRole="header">
            Editar dados
          </ThemedText>
        </View>

        <View style={styles.form}>
          <ThemedTextInput
            label="Seu nome"
            value={name}
            onChangeText={setName}
            placeholder="Seu nome"
            autoCapitalize="words"
            isValid={isValidName(name)}
          />

          <View style={styles.divider} />

          <ThemedTextInput
            label="Nome do contato de emergência"
            value={emergencyContactName}
            onChangeText={setEmergencyContactName}
            placeholder="Nome do contato"
            autoCapitalize="words"
            isValid={isValidEmergencyContactName(emergencyContactName)}
          />
          <ThemedEmailInput
            label="E-mail do contato"
            value={emergencyContactEmail}
            onChangeText={setEmergencyContactEmail}
            isValid={isValidEmail(emergencyContactEmail)}
            helper={
              emergencyContactEmail && !isValidEmail(emergencyContactEmail)
                ? "Confira o e-mail: parece estar incompleto."
                : undefined
            }
          />
        </View>

        <View style={styles.info}>
          <InfoBox icon="info-outline" tone="surface">
            Mudou o contato? Avise a nova pessoa que ela foi escolhida, assim
            ela não estranha o e-mail se um dia chegar.
          </InfoBox>
        </View>

        <View style={styles.footer}>
          <ThemedButton
            title="Salvar alterações"
            onPress={handleUpdateProfile}
            loading={updateProfileMutation.isPending}
            disabled={!isFormValid}
          />
        </View>
      </ThemeView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 48,
  },
  form: {
    marginTop: 28,
    gap: 20,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.track,
  },
  info: {
    marginTop: 24,
  },
  footer: {
    marginTop: "auto",
    paddingTop: 32,
  },
});
