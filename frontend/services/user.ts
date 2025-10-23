import * as Storage from "./storage";

const port = 3000;

async function getApiUrl() {
  const res = await fetch("https://api.ipify.org?format=json");
  const data = await res.json();
  return `http://${data.ip}:${port}`;
}

async function fetchApi(path: string, authenticated: boolean, body?: any) {
  const apiUrl = await getApiUrl();

  const res = await fetch(apiUrl + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  
}

export async function login(identifier: string, password: string): Promise<string | void> {
  try {
    const API_URL = await getApiUrl();
    const response = await fetch(`${API_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await response.json();

    if (data.message === "Invalid credentials.") {
      return "Incorrect identifier or password";
    }

    const ok1 = await Storage.set("accessToken", data.accessToken);
    const ok2 = await Storage.set("refreshToken", data.refreshToken);

    if (!ok1 || !ok2) {
      return "An error occurred while logging in.";
    }
  } catch (error) {
    console.error("Login error:", error);
    return "Network or server error.";
  }
}

export async function logout() {
  try {
    const API_URL = await getApiUrl();

    const accessToken = await Storage.get("accessToken");
    const refreshToken = await Storage.get("refreshToken");
    if (!accessToken || !refreshToken) return null;

    const response = await fetch(`${API_URL}/user/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        refreshToken,
      }),
    });

    const data = await response.json();
    console.log(data);
    if (!data.success) return;

    await Storage.remove("accessToken");
    await Storage.remove("refreshToken");
  } catch (error) {
    console.error("Login error:", error);
    return "Network or server error.";
  }
}

export async function getUserInfo() {
  try {
    const API_URL = await getApiUrl();

    const accessToken = await Storage.get("accessToken");
    if (!accessToken) return null;

    const response = await fetch(`${API_URL}/user/info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!data.success || !data.user) return null;
    return data.user;
  } catch (error) {
    console.error("getUserInfo error:", error);
    return null;
  }
}
