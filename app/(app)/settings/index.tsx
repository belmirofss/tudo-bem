import { ConfirmationModal } from "@/components/ConfirmationModal";
import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
import { ThemeView } from "../../../components/ThemeView";
import { Colors, DEVICE_ID_KEY } from "../../../constants";

import { useDeleteAccount } from "../../../hooks/useDeleteAccount";
import { useMe } from "../../../hooks/useMe";
import { useToggleDevice } from "../../../hooks/useToggleDevice";

export default function SettingsScreen() {
  const { data, isLoading, error } = useMe();
  const deleteAccountMutation = useDeleteAccount();
  const toggleDeviceMutation = useToggleDevice();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showToggleModal, setShowToggleModal] = useState(false);

  const handleToggleDevice = async () => {
    try {
      const newDisabledState = await toggleDeviceMutation.mutateAsync();

      Toast.show({
        type: "success",
        text1: newDisabledState
          ? "Dispositivo desativado"
          : "Dispositivo ativado",
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro ao alterar estado do dispositivo!",
      });
    }
  };

  const handleTogglePress = () => {
    setShowToggleModal(true);
  };

  const handleToggleConfirm = () => {
    setShowToggleModal(false);
    handleToggleDevice();
  };

  const handleToggleCancel = () => {
    setShowToggleModal(false);
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccountMutation.mutateAsync();

      // Delete device ID from secure storage
      await SecureStore.deleteItemAsync(DEVICE_ID_KEY);

      Toast.show({
        type: "success",
        text1: "Conta excluída com sucesso!",
      });

      // Redirect to onboarding
      router.replace("/onboarding/welcome");
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro ao excluir conta!",
      });
    }
  };

  const handleDeletePress = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    handleDeleteAccount();
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !data) {
    return <ErrorState />;
  }

  return (
    <ThemeView>
      <View style={styles.container}>
        <View style={styles.section}>
          <ThemedText variant="strongBody" style={styles.sectionTitle}>
            Informações da Conta
          </ThemedText>

          <View style={styles.infoContainer}>
            {[
              ["Nome", data.name],
              ["Contato de Emergência", data.emergencyContactName],
              ["E-mail do Contato de Emergência", data.emergencyContactEmail],
            ].map(([title, value]) => (
              <View key={title} style={styles.infoItem}>
                <ThemedText variant="body">{title}</ThemedText>
                <ThemedText variant="strongBody">{value}</ThemedText>
              </View>
            ))}
            <View style={styles.infoItem}>
              <ThemedText variant="body">Status do Dispositivo</ThemedText>
              <ThemedText
                variant="strongBody"
                style={
                  data?.disabled ? styles.disabledStatus : styles.enabledStatus
                }
              >
                {data?.disabled ? "Desativado" : "Ativado"}
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText variant="strongBody" style={styles.sectionTitle}>
            Ações
          </ThemedText>
          <ThemedButton
            title="Atualizar dados"
            variant="neutral"
            onPress={() => router.push("/(app)/settings/update-profile")}
            style={styles.buttonSpacing}
            disabled={deleteAccountMutation.isPending}
          />
          <ThemedButton
            title={
              data?.disabled ? "Ativar dispositivo" : "Desativar dispositivo"
            }
            variant={data?.disabled ? "good" : "bad"}
            onPress={handleTogglePress}
            style={styles.buttonSpacing}
            disabled={toggleDeviceMutation.isPending}
          />
          <ThemedButton
            title="Excluir conta"
            variant="bad"
            onPress={handleDeletePress}
            disabled={deleteAccountMutation.isPending}
          />
        </View>
      </View>

      <ConfirmationModal
        visible={showDeleteModal}
        title="Excluir conta?"
        message="Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita e todos os seus dados serão permanentemente removidos."
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
      <ConfirmationModal
        visible={showToggleModal}
        title={
          data?.disabled ? "Ativar dispositivo?" : "Desativar dispositivo?"
        }
        message={
          data?.disabled
            ? "Tem certeza que deseja ativar seu dispositivo? Você passará a receber lembretes e seu contato de emergência será notificado se necessário."
            : "Tem certeza que deseja desativar seu dispositivo? Seu contato de emergência não será notificado e você não receberá lembretes."
        }
        confirmText={data?.disabled ? "Sim, ativar" : "Sim, desativar"}
        cancelText="Cancelar"
        onConfirm={handleToggleConfirm}
        onCancel={handleToggleCancel}
      />
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  infoContainer: {
    marginTop: 16,
    gap: 16,
  },
  infoItem: {
    gap: 4,
  },
  buttonSpacing: {
    marginBottom: 12,
  },
  enabledStatus: {
    color: Colors.button.good,
  },
  disabledStatus: {
    color: Colors.button.bad,
  },
});
