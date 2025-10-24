import { useColorScheme } from "react-native";
import { ThemeColors } from "@/constants/Colors";

export type Theme = keyof typeof ThemeColors;

export function useThemeColors(overrideTheme?: Theme) {
  const systemTheme = useColorScheme();
  const theme: Theme = overrideTheme ?? systemTheme ?? "light";
  return ThemeColors[theme];
}

export function useColor(key: keyof (typeof ThemeColors)["light"], overrideTheme?: Theme) {
  const colors = useThemeColors(overrideTheme);
  return colors[key];
}

export { useColorScheme };
