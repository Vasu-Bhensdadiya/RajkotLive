import apiClient, {
  extractErrorMessage,
  setTokens,
  clearTokens,
  setStoredUser,
  getStoredUser,
} from "./client";
import {
  ApiResponse,
  LoginRequest,
  LoginResponseData,
  RegisterRequest,
  RegisterResponseData,
  MeResponseData,
} from "./types";
import { User } from "../types";

function mapLoginUserToUser(data: LoginResponseData["user"]): User {
  return {
    id: data.id,
    username: data.username,
    email: data.email,
    displayName: data.displayName,
    avatar: data.avatar,
    bio: data.bio,
    gender: data.gender,
    role: data.role,
    status: data.status,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

function mapMeToUser(data: MeResponseData): User {
  return {
    id: data.id,
    username: data.username,
    email: data.email,
    displayName: data.displayName,
    avatar: data.avatar,
    bio: data.bio,
    gender: data.gender,
    role: data.role,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    _count: data._count,
  };
}

export async function login(
  email: string,
  password: string
): Promise<{ user: User; accessToken: string; refreshToken: string }> {
  try {
    const { data } = await apiClient.post<ApiResponse<LoginResponseData>>(
      "/auth/login",
      { email, password } as LoginRequest
    );
    if (!data.success || !data.data) {
      throw new Error(data.message || "Login failed");
    }
    const { user: rawUser, accessToken, refreshToken } = data.data;
    const user = mapLoginUserToUser(rawUser);
    setTokens(accessToken, refreshToken);
    setStoredUser(user);
    return { user, accessToken, refreshToken };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function register(
  payload: RegisterRequest
): Promise<{ user: User; accessToken: string; refreshToken: string }> {
  try {
    const { data } = await apiClient.post<ApiResponse<RegisterResponseData>>(
      "/auth/register",
      payload
    );
    if (!data.success || !data.data) {
      throw new Error(data.message || "Registration failed");
    }
    const { user: rawUser, accessToken, refreshToken } = data.data;
    const user: User = {
      id: rawUser.id,
      username: rawUser.username,
      email: rawUser.email,
      displayName: rawUser.displayName,
      avatar: null,
      bio: null,
      gender: rawUser.gender,
      role: rawUser.role,
      createdAt: rawUser.createdAt,
    };
    setTokens(accessToken, refreshToken);
    setStoredUser(user);
    return { user, accessToken, refreshToken };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function getMe(): Promise<User> {
  try {
    const { data } = await apiClient.get<ApiResponse<MeResponseData>>(
      "/auth/me"
    );
    if (!data.success || !data.data) {
      throw new Error(data.message || "Failed to fetch profile");
    }
    const user = mapMeToUser(data.data);
    setStoredUser(user);
    return user;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post("/auth/logout");
  } catch {
    // Ignore errors — we clear tokens regardless
  } finally {
    clearTokens();
  }
}

export function getStoredCurrentUser(): User | null {
  return getStoredUser<User>();
}
