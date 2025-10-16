import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text } from "react-native";

import { useUser } from "../../app/hooks/useUser";

import ThemedLoader from "../themed/Loader";

export default function UserOnly({ children }) {
  const { user, authChecked } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (authChecked && user === null) {
      router.replace("/login");
    }
  }, [user, authChecked]);

  if (!authChecked || user) {
    return <ThemedLoader />;
  }

  return children;
}
