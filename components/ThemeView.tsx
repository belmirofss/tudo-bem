import { Dimensions, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../constants";

type Props = {
  children: React.ReactNode;
};

export const ThemeView = ({ children }: Props) => {
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get("window").height;

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.container,
        {
          minHeight: screenHeight - insets.top - insets.bottom,
          paddingBottom: insets.bottom,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    backgroundColor: Colors.background,
  },
});
