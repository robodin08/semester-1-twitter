import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import UserOnly from "@/components/auth/UserOnly";

export default function AuthLayout() {
  return (
    <UserOnly>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "none",
        }}
      />
    </UserOnly>
  );
}
