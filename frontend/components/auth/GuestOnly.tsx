import { useEffect, ReactNode } from "react";
import { useRouter } from "expo-router";

import { useUser } from "@/hooks/useUser";
import { Loader } from "../Themed";

export default function GuestOnly({ children }: { children: ReactNode }) {
  const router = useRouter();

  const { user, authChecked } = useUser();

  useEffect(() => {
    if (authChecked && user !== null) {
      router.replace("/home");
    }
  }, [user, authChecked]);

  if (!authChecked || user) {
    return <Loader />;
  }

  return children;
}
