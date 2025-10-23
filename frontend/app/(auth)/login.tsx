import { Keyboard, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { useState } from "react";

import { Text, TextInput, View, Spacer, Button } from "@/components/Themed";
import { Colors } from "@/constants/Colors";
import { useUser } from "@/hooks/useUser";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useUser();

  async function handleLogin() {
    const error = await login(identifier, password);
    if (error) console.log(error);
  }



  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Spacer />

        <Text title={true} style={styles.title}>
          Login to Your Account
        </Text>

        <TextInput
          style={{ width: "80%" }}
          placeholder="Email or Username"
          keyboardType="email-address"
          onChangeText={setIdentifier}
          value={identifier}
        />

        <Spacer height={20} />

        <TextInput
          style={{ width: "80%" }}
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />

        <Spacer height={20} />

        <Button onPress={handleLogin}>
          <Text style={{ color: "#f2f2f2" }}>Login</Text>
        </Button>
      </View>
    </TouchableWithoutFeedback>
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
  error: {
    color: Colors.warning,
    padding: 10,
    backgroundColor: "#f5c1c8",
    borderColor: Colors.warning,
    borderWidth: 1,
    borderRadius: 6,
    marginHorizontal: 10,
  },
});
