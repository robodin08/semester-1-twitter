import { useColorScheme } from "react-native";
import { createContext, ReactNode, useEffect, useState } from "react";
import { ThemeColors } from "@/constants/Colors";
import * as storage from "@/services/storage";

export type ThemeMode = keyof typeof ThemeColors;
export type ModeSetting = ThemeMode | "auto";
export type ThemePalette = typeof ThemeColors.light;
export type ThemeColorKey = keyof ThemePalette;

interface ThemeContextType {
  currentTheme: ThemeMode;
  colors: ThemePalette;
  setModeSetting: (mode: ModeSetting) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemTheme = useColorScheme() || "light";
  const [modeSetting, setModeSetting] = useState<ModeSetting>("auto");
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(systemTheme);

  useEffect(() => {
    async function loadSavedModeSetting() {
      const savedMode: ModeSetting | null = await storage.get("theme");
      setModeSetting(savedMode || "auto");
    }
    loadSavedModeSetting();
  }, []);

  useEffect(() => {
    if (modeSetting === "auto") {
      setCurrentTheme(systemTheme);
    } else {
      setCurrentTheme(modeSetting);
    }
    storage.set("theme", modeSetting);
  }, [modeSetting, systemTheme]);

  const colors = ThemeColors[currentTheme];

  return (
    <ThemeContext.Provider value={{ currentTheme, colors, setModeSetting }}>
      {children}
    </ThemeContext.Provider>
  );
}
