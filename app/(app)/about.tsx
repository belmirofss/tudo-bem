import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, View } from "react-native";
import { ThemedText } from "../../components/ThemedText";
import { ThemeView } from "../../components/ThemeView";
import { Colors } from "../../constants";

export default function AboutScreen() {
  return (
    <ThemeView>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <MaterialIcons
              name="thumb-up"
              size={48}
              color={Colors.button.good}
            />
          </View>
          <ThemedText variant="title" style={styles.title}>
            Tudo bem?
          </ThemedText>
        </View>

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
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons
              name="touch-app"
              size={24}
              color={Colors.button.good}
            />
            <ThemedText variant="strongBody" style={styles.sectionTitle}>
              Passo a passo
            </ThemedText>
          </View>
          <View style={styles.stepList}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <ThemedText variant="strongBody" style={styles.stepNumberText}>
                  1
                </ThemedText>
              </View>
              <ThemedText variant="body" style={styles.stepText}>
                Cadastre-se e adicione um contato de emergência.
              </ThemedText>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <ThemedText variant="strongBody" style={styles.stepNumberText}>
                  2
                </ThemedText>
              </View>
              <ThemedText variant="body" style={styles.stepText}>
                Toque em &ldquo;Sim, estou bem 👍&rdquo; a cada 48 horas.
              </ThemedText>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <ThemedText variant="strongBody" style={styles.stepNumberText}>
                  3
                </ThemedText>
              </View>
              <ThemedText variant="body" style={styles.stepText}>
                Se não responder, enviamos um e-mail automaticamente.
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons
              name="email"
              size={24}
              color={Colors.button.neutral}
            />
            <ThemedText variant="strongBody" style={styles.sectionTitle}>
              Alerta automático
            </ThemedText>
          </View>
          <ThemedText variant="body" style={styles.sectionText}>
            Caso você não faça o check-in em 48 horas, seu contato de emergência
            receberá automaticamente um e-mail informando que não tivemos
            notícias suas.
          </ThemedText>
          <ThemedText variant="body" style={styles.sectionText}>
            O e-mail incluirá seu nome e solicitará que a pessoa entre em
            contato para verificar se está tudo bem.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons
              name="security"
              size={24}
              color={Colors.button.good}
            />
            <ThemedText variant="strongBody" style={styles.sectionTitle}>
              Privacidade e segurança
            </ThemedText>
          </View>
          <ThemedText variant="body" style={styles.sectionText}>
            • Suas informações são armazenadas de forma segura.{"\n"}• Apenas
            seu contato de emergência será notificado.{"\n"}• Sem
            compartilhamento de dados com terceiros.{"\n"}• Você pode desativar
            o sistema a qualquer momento.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons
              name="people"
              size={24}
              color={Colors.button.neutral}
            />
            <ThemedText variant="strongBody" style={styles.sectionTitle}>
              Ideal para
            </ThemedText>
          </View>
          <View style={styles.featureList}>
            <View style={styles.feature}>
              <MaterialIcons
                name="check-circle"
                size={20}
                color={Colors.button.good}
              />
              <ThemedText variant="body" style={styles.featureText}>
                Idosos que moram sozinhos.
              </ThemedText>
            </View>
            <View style={styles.feature}>
              <MaterialIcons
                name="check-circle"
                size={20}
                color={Colors.button.good}
              />
              <ThemedText variant="body" style={styles.featureText}>
                Pessoas com condições de saúde crônicas.
              </ThemedText>
            </View>
            <View style={styles.feature}>
              <MaterialIcons
                name="check-circle"
                size={20}
                color={Colors.button.good}
              />
              <ThemedText variant="body" style={styles.featureText}>
                Quem trabalha ou viaja sozinho.
              </ThemedText>
            </View>
            <View style={styles.feature}>
              <MaterialIcons
                name="check-circle"
                size={20}
                color={Colors.button.good}
              />
              <ThemedText variant="body" style={styles.featureText}>
                Qualquer pessoa que queira tranquilidade extra.
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <ThemedText variant="secondaryBody" style={styles.footerText}>
            &ldquo;Às vezes, tudo o que a gente precisa é avisar que está
            bem.&rdquo;
          </ThemedText>
        </View>
      </ScrollView>
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.button.good + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
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
  stepList: {
    gap: 12,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.button.neutral,
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumberText: {
    color: Colors.text.white,
    fontSize: 14,
  },
  stepText: {
    flex: 1,
    lineHeight: 20,
  },
  featureList: {
    gap: 8,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  featureText: {
    lineHeight: 20,
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
