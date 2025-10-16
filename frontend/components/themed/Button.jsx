import { StyleSheet, Pressable } from "react-native";

import { Colors } from "../../constants/Color";

export default function ThemedButton({ style, disabled = false, ...props }) {
  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5,
  },
  disabled: {
    backgroundColor: Colors.disabled,
  },
  pressed: {
    opacity: 0.8,
  },
});
