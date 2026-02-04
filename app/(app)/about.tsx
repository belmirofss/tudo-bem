import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../../components/ThemedText";
import { ThemeView } from "../../components/ThemeView";
import { Colors } from "../../constants";

export default function AboutScreen() {
  return (
    <ThemeView>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons
            name="lightbulb"
            size={24}
            color={Colors.button.neutral}
          />
          <ThemedText variant="strongBody" style={styles.sectionTitle}>
            Como funciona
          </ThemedText>
        </View>
        <ThemedText variant="body" style={styles.sectionText}>
          O &ldquo;Tudo bem?&rdquo; é um aplicativo simples de check-in a cada
          48 horas que sinaliza que você está bem.
        </ThemedText>
        <ThemedText variant="body" style={styles.sectionText}>
          Caso você não faça o check-in no período de 48 horas, seu contato de
          emergência receberá automaticamente um e-mail informando que não
          tivemos notícias suas.
        </ThemedText>
        <ThemedText variant="body" style={styles.sectionText}>
          O e-mail incluirá seu nome e solicitará que a pessoa entre em contato
          para verificar se está tudo bem.
        </ThemedText>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="warning" size={24} color={Colors.button.bad} />
          <ThemedText variant="strongBody" style={styles.sectionTitle}>
            Importante antes de desinstalar
          </ThemedText>
        </View>
        <ThemedText variant="body" style={styles.sectionText}>
          Antes de desinstalar o aplicativo, desative ou exclua sua conta.
        </ThemedText>
        <ThemedText variant="body" style={styles.sectionText}>
          Caso contrário, o sistema continuará enviando alertas automaticamente
          para seu contato de emergência mesmo após a desinstalação.
        </ThemedText>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="security" size={24} color={Colors.button.good} />
          <ThemedText variant="strongBody" style={styles.sectionTitle}>
            Privacidade e segurança
          </ThemedText>
        </View>
        <ThemedText variant="body" style={styles.sectionText}>
          • Suas informações são armazenadas de forma segura.{"\n"}• Apenas seu
          contato de emergência será notificado.{"\n"}• Sem compartilhamento de
          dados com terceiros.{"\n"}• Você pode desativar o sistema a qualquer
          momento.
        </ThemedText>
      </View>

      <View style={styles.footer}>
        <ThemedText variant="secondaryBody" style={styles.footerText}>
          &ldquo;Às vezes, tudo o que a gente precisa é avisar que está
          bem.&rdquo;
        </ThemedText>
      </View>
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
    backgroundColor: Colors.text.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    marginLeft: 12,
    fontSize: 18,
  },
  sectionText: {
    lineHeight: 22,
    marginBottom: 8,
  },
  footer: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 32,
  },
  footerText: {
    textAlign: "center",
    fontStyle: "italic",
  },
});
