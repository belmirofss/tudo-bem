import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { EmergencySheet } from "../../components/EmergencySheet";
import { ErrorState } from "../../components/ErrorState";
import { HoldButton } from "../../components/HoldButton";
import { LoadingState } from "../../components/LoadingState";
import { ProgressRing } from "../../components/ProgressRing";
import { ThemedButton } from "../../components/ThemedButton";
import { ThemedText } from "../../components/ThemedText";
import { ThemeView } from "../../components/ThemeView";
import { CHECKIN_INTERVAL_HOURS, Colors, Fonts } from "../../constants";
import {
  formatRemaining,
  formatShortDateTime,
  greeting,
} from "../../helpers/formatDate";
import { useCheckin } from "../../hooks/useCheckin";
import { useMe } from "../../hooks/useMe";
import { useNow } from "../../hooks/useNow";
import { useSendEmergencyAlert } from "../../hooks/useSendEmergencyAlert";

const INTERVAL_MS = CHECKIN_INTERVAL_HOURS * 60 * 60 * 1000;

export default function HomeScreen() {
  const { data, isLoading, error, refetch } = useMe();
  const checkinMutation = useCheckin();
  const emergencyAlertMutation = useSendEmergencyAlert();
  const [showEmergency, setShowEmergency] = useState(false);
  const [justCheckedIn, setJustCheckedIn] = useState(false);
  const now = useNow();
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (!justCheckedIn) {
      return;
    }
    const id = setTimeout(() => setJustCheckedIn(false), 3000);
    return () => clearTimeout(id);
  }, [justCheckedIn]);

  const handleCheckin = async () => {
    try {
      await checkinMutation.mutateAsync();
      setJustCheckedIn(true);

      Toast.show({
        type: "success",
        text1: "Check-in feito!",
        text2: "Obrigado por avisar que está tudo bem.",
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro ao realizar check-in!",
        text2: "Verifique sua conexão e tente novamente.",
      });
    }
  };

  const handleSendAlert = async () => {
    try {
      await emergencyAlertMutation.mutateAsync();
      setShowEmergency(false);

      Toast.show({
        type: "success",
        text1: `${data?.emergencyContactName} foi avisado(a)`,
        text2: "Enviamos um e-mail pedindo que entre em contato.",
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Erro ao enviar alerta!",
        text2: "Se for urgente, ligue para 192.",
      });
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !data) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  const remainingMs = new Date(data.checkinUntil).getTime() - now;
  const isOverdue = remainingMs <= 0;
  const isPaused = data.disabled;
  const ringSize = Math.min(290, width - 48);
  const buttonSize = ringSize - 90;

  const caption = isPaused
    ? "Monitoramento pausado. Reative em Ajustes."
    : isOverdue
      ? "O prazo acabou. Confirme agora que está tudo bem."
      : `restantes · responda até ${formatShortDateTime(data.checkinUntil).toLowerCase()}`;

  return (
    <ThemeView withBottomInset={false}>
      <View style={styles.header}>
        <View>
          <ThemedText variant="caption">{greeting()}</ThemedText>
          <ThemedText variant="title" style={styles.name}>
            {data.name}
          </ThemedText>
        </View>
        <View
          style={[styles.statusPill, isPaused && styles.statusPillPaused]}
          accessible
          accessibilityLabel={isPaused ? "Monitoramento pausado" : "Protegido"}
        >
          <View style={[styles.statusDot, isPaused && styles.statusDotPaused]} />
          <Text style={[styles.statusText, isPaused && styles.statusTextPaused]}>
            {isPaused ? "Pausado" : "Protegido"}
          </Text>
        </View>
      </View>

      <View style={styles.center}>
        <View style={{ width: ringSize, height: ringSize }}>
          <ProgressRing
            size={ringSize}
            strokeWidth={16}
            progress={isPaused ? 0 : remainingMs / INTERVAL_MS}
          />
          <View style={styles.ringCenter}>
            <HoldButton
              accessibilityLabel="Estou bem"
              accessibilityHint="Toque e segure para fazer o check-in"
              onComplete={handleCheckin}
              disabled={checkinMutation.isPending}
              fillColor={Colors.primaryDark}
              style={[
                styles.checkinButton,
                {
                  width: buttonSize,
                  height: buttonSize,
                  borderRadius: buttonSize / 2,
                },
              ]}
            >
              {checkinMutation.isPending ? (
                <ActivityIndicator size="large" color={Colors.text.inverse} />
              ) : (
                <View style={styles.checkinContent}>
                  <MaterialIcons
                    name="check"
                    size={44}
                    color={Colors.text.inverse}
                  />
                  <Text style={styles.checkinLabel}>
                    {justCheckedIn ? "Feito!" : "Estou bem"}
                  </Text>
                  <Text style={styles.checkinHint}>Toque e segure</Text>
                </View>
              )}
            </HoldButton>
          </View>
        </View>

        <View style={styles.countdown}>
          {!isPaused && (
            <Text
              style={[styles.countdownValue, isOverdue && styles.overdue]}
              accessibilityLabel={`Faltam ${formatRemaining(remainingMs)}`}
            >
              {formatRemaining(remainingMs)}
            </Text>
          )}
          <ThemedText variant="caption" style={styles.countdownCaption}>
            {caption}
          </ThemedText>
        </View>
      </View>

      <View style={styles.bottom}>
        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <ThemedText variant="label" style={styles.infoLabel}>
              Último check-in
            </ThemedText>
            <ThemedText variant="bodyStrong" style={styles.infoValue}>
              {formatShortDateTime(data.lastCheckinAt)}
            </ThemedText>
          </View>
          <View style={styles.infoCard}>
            <ThemedText variant="label" style={styles.infoLabel}>
              Contato
            </ThemedText>
            <ThemedText
              variant="bodyStrong"
              style={styles.infoValue}
              numberOfLines={1}
            >
              {data.emergencyContactName}
            </ThemedText>
          </View>
        </View>

        <ThemedButton
          title="Não estou bem"
          variant="dangerOutline"
          icon="warning-amber"
          onPress={() => setShowEmergency(true)}
          disabled={emergencyAlertMutation.isPending}
          style={styles.notWellButton}
        />
      </View>

      <EmergencySheet
        visible={showEmergency}
        contactName={data.emergencyContactName}
        sending={emergencyAlertMutation.isPending}
        onSend={handleSendAlert}
        onClose={() => setShowEmergency(false)}
      />
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  name: {
    fontSize: 26,
    lineHeight: 32,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: Colors.primaryTint,
  },
  statusPillPaused: {
    backgroundColor: Colors.divider,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  statusDotPaused: {
    backgroundColor: Colors.text.muted,
  },
  statusText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: Colors.primary,
  },
  statusTextPaused: {
    color: Colors.text.muted,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    paddingVertical: 24,
  },
  ringCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  checkinButton: {
    backgroundColor: Colors.primary,
    boxShadow: "0 16px 40px rgba(15, 107, 92, 0.35)",
  },
  checkinContent: {
    alignItems: "center",
    gap: 4,
  },
  checkinLabel: {
    fontFamily: Fonts.extrabold,
    fontSize: 24,
    color: Colors.text.inverse,
  },
  checkinHint: {
    fontFamily: Fonts.semibold,
    fontSize: 13,
    color: Colors.text.inverse,
    opacity: 0.85,
  },
  countdown: {
    alignItems: "center",
    gap: 4,
  },
  countdownValue: {
    fontFamily: Fonts.extrabold,
    fontSize: 40,
    letterSpacing: -1.2,
    color: Colors.text.primary,
  },
  overdue: {
    color: Colors.danger,
  },
  countdownCaption: {
    textAlign: "center",
    fontSize: 15,
  },
  bottom: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    gap: 10,
  },
  infoCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 2,
  },
  infoLabel: {
    fontSize: 12,
  },
  infoValue: {
    fontSize: 15,
  },
  notWellButton: {
    minHeight: 52,
  },
});
