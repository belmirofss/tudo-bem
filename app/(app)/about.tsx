import { MaterialIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ThemedText } from "../../components/ThemedText";
import { ThemeView } from "../../components/ThemeView";
import { Colors, Fonts } from "../../constants";

const TIMELINE = [
  { time: "0h", text: "Você toca em “Estou bem”.", color: Colors.primary },
  { time: "24h → 10min", text: "Lembretes no celular.", color: Colors.warningText },
  { time: "48h", text: "Seu contato recebe um e-mail.", color: Colors.danger },
];

const PRIVACY = [
  "Dados guardados com segurança",
  "Só seu contato é notificado",
  "Nada é compartilhado com terceiros",
  "Pause quando quiser",
];

export default function AboutScreen() {
  return (
    <ThemeView withBottomInset={false} contentStyle={styles.content}>
      <ThemedText variant="title" accessibilityRole="header" style={styles.inset}>
        Sobre
      </ThemedText>

      <View style={styles.card}>
        <ThemedText variant="heading">Como funciona</ThemedText>
        <View style={styles.timelineBar} accessibilityElementsHidden>
          <View style={[styles.timelineSegment, styles.segmentOk]} />
          <View style={[styles.timelineSegment, styles.segmentWarn]} />
          <View style={[styles.timelineSegment, styles.segmentAlert]} />
        </View>
        <View style={styles.timeline}>
          {TIMELINE.map(({ time, text, color }, index) => (
            <View
              key={time}
              style={[
                styles.timelineItem,
                index === TIMELINE.length - 1 && styles.timelineItemLast,
              ]}
            >
              <Text style={[styles.timelineTime, { color }]}>{time}</Text>
              <ThemedText
                variant="caption"
                style={[
                  styles.timelineText,
                  index === TIMELINE.length - 1 && styles.textRight,
                ]}
              >
                {text}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.card, styles.warningCard]}>
        <MaterialIcons name="warning-amber" size={24} color={Colors.danger} />
        <View style={styles.flex}>
          <Text style={styles.warningTitle}>Antes de desinstalar</Text>
          <ThemedText variant="caption" style={styles.warningText}>
            Pause o monitoramento ou exclua sua conta em Ajustes. Caso contrário,
            seu contato continuará recebendo alertas mesmo após a
            desinstalação.
          </ThemedText>
          <Pressable
            accessibilityRole="link"
            onPress={() => router.navigate("/(app)/settings")}
            hitSlop={8}
            style={styles.warningLink}
          >
            <Text style={styles.warningLinkText}>Ir para Ajustes</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="shield" size={22} color={Colors.primary} />
          <ThemedText variant="heading">Privacidade</ThemedText>
        </View>
        <View style={styles.grid}>
          {PRIVACY.map((item) => (
            <View key={item} style={styles.gridItem}>
              <ThemedText variant="caption" style={styles.gridText}>
                {item}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <ThemedText variant="caption" style={styles.quote}>
          “Às vezes, tudo o que a gente precisa é avisar que está bem.”
        </ThemedText>
        <ThemedText variant="label" style={styles.version}>
          Versão {Constants.expoConfig?.version}
        </ThemedText>
      </View>
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    gap: 14,
  },
  inset: {
    marginHorizontal: 4,
    marginBottom: 4,
  },
  flex: {
    flex: 1,
    gap: 6,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 18,
    gap: 14,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  timelineBar: {
    flexDirection: "row",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  timelineSegment: {
    height: "100%",
  },
  segmentOk: {
    flex: 50,
    backgroundColor: Colors.primary,
  },
  segmentWarn: {
    flex: 42,
    backgroundColor: Colors.warning,
  },
  segmentAlert: {
    flex: 8,
    backgroundColor: Colors.danger,
  },
  timeline: {
    flexDirection: "row",
    gap: 10,
    marginTop: -4,
  },
  timelineItem: {
    flex: 1,
    gap: 4,
  },
  timelineItemLast: {
    alignItems: "flex-end",
  },
  timelineTime: {
    fontFamily: Fonts.extrabold,
    fontSize: 13,
  },
  timelineText: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.text.secondary,
  },
  textRight: {
    textAlign: "right",
  },
  warningCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: Colors.dangerTint,
  },
  warningTitle: {
    fontFamily: Fonts.extrabold,
    fontSize: 16,
    color: Colors.dangerDark,
  },
  warningText: {
    color: Colors.dangerText,
  },
  warningLink: {
    minHeight: 32,
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  warningLinkText: {
    fontFamily: Fonts.extrabold,
    fontSize: 14,
    color: Colors.dangerDark,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  gridItem: {
    flexBasis: "47%",
    flexGrow: 1,
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  gridText: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.text.secondary,
  },
  footer: {
    marginTop: "auto",
    paddingTop: 16,
    alignItems: "center",
    gap: 4,
  },
  quote: {
    textAlign: "center",
    fontStyle: "italic",
    color: Colors.text.secondary,
  },
  version: {
    fontSize: 12,
    color: Colors.text.subtle,
  },
});
