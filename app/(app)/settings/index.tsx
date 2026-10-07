import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { ConfirmationModal } from "../../../components/ConfirmationModal";
import { ErrorState } from "../../../components/ErrorState";
import { LoadingState } from "../../../components/LoadingState";
import { ThemedText } from "../../../components/ThemedText";
import { ThemeView } from "../../../components/ThemeView";
import { Colors, DEVICE_ID_KEY, Fonts } from "../../../constants";
import { useDeleteAccount } from "../../../hooks/useDeleteAccount";
import { useMe } from "../../../hooks/useMe";
import { useToggleDevice } from "../../../hooks/useToggleDevice";

const goToEditProfile = () => router.push("/(app)/settings/update-profile");

export default function SettingsScreen() {
  const { data, isLoading, error, refetch } = useMe();
  const deleteAccountMutation = useDeleteAccount();
  const toggleDeviceMutation = useToggleDevice();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showToggleModal, setShowToggleModal] = useState(false);

  const handleToggleDevice = async () => {
    setShowToggleModal(false);
    try {
      const newDisabledState = await toggleDeviceMutation.mutateAsync();

      Toast.show({
        type: "success",
        text1: newDisabledState
          ? "Monitoramento pausado"
          : "Monitoramento ativado",
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro ao alterar o monitoramento!",
      });
    }
  };

  const handleDeleteAccount = async () => {
    setShowDeleteModal(false);
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

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !data) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  const isActive = !data.disabled;

  return (
    <ThemeView withBottomInset={false} contentStyle={styles.content}>
      <ThemedText variant="title" accessibilityRole="header" style={styles.inset}>
        Ajustes
      </ThemedText>

      <View style={[styles.card, styles.profile]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {data.name.trim().charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.flex}>
          <ThemedText variant="heading">{data.name}</ThemedText>
          <ThemedText variant="caption">Check-in a cada 48 horas</ThemedText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Editar dados"
          onPress={goToEditProfile}
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.iconButtonPressed,
          ]}
        >
          <MaterialIcons name="edit" size={20} color={Colors.text.primary} />
        </Pressable>
      </View>

      <View style={styles.section}>
        <ThemedText variant="overline" style={[styles.sectionTitle, styles.inset]}>
          Contato de emergência
        </ThemedText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Contato de emergência: ${data.emergencyContactName}, ${data.emergencyContactEmail}. Editar`}
          onPress={goToEditProfile}
          style={({ pressed }) => [
            styles.card,
            styles.row,
            pressed && styles.rowPressed,
          ]}
        >
          <View style={styles.rowIcon}>
            <MaterialIcons name="person-outline" size={22} color={Colors.primary} />
          </View>
          <View style={styles.flex}>
            <ThemedText variant="bodyStrong">{data.emergencyContactName}</ThemedText>
            <ThemedText variant="caption" numberOfLines={1}>
              {data.emergencyContactEmail}
            </ThemedText>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={Colors.text.subtle} />
        </Pressable>
      </View>

      <View style={styles.section}>
        <ThemedText variant="overline" style={[styles.sectionTitle, styles.inset]}>
          Proteção
        </ThemedText>
        <View style={styles.card}>
          <View style={[styles.row, styles.rowDivider]}>
            <View style={styles.flex}>
              <ThemedText variant="bodyStrong">Monitoramento ativo</ThemedText>
              <ThemedText variant="caption">
                {isActive
                  ? `${data.emergencyContactName} será avisado(a) se você ficar 48h sem responder.`
                  : "Pausado: sem lembretes e sem alertas ao seu contato."}
              </ThemedText>
            </View>
            <Switch
              accessibilityLabel="Monitoramento ativo"
              value={isActive}
              onValueChange={() => setShowToggleModal(true)}
              disabled={toggleDeviceMutation.isPending}
              trackColor={{ false: Colors.disabled, true: Colors.primary }}
              thumbColor={Colors.surface}
              ios_backgroundColor={Colors.disabled}
            />
          </View>
          <View style={styles.row}>
            <View style={styles.flex}>
              <ThemedText variant="bodyStrong">Lembretes</ThemedText>
              <ThemedText variant="caption">
                24h · 12h · 4h · 2h · 1h · 30min · 10min antes do prazo
              </ThemedText>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText variant="overline" style={[styles.sectionTitle, styles.inset]}>
          Conta
        </ThemedText>
        <Pressable
          accessibilityRole="button"
          onPress={() => setShowDeleteModal(true)}
          disabled={deleteAccountMutation.isPending}
          style={({ pressed }) => [
            styles.card,
            styles.row,
            styles.deleteRow,
            pressed && styles.rowPressed,
          ]}
        >
          <MaterialIcons name="delete-outline" size={22} color={Colors.danger} />
          <Text style={styles.deleteText}>Excluir conta</Text>
        </Pressable>
      </View>

      <ConfirmationModal
        visible={showDeleteModal}
        title="Excluir conta?"
        message="Esta ação não pode ser desfeita. Todos os seus dados serão removidos e seu contato não receberá mais alertas."
        confirmText="Sim, excluir"
        icon="delete-outline"
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteModal(false)}
      />
      <ConfirmationModal
        visible={showToggleModal}
        title={isActive ? "Pausar monitoramento?" : "Ativar monitoramento?"}
        message={
          isActive
            ? "Você não receberá lembretes e seu contato de emergência não será notificado enquanto estiver pausado."
            : "Você passará a receber lembretes e seu contato de emergência será notificado se necessário."
        }
        confirmText={isActive ? "Sim, pausar" : "Sim, ativar"}
        tone={isActive ? "danger" : "primary"}
        icon={isActive ? "pause-circle-outline" : "play-circle-outline"}
        onConfirm={handleToggleDevice}
        onCancel={() => setShowToggleModal(false)}
      />
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    gap: 20,
  },
  inset: {
    marginHorizontal: 4,
  },
  flex: {
    flex: 1,
    gap: 2,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: Fonts.extrabold,
    fontSize: 22,
    color: Colors.text.inverse,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  iconButtonPressed: {
    backgroundColor: Colors.divider,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    color: Colors.text.muted,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  rowPressed: {
    backgroundColor: Colors.surfaceMuted,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryTint,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteRow: {
    gap: 12,
  },
  deleteText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.danger,
  },
});
