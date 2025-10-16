import { createContext, useEffect, useState } from "react";
import { account } from "../libs/appwrite";
import { ID } from "react-native-appwrite";
// import { getDeviceId } from "react-native-device-info";
// console.log(await getDeviceId());

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  async function login(email, password) {
    try {
      await account.createEmailPasswordSession({ email, password });
      const response = await account.get();
      setUser(response);
    } catch (error) {
      console.log(error); // error.type
      throw error;
    }
  }

  async function register(email, password) {
    try {
      await account.create({ userId: ID.unique(), email, password });
      await login(email, password);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function logout() {
    await account.deleteSession({ sessionId: "current" });
    setUser(null);
  }

  async function getInitialUserValue() {
    try {
      const response = await account.get();
      setUser(response);
    } catch (error) {
      setUser(null);
    } finally {
      setAuthChecked(true);
    }
  }

  useEffect(() => {
    getInitialUserValue();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, login, register, logout, authChecked }}
    >
      {children}
    </UserContext.Provider>
  );
}
