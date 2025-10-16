import { StyleSheet } from "react-native";

import Spacer from "../../components/utils/Spacer";

import ThemedText from "../../components/themed/Text";
import ThemedView from "../../components/themed/View";

export default function Create() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText title={true} style={styles.heading}>
        Add a New Book
      </ThemedText>
      {/* <Spacer /> */}
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
