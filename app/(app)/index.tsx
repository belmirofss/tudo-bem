import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, View } from "react-native";
import { ThemeView } from "../../components/ThemeView";
import { formatDate } from "../../helpers/formatDate";
import { useMe } from "../../hooks/useMe";

export default function HomeScreen() {
  const { data, isLoading, error } = useMe();

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
          <ThemedButton title="Sim, estou bem 👍" variant="good" size="large" />
          <ThemedButton title="Não estou bem" variant="bad" />
        </View>
        <ThemedText variant="secondaryBody">
          Se você não responder até {formatDate(data.checkinUntil)}, uma
          mensagem será enviada para seu contato de emergência.
        </ThemedText>
        <ThemedText variant="secondaryBody">
          Última resposta: {formatDate(data.lastCheckinAt)}
        </ThemedText>
      </View>
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
