import { Keyboard, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { useState } from "react";
import { Link } from "expo-router";

import { Text, TextInput, View, Spacer, Button } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useUser } from "@/hooks/useUser";
import { validateEmail, validatePassword, validateUsername } from "@/utils/validate";

export default function Login() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register } = useUser();

  async function handleRegister() {
    setError(null);

    const emailError = validateEmail(email);
    if (emailError) return setError(emailError);

    const usernameError = validateUsername(username);
    if (usernameError) return setError(usernameError);

    const passwordError = validatePassword(password);
    if (passwordError) return setError(passwordError);

    setIsRegistering(true);
    const res = await register(username, email, password);

    if (res !== "SUCCESS") {
      setError(res); // translate to readable error
    }

    setIsRegistering(false);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Spacer />

        <Text style={styles.title}>Register to Your Account</Text>

        {error ? <Text style={styles.error}>{error}</Text> : <Spacer height={55} />}

        <TextInput
          style={{ width: "80%" }}
          placeholder="Email"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
        />

        <Spacer height={20} />

        <TextInput
          style={{ width: "80%" }}
          placeholder="Username"
          keyboardType="default"
          onChangeText={setUsername}
          value={username}
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

        <Button onPress={handleRegister} disabled={isRegistering}>
          <Text style={{ color: "#f2f2f2" }}>Register</Text>
        </Button>

        <Spacer height={40} />

        <Link href="/login" asChild>
          <Text>Login instead</Text>
        </Link>
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
    marginBottom: 15,
    width: "80%",
    textAlign: "center",
  },
});
