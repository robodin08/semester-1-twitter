import {
  Text as DefaultText,
  TextProps as DefaultTextProps,
  View as DefaultView,
  ViewProps as DefaultViewProps,
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

import { useColor, Theme } from "./useTheme";
import { Colors } from "@/constants/Colors";

interface ViewProps extends DefaultViewProps {
  safe?: boolean;
  theme?: Theme;
}

export function View({ style, safe = false, theme, ...props }: ViewProps) {
  const insets = useSafeAreaInsets();

  const baseStyle = {
    backgroundColor: useColor("background", theme),
    ...(safe && {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    }),
  };

  return <DefaultView style={[baseStyle, style]} {...props} />;
}

interface TextProps extends DefaultTextProps {
  title?: boolean;
  theme?: Theme;
}

export function Text({ style, title = false, theme, ...props }: TextProps) {
  const textColor = useColor(title ? "title" : "text", theme);

  return <DefaultText style={[{ color: textColor }, style]} {...props} />;
}

interface TextInputProps extends DefaultTextInputProps {
  theme?: Theme;
}

export function TextInput({ style, theme, ...props }: TextInputProps) {
  return (
    <DefaultTextInput
      style={[
        {
          backgroundColor: useColor("uiBackground", theme),
          color: useColor("text", theme),
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

interface LoaderProps extends DefaultViewProps {
  theme?: Theme;
}

export function Loader({ style, theme, ...props }: LoaderProps) {
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
      theme={theme}
    >
      <ActivityIndicator
        size="large"
        color={useColor("text", theme)}
        {...props}
      />
    </View>
  );
}

interface SpacerProps extends DefaultViewProps {
  width?: FlexStyle["width"];
  height?: FlexStyle["height"];
}

export function Spacer({
  width = "100%",
  height = 40,
  style,
  ...props
}: SpacerProps) {
  return <View style={[{ width, height }, style]} {...props} />;
}
