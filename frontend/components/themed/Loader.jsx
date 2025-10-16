import { ActivityIndicator, useColorScheme } from "react-native";

import { Colors } from "../../constants/Color";

import ThemedView from "./View";

export default function ThemedLoader({ ...props }) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <ThemedView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator size="large" color={theme.text} {...props} />
    </ThemedView>
  );
}
