import { useColorScheme, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "../../constants/Color";

export default function ThemedView({ style, safe = false, ...props }) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const insets = useSafeAreaInsets();

  const baseStyle = {
    backgroundColor: theme.background,
    ...(safe && {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    }),
  };

  return <View style={[styles.container, baseStyle, style]} {...props} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
