import { ThemedButton } from "@/components/ThemedButton";
import { ThemedEmailInput } from "@/components/ThemedEmailInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
import { ThemeView } from "../../../components/ThemeView";
import { isValidProfile } from "../../../helpers/validation";
import { useMe } from "../../../hooks/useMe";
import { useUpdateProfile } from "../../../hooks/useUpdateProfile";

export default function UpdateProfileScreen() {
  const { data, isLoading, error } = useMe();
  const updateProfileMutation = useUpdateProfile();

  const [name, setName] = useState(data?.name || "");
  const [emergencyContactName, setEmergencyContactName] = useState(
    data?.emergencyContactName || "",
  );
  const [emergencyContactEmail, setEmergencyContactEmail] = useState(
    data?.emergencyContactEmail || "",
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

  if (isLoading) {
    return (
      <ThemeView>
        <ThemedText variant="body">Carregando...</ThemedText>
      </ThemeView>
    );
  }

  if (error || !data) {
    return (
      <ThemeView>
        <ThemedText variant="body">Erro ao carregar dados</ThemedText>
      </ThemeView>
    );
  }

  return (
    <ThemeView>
      <View style={styles.inputGroup}>
        <ThemedText variant="body" style={styles.label}>
          Nome
        </ThemedText>
        <ThemedTextInput
          value={name}
          onChangeText={setName}
          placeholder="Seu nome"
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <ThemedText variant="body" style={styles.label}>
          Nome do Contato de Emergência
        </ThemedText>
        <ThemedTextInput
          value={emergencyContactName}
          onChangeText={setEmergencyContactName}
          placeholder="Nome do contato"
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <ThemedText variant="body" style={styles.label}>
          E-mail do Contato de Emergência
        </ThemedText>
        <ThemedEmailInput
          value={emergencyContactEmail}
          onChangeText={setEmergencyContactEmail}
          style={styles.input}
        />
      </View>

      <ThemedButton
        title="Salvar Alterações"
        variant="good"
        onPress={handleUpdateProfile}
        disabled={updateProfileMutation.isPending || !isFormValid}
        style={styles.button}
      />
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    marginBottom: 4,
  },
  button: {
    marginTop: 20,
  },
});
