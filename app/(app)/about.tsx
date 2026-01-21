import { StyleSheet } from "react-native";
import { ThemedText } from "../../components/ThemedText";
import { ThemeView } from "../../components/ThemeView";

export default function AboutScreen() {
  return (
    <ThemeView>
      <ThemedText variant="title" style={styles.title}>
        About
      </ThemedText>
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 20,
  },
});
