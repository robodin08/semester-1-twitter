import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";

import UserOnly from "@/components/auth/UserOnly";
import { useColor } from "@/hooks/useTheme";

export default function AuthLayout() {
  return (
    <UserOnly>
      <StatusBar style="auto" />
      {/* <Stack
        screenOptions={{
          headerShown: false,
          animation: "none",
        }}
      /> */}

      <Tabs
        screenOptions={{
          headerShown: false,
          animation: "none",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: useColor("uiBackground"),
            paddingTop: 10,
            height: 90,
          },
          tabBarItemStyle: {
            justifyContent: "space-around", // center icon vertically
            // alignItems: "center"
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons
                size={30}
                name={focused ? "home" : "home-outline"}
                color={useColor(focused ? "iconColorFocused" : "iconColor")}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons
                size={30}
                name={focused ? "add-circle" : "add-circle-outline"}
                color={useColor(focused ? "iconColorFocused" : "iconColor")}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons
                size={30}
                name={focused ? "person" : "person-outline"}
                color={useColor(focused ? "iconColorFocused" : "iconColor")}
              />
            ),
          }}
        />
      </Tabs>
    </UserOnly>
  );
}
