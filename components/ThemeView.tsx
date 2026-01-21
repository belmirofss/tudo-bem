import { StyleSheet, View } from "react-native";
import { Colors } from "../constants";

type Props = {
  children: React.ReactNode;
};

export const ThemeView = ({ children }: Props) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 36,
    backgroundColor: Colors.background,
  },
});
