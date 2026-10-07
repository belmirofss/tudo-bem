import { ScrollView, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../constants";

type Props = {
  children: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  // Screens rendered inside the tab bar already get bottom spacing from it
  withBottomInset?: boolean;
};

export const ThemeView = ({
  children,
  contentStyle,
  withBottomInset = true,
}: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.container,
        {
          paddingTop: insets.top + 24,
          paddingBottom: (withBottomInset ? insets.bottom : 0) + 24,
        },
        contentStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
});
