import { StyleSheet } from "react-native";

import { Text, View, Button } from "@/components/Themed";
import { useUser } from "@/hooks/useUser";

export default function Profile() {
  //   const { user, logout } = useUser();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 30,
  },
});
