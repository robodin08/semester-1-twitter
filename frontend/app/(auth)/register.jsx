import React, { useState } from "react";
import {
  Animated,
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Easing,
} from "react-native";
import { Link } from "expo-router";
import zxcvbn from "zxcvbn";

import { useUser } from "../hooks/useUser";
import { Colors } from "../../constants/Color";

import Spacer from "../../components/utils/Spacer";
import ThemedView from "../../components/themed/View";
import ThemedText from "../../components/themed/Text";
import ThemedButton from "../../components/themed/Button";
import ThemedTextInput from "../../components/themed/TextInput";

const strengthColors = ["#ff4d4d", "#ff9900", "#ffcc00", "#99cc00", "#33cc33"];
const strengthLabels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);

  const { register } = useUser();

  async function handleSubmit() {
    setError(null);
    try {
      // await register(email, password);
    } catch (err) {
      setError(err.message);
    }
  }

  function handlePasswordChange(newPassword) {
    setPassword(newPassword);

    if (newPassword.trim().length === 0) {
      setScore(0);
      return;
    }

    const result = zxcvbn(newPassword);
    console.log(result.feedback);
    setScore(result.score);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <Spacer />
        <ThemedText title style={styles.title}>
          Register to Your Account
        </ThemedText>

        <ThemedTextInput
          style={{ width: "80%", marginBottom: 20 }}
          placeholder="Email"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
        />

        <ThemedTextInput
          style={{ width: "80%", marginBottom: 10 }}
          placeholder="Password"
          onChangeText={handlePasswordChange}
          value={password}
          secureTextEntry
        />

        {(password.length > 0 && (
          <>
            <View style={[styles.strengthBarContainer]}>
              <Animated.View
                style={[
                  styles.strengthBar,
                  {
                    width: `${(score + 1) * 20}%`,
                    backgroundColor: strengthColors[score],
                  },
                ]}
              />
            </View>
            <Text style={[styles.strengthLabel]}>{strengthLabels[score]}</Text>
          </>
        )) || <View style={styles.strengthPlaceholder}></View>}

        <ThemedButton disabled={score < 2} onPress={handleSubmit}>
          <Text style={{ color: "#F2F2F2" }}>Register</Text>
        </ThemedButton>

        <Spacer />
        {error && <Text style={styles.error}>{error}</Text>}

        <Spacer height={100} />

        <Link href={"/login"}>
          <ThemedText style={{ textAlign: "center" }}>Login instead</ThemedText>
        </Link>
      </ThemedView>
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
  strengthBarContainer: {
    width: "80%",
    height: 8,
    borderRadius: 4,
    backgroundColor: "#eee",
    marginBottom: 8,
    overflow: "hidden",
  },
  strengthBar: {
    height: "100%",
    borderRadius: 4,
  },
  strengthLabel: {
    marginBottom: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 12,
    color: "#666",
  },
  strengthPlaceholder: {
    height: 52,
  },
});
