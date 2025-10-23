import { createContext, ReactNode, useEffect, useState } from "react";
import * as userService from "@/services/user";

interface User {
  id: number;
  email: string;
  username: string;
}

interface UserContextType {
  authChecked: boolean;
  user: User | null;
  login: (identifier: string, password: string) => Promise<string | void>;
  logout: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  async function login(
    identifier: string,
    password: string
  ): Promise<string | void> {
    const error = await userService.login(identifier, password);
    if (error) return error;

    const userInfo = await userService.getUserInfo();
    if (!userInfo) return "An error occurred while logging in.";

    setUser(userInfo);
  }

  async function logout(): Promise<void> {
    await userService.logout();
    setUser(null);
  }

  async function getInitialUserValue() {
    try {
      const userInfo = await userService.getUserInfo();
      if (!userInfo) return;

      setUser(userInfo);
    } finally {
      setAuthChecked(true);
    }
  }

  useEffect(() => {
    getInitialUserValue();
  }, []);

  return (
    <UserContext.Provider value={{ user, authChecked, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
