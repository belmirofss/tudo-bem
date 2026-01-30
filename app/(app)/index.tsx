import { ConfirmationModal } from "@/components/ConfirmationModal";
import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
import { ThemeView } from "../../components/ThemeView";
import { formatDate } from "../../helpers/formatDate";
import { useCheckin } from "../../hooks/useCheckin";
import { useMe } from "../../hooks/useMe";

export default function HomeScreen() {
  const { data, isLoading, error } = useMe();
  const checkinMutation = useCheckin();
  const [showNotWellModal, setShowNotWellModal] = useState(false);

  const handleCheckin = async () => {
    try {
      await checkinMutation.mutateAsync();

      Toast.show({
        type: "success",
        text1: "Checkin realizado com sucesso!",
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro ao realizar checkin!",
      });
    }
  };

  const handleNotWellPress = () => {
    setShowNotWellModal(true);
  };

  const handleNotWellConfirm = () => {
    setShowNotWellModal(false);
    // Here you can add what happens when user confirms they're not well
    // For now, just show a toast message
    Toast.show({
      type: "info",
      text1: "Enviamos uma notificação para seu contato de emergência.",
      text2: "Mantenha-se seguro e procure ajuda se necessário.",
    });
  };

  const handleNotWellCancel = () => {
    setShowNotWellModal(false);
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
        <View>
          <ThemedText variant="title">Tudo bem?</ThemedText>
        </View>

        <View style={styles.buttonContainer}>
          <ThemedButton
            title="Sim, estou bem 👍"
            variant="good"
            size="large"
            onPress={handleCheckin}
            disabled={checkinMutation.isPending}
          />
          <ThemedButton
            title="Não estou bem"
            variant="bad"
            onPress={handleNotWellPress}
            disabled={checkinMutation.isPending}
          />
        </View>
        <ThemedText variant="secondaryBody">
          Se não responder até {formatDate(data.checkinUntil)}, uma e-mail será
          enviado para seu contato de emergência.
        </ThemedText>
        <ThemedText variant="secondaryBody">
          Última resposta: {formatDate(data.lastCheckinAt)}
        </ThemedText>
      </View>

      <ConfirmationModal
        visible={showNotWellModal}
        title="Você não está bem?"
        message="Deseja enviar uma notificação imediata para seu contato de emergência? Ele será informado que você precisa de ajuda."
        confirmText="Sim, notificar"
        cancelText="Cancelar"
        onConfirm={handleNotWellConfirm}
        onCancel={handleNotWellCancel}
      />
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-end",
    gap: 12,
  },
  buttonContainer: {
    flexDirection: "column",
    gap: 8,
    width: "100%",
  },
});
