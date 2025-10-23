import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";

export type Theme = keyof typeof Colors;

export function useThemeColors(overrideTheme?: Theme) {
  const systemTheme = useColorScheme();
  const theme: Theme = overrideTheme ?? systemTheme ?? "light";
  return Colors[theme];
}

export function useColor(
  key: keyof (typeof Colors)["light"],
  overrideTheme?: Theme
) {
  const colors = useThemeColors(overrideTheme);
  return colors[key];
}

export { useColorScheme };
