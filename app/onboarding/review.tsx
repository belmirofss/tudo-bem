import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, View } from "react-native";
import { ThemeView } from "../../components/ThemeView";
import { formatWhatsApp } from "../../helpers/formatWhatsApp";
import { useOnboarding } from "./context/OnboardingContext";

export default function Review() {
  const { data } = useOnboarding();

  return (
    <ThemeView>
      <View style={styles.container}>
        <ThemedText variant="title">Confirmação dos dados</ThemedText>

        <View style={styles.infoContainer}>
          {[
            ["Nome", data.name],
            ["Contato de Emergência", data.emergencyContactName],
            [
              "WhatsApp do Contato de Emergência",
              formatWhatsApp(data.emergencyContactWhatsapp),
            ],
          ].map(([title, value]) => (
            <View key={title}>
              <ThemedText variant="body">{title}</ThemedText>
              <ThemedText variant="strongBody">{value}</ThemedText>
            </View>
          ))}
        </View>
      </View>

      <ThemedButton title="Confirmar" variant="good" />
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  infoContainer: {
    marginTop: 24,
    flex: 1,
    gap: 24,
  },
});
