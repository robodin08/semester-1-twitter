import React from "react";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { UserProvider } from "../contexts/UserContext";
import { useColor } from "@/components/useTheme";

export default function RootLayout() {
  return (
    <UserProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "none",
        }}
      />
    </UserProvider>
  );
}
