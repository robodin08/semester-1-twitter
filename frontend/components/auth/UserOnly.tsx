import { useEffect, ReactNode } from "react";
import { useRouter } from "expo-router";

import { useUser } from "@/hooks/useUser";
import { Loader } from "../Themed";

export default function UserOnly({ children }: { children: ReactNode }) {
  const router = useRouter();

  const { user, authChecked } = useUser();

  useEffect(() => {
    if (authChecked && user === null) {
      router.replace("/login");
    }
  }, [user, authChecked]);

  if (!authChecked || !user) {
    return <Loader />;
  }

  return children;
}
