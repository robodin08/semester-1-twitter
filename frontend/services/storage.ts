import AsyncStorage from "@react-native-async-storage/async-storage";

export async function set(key: string, value: any): Promise<boolean> {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error(`AsyncStorage set error [${key}]:`, error);
    return false;
  }
}

export async function get<T = any>(key: string): Promise<T | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? (JSON.parse(jsonValue) as T) : null;
  } catch (error) {
    console.error(`AsyncStorage get error [${key}]:`, error);
    return null;
  }
}

export async function remove(key: string): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`AsyncStorage remove error [${key}]:`, error);
    return false;
  }
}
