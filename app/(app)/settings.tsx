import { StyleSheet } from "react-native";
import { ThemedText } from "../../components/ThemedText";
import { ThemeView } from "../../components/ThemeView";

export default function SettingsScreen() {
  return (
    <ThemeView>
      <ThemedText variant="title" style={styles.title}>
        Settings
      </ThemedText>
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 20,
  },
});
