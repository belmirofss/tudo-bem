import { ConfirmationModal } from "@/components/ConfirmationModal";
import { ThemedButton } from "@/components/ThemedButton";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import { ThemeView } from "../../components/ThemeView";
import { DEVICE_ID_KEY } from "../../constants";
import { useDeleteAccount } from "../../hooks/useDeleteAccount";

export default function SettingsScreen() {
  const deleteAccountMutation = useDeleteAccount();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  return (
    <ThemeView>
      <ThemedButton
        title="Excluir conta"
        variant="bad"
        onPress={handleDeletePress}
        disabled={deleteAccountMutation.isPending}
      />

      <ConfirmationModal
        visible={showDeleteModal}
        title="Excluir conta?"
        message="Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita e todos os seus dados serão permanentemente removidos."
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: "600",
  },
});
