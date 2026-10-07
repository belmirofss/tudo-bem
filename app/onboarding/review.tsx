import { MaterialIcons } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Pressable, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
import { ONBOARDING_STEPS } from "../../components/OnboardingStep";
import { StepHeader } from "../../components/StepHeader";
import { ThemedButton } from "../../components/ThemedButton";
import { ThemedText } from "../../components/ThemedText";
import { ThemeView } from "../../components/ThemeView";
import { Colors, DEVICE_ID_KEY } from "../../constants";
import { initializeNotifications } from "../../helpers/notifications";
import { useRegister } from "../../hooks/useRegister";
import { useOnboarding } from "./context/OnboardingContext";

export default function Review() {
  const { data } = useOnboarding();
  const registerMutation = useRegister();

  const rows: { label: string; value: string; href: Href }[] = [
    { label: "Você", value: data.name, href: "/onboarding/input-your-name" },
    {
      label: "Contato de emergência",
      value: data.emergencyContactName,
      href: "/onboarding/input-your-emergency-contact-name",
    },
    {
      label: "E-mail do contato",
      value: data.emergencyContactEmail,
      href: "/onboarding/input-your-emergency-contact-email",
    },
  ];

  const handleConfirm = async () => {
    try {
      // Get FCM token for push notifications
      const fcmToken = await initializeNotifications();

      const result = await registerMutation.mutateAsync({
        name: data.name,
        emergencyContactName: data.emergencyContactName,
        emergencyContactEmail: data.emergencyContactEmail,
        fcmToken: fcmToken || undefined,
      });

      await SecureStore.setItemAsync(DEVICE_ID_KEY, result.deviceId);

      Toast.show({
        type: "success",
        text1: "Tudo pronto! Proteção ativada.",
      });

      setTimeout(() => {
        router.replace("/(app)");
      }, 1000);
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro ao registrar!",
        text2: "Verifique sua conexão e tente novamente.",
      });
    }
  };

  return (
    <ThemeView>
      <StepHeader
        step={ONBOARDING_STEPS}
        total={ONBOARDING_STEPS}
        label="Revisão"
      />

      <ThemedText
        variant="title"
        accessibilityRole="header"
        style={styles.title}
      >
        Tudo certo por aqui?
      </ThemedText>

      <View style={styles.card}>
        {rows.map(({ label, value, href }, index) => (
          <View
            key={label}
            style={[styles.row, index < rows.length - 1 && styles.rowDivider]}
          >
            <View style={styles.rowTexts}>
              <ThemedText variant="label">{label}</ThemedText>
              <ThemedText variant="bodyStrong" style={styles.rowValue}>
                {value}
              </ThemedText>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Editar ${label.toLowerCase()}`}
              onPress={() => router.dismissTo(href)}
              style={({ pressed }) => [
                styles.editButton,
                pressed && styles.editButtonPressed,
              ]}
            >
              <MaterialIcons name="edit" size={20} color={Colors.primary} />
            </Pressable>
          </View>
        ))}
      </View>

      <ThemedText variant="label" style={styles.previewTitle}>
        O que {data.emergencyContactName.trim().split(" ")[0]} recebe se você
        não responder
      </ThemedText>
      <View style={styles.preview}>
        <View style={styles.previewMeta}>
          <MaterialIcons name="mail-outline" size={16} color={Colors.text.muted} />
          <ThemedText variant="label" style={styles.previewMetaText}>
            Tudo bem? · para {data.emergencyContactEmail}
          </ThemedText>
        </View>
        <ThemedText variant="bodyStrong">
          Alerta de segurança - {data.name}
        </ThemedText>
        <ThemedText variant="caption">
          Olá, {data.emergencyContactName.trim().split(" ")[0]}.{" "}
          {data.name.trim().split(" ")[0]} usa o app Tudo bem? para confirmar
          que está tudo certo a cada 48 horas e indicou você como contato de
          emergência. O prazo terminou sem nenhuma resposta.
        </ThemedText>
      </View>

      <View style={styles.notice}>
        <MaterialIcons name="notifications-none" size={20} color={Colors.primary} />
        <ThemedText variant="caption" style={styles.noticeText}>
          Em seguida, pediremos permissão para enviar lembretes.
        </ThemedText>
      </View>

      <View style={styles.footer}>
        <ThemedButton
          title="Confirmar e ativar"
          loading={registerMutation.isPending}
          onPress={handleConfirm}
        />
      </View>
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 28,
  },
  card: {
    marginTop: 20,
    backgroundColor: Colors.surface,
    borderRadius: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingLeft: 18,
    paddingRight: 8,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  rowTexts: {
    flex: 1,
    gap: 2,
  },
  rowValue: {
    fontSize: 17,
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  editButtonPressed: {
    backgroundColor: Colors.primaryTint,
  },
  previewTitle: {
    marginTop: 24,
    color: Colors.text.secondary,
  },
  preview: {
    marginTop: 10,
    padding: 16,
    gap: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceMuted,
  },
  previewMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  previewMetaText: {
    flex: 1,
  },
  notice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 16,
  },
  noticeText: {
    flex: 1,
    color: Colors.text.secondary,
  },
  footer: {
    marginTop: "auto",
    paddingTop: 32,
  },
});
