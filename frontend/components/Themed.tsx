import {
  View as DefaultView,
  ViewProps as DefaultViewProps,
  Text as DefaultText,
  TextProps as DefaultTextProps,
  TextInput as DefaultTextInput,
  TextInputProps as DefaultTextInputProps,
  Pressable as DefaultPressable,
  PressableProps as DefaultPressableProps,
  FlexStyle,
  StyleProp,
  ViewStyle,
} from "react-native";

import { ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColor } from "@/hooks/useTheme";
import Colors from "@/constants/Colors";

interface ViewProps extends DefaultViewProps {
  safe?: boolean;
}

export function View({ style, safe = false, ...props }: ViewProps) {
  const insets = useSafeAreaInsets();

  const baseStyle = {
    backgroundColor: useColor("background"),
    ...(safe && {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    }),
  };

  return <DefaultView style={[baseStyle, style]} {...props} />;
}

export function Text({ style, ...props }: DefaultTextProps) {
  return <DefaultText style={[{ color: useColor("text") }, style]} {...props} />;
}

export function TextInput({ style, ...props }: DefaultTextInputProps) {
  return (
    <DefaultTextInput
      style={[
        {
          backgroundColor: useColor("uiBackground"),
          color: useColor("text"),
          padding: 20,
          borderRadius: 6,
        },
        style,
      ]}
      {...props}
    />
  );
}

interface ButtonProps extends DefaultPressableProps {
  style?: StyleProp<ViewStyle>;
}

export function Button({ style, disabled, ...props }: ButtonProps) {
  return (
    <DefaultPressable
      style={({ pressed }) => [
        {
          backgroundColor: disabled ? Colors.disabled : Colors.primary,
          padding: 15,
          borderRadius: 5,
          alignItems: "center",
          justifyContent: "center",
        },
        pressed && { opacity: 0.8 },
        style,
      ]}
      disabled={disabled}
      {...props}
    />
  );
}

export function Loader({ style, ...props }: DefaultViewProps) {
  return (
    <View
      style={[
        {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <ActivityIndicator size="large" color={useColor("text")} {...props} />
    </View>
  );
}

interface SpacerProps extends DefaultViewProps {
  width?: FlexStyle["width"];
  height?: FlexStyle["height"];
}

export function Spacer({ width = "100%", height = 40, style, ...props }: SpacerProps) {
  return <View style={[{ width, height }, style]} {...props} />;
}
