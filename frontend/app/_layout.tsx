import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { UserProvider } from "@/contexts/UserContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <UserProvider>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "none",
          }}
        />
      </UserProvider>
    </ThemeProvider>
  );
}
