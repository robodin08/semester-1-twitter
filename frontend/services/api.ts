import { router } from "expo-router";

import * as Storage from "@/services/storage";

const port = 3000;

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface FetchApiOptions {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
  authenticate?: boolean;
}

interface ErrorResponse {
  success: false;
  status: number;
  description: string;
  message: string;
  type: string;
}

export type SuccessResponse<T> = {
  success: true;
} & T;

export type ApiRespone<T = {}> = SuccessResponse<T> | ErrorResponse;

let apiUrl: string | null;
async function fetchApiUrl(): Promise<string> {
  const res = await fetch("https://api.ipify.org?format=json");
  const data = await res.json();
  return `http://${data.ip}:${port}`;
}

async function getApiUrl(): Promise<string> {
  if (!apiUrl) apiUrl = await fetchApiUrl();
  return apiUrl;
}

export async function redirectToLogin() {
  await Storage.remove("accessToken");
  await Storage.remove("refreshToken");
  router.replace("/login");
}

async function refreshToken(): Promise<true | void> {
  const refreshToken = await Storage.get("refreshToken");
  if (!refreshToken) return await redirectToLogin();

  const data = await fetchApi<{ accessToken: string }>(
    "/user/refresh",
    { body: { refreshToken } },
    false
  );

  if (!data?.success) return await redirectToLogin();

  await Storage.set("accessToken", data.accessToken);

  return true;
}

export default async function fetchApi<T>(
  path: string,
  options: FetchApiOptions = {},
  retry = true
): Promise<ApiRespone<T> | void> {
  const { method = "POST", body, headers, authenticate = false } = options;

  const fetchHeaders = new Headers({
    "Content-Type": "application/json",
    ...headers,
  });

  if (authenticate) {
    const accessToken = await Storage.get("accessToken");
    if (!accessToken) return await redirectToLogin();

    fetchHeaders.set("authorization", `Bearer ${accessToken}`);
  }

  const fetchOptions: RequestInit = {
    method,
    headers: fetchHeaders,
    ...(body && { body: JSON.stringify(body) }),
  };

  const apiUrl = await getApiUrl();
  let res: Response;
  let data: ApiRespone<T>;

  console.log(`[API] → ${path}`);

  try {
    res = await fetch(apiUrl + path, fetchOptions);
    data = await res.json();
  } catch (error: any) {
    console.error(`[API] ✖ ${path} | Network error or server offline: ${error.message}`);
    throw new Error(`Network error or server offline: ${error.message}`);
  }

  if (data.success) {
    console.log(`[API] ✓ ${path} | Success`);
    return data as SuccessResponse<T>;
  }

  const { message, type } = data;

  console.warn(`[API] ⚠ ${path} | Error type: ${type} | Message: ${message}`);

  if (type === "INVALID_VALIDATION") throw new Error(`Developer error: ${message}`);
  if (type === "INVALID_ACCESS_TOKEN" && authenticate && retry) {
    console.log(`[API] ↻ ${path} | Invalid token, refreshing...`);
    if (!(await refreshToken())) return;
    return fetchApi(path, options, false);
  }

  console.log(`[API] ✖ ${path} | Returning error response`);

  return data as ErrorResponse;
}
