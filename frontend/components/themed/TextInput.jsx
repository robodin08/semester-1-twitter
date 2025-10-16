import { TextInput, TextInputProps, useColorScheme, StyleSheet } from "react-native";

import { Colors } from "../../constants/Color";

export default function ThemedTextInput({ style, ...props }) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <TextInput
      style={[
        {
          backgroundColor: theme.uiBackground,
          color: theme.text,
        },
        styles.TextInput,
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  TextInput: {
    padding: 20,
    borderRadius: 6,
  },
});
