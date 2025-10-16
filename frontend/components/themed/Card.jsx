import { StyleSheet, useColorScheme, View } from "react-native";

import { Colors } from "../../constants/Color";

export default function ThemedCard({ style, ...props }) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <View
      style={[{ backgroundColor: theme.uiBackground }, styles.card, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 5,
    padding: 20,
  },
});
