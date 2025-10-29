import * as Storage from "./storage";
import fetchApi, { ApiRespone, redirectToLogin, SuccessResponse } from "./api";
import { Post, User } from "@/contexts/UserContext";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export async function login(
  identifier: string,
  password: string
): Promise<ApiRespone<LoginResponse> | void> {
  const data = await fetchApi<LoginResponse>("/user/login", {
    method: "POST",
    body: {
      identifier,
      password,
    },
  });

  if (!data) return;

  if (data.success) {
    await Storage.set("accessToken", data.accessToken);
    await Storage.set("refreshToken", data.refreshToken);
  }

  return data;
}

export async function register(
  username: string,
  email: string,
  password: string
): Promise<ApiRespone | void> {
  const data = await fetchApi("/user/create", {
    method: "POST",
    body: {
      username,
      email,
      password,
    },
  });

  return data;
}

export async function logout(): Promise<boolean> {
  const refreshToken = await Storage.get("refreshToken");
  if (!refreshToken) {
    await redirectToLogin();
    return false;
  }

  const data = await fetchApi("/user/logout", {
    method: "POST",
    authenticate: true,
    body: {
      refreshToken,
    },
  });

  if (!data?.success) return false;

  await Storage.remove("accessToken");
  await Storage.remove("refreshToken");

  return true;
}

interface UserInfoResponse {
  user: User;
}

export async function getUserInfo(): Promise<SuccessResponse<UserInfoResponse> | null> {
  const data = await fetchApi<UserInfoResponse>("/user/info", {
    method: "POST",
    authenticate: true,
  });

  if (!data?.success) return null;

  return data;
}

interface CreatePostResponse {
  id: number;
}

export async function createPost(message: string): Promise<ApiRespone<CreatePostResponse> | void> {
  const data = await fetchApi<CreatePostResponse>("/post/create", {
    authenticate: true,
    body: {
      message,
    },
  });

  if (!data) return;

  return data;
}

interface GetPostResponse {
  posts: Post[];
}

export async function getPosts(offset: number): Promise<ApiRespone<GetPostResponse> | void> {
  const data = await fetchApi<GetPostResponse>("/post/get", {
    authenticate: true,
    body: {
      postOffset: offset,
    },
  });

  if (!data) return;

  return {
    ...data,
    ...(data.success && {
      posts: data.posts.map((post) => ({
        ...post,
        createAt: new Date(post.createdAt),
      })),
    }),
  };
}
