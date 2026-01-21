import { StyleSheet, Text } from "react-native";
import { ThemeView } from "../../components/ThemeView";

export default function AboutScreen() {
  return (
    <ThemeView>
      <Text style={styles.title}>About</Text>
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
