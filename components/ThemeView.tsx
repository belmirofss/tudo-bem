import { StyleSheet, View } from "react-native";

type Props = {
  children: React.ReactNode;
};

export const ThemeView = ({ children }: Props) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: "#f5f5f5",
  },
});
