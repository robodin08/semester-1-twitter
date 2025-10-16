import { StyleSheet } from "react-native";

import Spacer from "../../components/utils/Spacer";

import ThemedText from "../../components/themed/Text";
import ThemedView from "../../components/themed/View";

export default function Books() {
  return (
    <ThemedView safe={true} style={styles.container}>
      {/* <Spacer /> */}
      <ThemedText title={true} style={styles.heading}>
        Your Reading List
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
});
