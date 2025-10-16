import { StyleSheet, Text } from "react-native";

import { useUser } from "../hooks/useUser";

import Spacer from "../../components/utils/Spacer";

import ThemedText from "../../components/themed/Text";
import ThemedView from "../../components/themed/View";
import ThemedButton from "../../components/themed/Button";

export default function Profile() {
  const { user, logout } = useUser();

  return (
    <ThemedView style={styles.container}>
      <ThemedText title={true} style={styles.heading}>
        {user.email}
      </ThemedText>
      <Spacer />

      <ThemedText>Time to start reading some books...</ThemedText>
      <Spacer />

      <ThemedButton onPress={logout}>
        <Text style={{ color: "#F2F2F2" }}>Logout</Text>
      </ThemedButton>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
});
