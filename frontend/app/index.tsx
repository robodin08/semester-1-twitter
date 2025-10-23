import { View, Text } from "@/components/Themed";
import { Link } from "expo-router";

export default function Home() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Link href="/login">
        <Text>Login</Text>
      </Link>
      <Link href="/profile">
        <Text>Profile</Text>
      </Link>
    </View>
  );
}
