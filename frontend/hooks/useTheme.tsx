import { useContext } from "react";

import { ThemeContext, type ThemeColorKey } from "@/contexts/ThemeContext";

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}

export function useColor(colorKey: ThemeColorKey) {
  const { colors } = useTheme();
  return colors[colorKey];
}
