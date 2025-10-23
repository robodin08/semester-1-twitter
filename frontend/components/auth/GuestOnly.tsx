import { useEffect, ReactNode } from "react";
import { router } from "expo-router";

import { useUser } from "@/hooks/useUser";
import { Loader } from "../Themed";

export default function GuestOnly({ children }: { children: ReactNode }) {
  const { user, authChecked } = useUser();

  useEffect(() => {
    if (authChecked && user !== null) {
      router.replace("/profile");
    }
  }, [user, authChecked]);

  if (!authChecked || user) {
    return <Loader />;
  }

  return children;
}
