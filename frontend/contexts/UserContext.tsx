import { createContext, ReactNode, useEffect, useState } from "react";
import * as userService from "@/services/user";

export interface User {
  id: number;
  email: string;
  username: string;
}

export enum PostActionType {
  BOOST = "BOOST",
  DISLIKE = "DISLIKE",
}

export interface Post {
  id: number;
  message: string;
  boostCount: number;
  userAction: PostActionType | null,
  createdAt: Date;
}

interface UserContextType {
  authChecked: boolean;
  user: User | null;
  login: (identifier: string, password: string) => Promise<string>;
  register: (username: string, email: string, password: string) => Promise<string>;
  logout: () => Promise<void>;

  createPost: (message: string) => Promise<string>;
  getPosts: (offset: number) => Promise<Post[] | string>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  async function login(identifier: string, password: string): Promise<string> {
    const res = await userService.login(identifier, password);
    if (!res?.success) return res?.type || "UNKOWN_ERROR";

    const data = await userService.getUserInfo();
    if (!data) return "UNKOWN_ERROR";

    setUser({
      id: data.user.id,
      email: data.user.email,
      username: data.user.username,
    });

    return "SUCCESS";
  }

  async function register(username: string, email: string, password: string): Promise<string> {
    const res = await userService.register(username, email, password);
    if (!res?.success) return res?.type || "UNKOWN_ERROR";

    return login(email, password);
  }

  async function logout(): Promise<void> {
    if (await userService.logout()) setUser(null);
  }

  async function createPost(message: string): Promise<string> {
    const res = await userService.createPost(message);
    if (!res?.success) return res?.type || "UNKOWN_ERROR";

    return "SUCCESS";
  }

  async function getPosts(offset: number): Promise<Post[] | string> {
    const res = await userService.getPosts(offset);
    if (!res?.success) return res?.type || "UNKOWN_ERROR";

    return res.posts;
  }

  async function getInitialUserValue() {
    try {
      const data = await userService.getUserInfo();
      if (!data) return;

      setUser({
        id: data.user.id,
        email: data.user.email,
        username: data.user.username,
      });
    } finally {
      setAuthChecked(true);
    }
  }

  useEffect(() => {
    getInitialUserValue();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, authChecked, login, register, logout, createPost, getPosts }}
    >
      {children}
    </UserContext.Provider>
  );
}
