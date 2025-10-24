import { Alert, Keyboard, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Text, View, TextInput, Spacer, Button } from "@/components/Themed";
import { useUser } from "@/hooks/useUser";
import { useColor } from "@/hooks/useTheme";
import Colors from "@/constants/Colors";

export default function Profile() {
  const [message, setMessage] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { createPost } = useUser();

  function handleCameraPress() {
    Alert.alert("Camera button pressed!");
  }

  function handleImagePress() {
    Alert.alert("Image button pressed!");
  }

  async function handleSendPress() {
    setError(null);
    setIsCreating(true);

    const res = await createPost(message);
    if (res !== "SUCCESS") {
      setError(res); // translate to readable error
    }

    router.navigate("/home");

    setIsCreating(false);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container} safe={true}>
        <Spacer height={20} />

        <TextInput
          style={{ width: "80%", height: 5 * 18 + 40, textAlignVertical: "top", borderRadius: 25 }}
          placeholder="What is going on?"
          keyboardType="default"
          onChangeText={setMessage}
          value={message}
          multiline
          maxLength={200}
        />
        <Spacer height={20} />
        <View style={styles.actionsContainer}>
          <View style={styles.leftButtons}>
            <Button
              style={[{ backgroundColor: useColor("actionIcon") }, styles.actionButton]}
              onPress={handleCameraPress}
            >
              <Ionicons size={20} name="camera" color={useColor("background")} />
            </Button>

            <Button
              style={[{ backgroundColor: useColor("actionIcon") }, styles.actionButton]}
              onPress={handleImagePress}
            >
              <Ionicons size={20} name="image" color={useColor("background")} />
            </Button>
          </View>

          <Button
            style={[{ backgroundColor: useColor("actionIcon") }, styles.sendButton]}
            onPress={handleSendPress}
            disabled={isCreating}
          >
            <Text style={{ color: useColor("background") }}>Send</Text>
          </Button>
        </View>

        <Spacer height={20} />

        {error ? <Text style={styles.error}>{error}</Text> : <Spacer height={55} />}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  error: {
    color: Colors.warning,
    padding: 10,
    backgroundColor: "#f5c1c8",
    borderColor: Colors.warning,
    borderWidth: 1,
    borderRadius: 6,
    marginTop: 15,
    width: "80%",
    textAlign: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
  },
  leftButtons: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButton: {
    paddingHorizontal: 20,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 30,
  },
});
