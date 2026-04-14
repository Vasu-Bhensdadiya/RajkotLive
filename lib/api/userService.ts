import apiClient, { extractErrorMessage } from "./client";
import {
  ApiResponse,
  UserProfile,
  PostSummary,
  PaginationMeta,
} from "./types";
import { User } from "../types";

export async function getUserByUsername(
  username: string
): Promise<UserProfile> {
  try {
    const { data } = await apiClient.get<ApiResponse<UserProfile>>(
      `/users/${username}`
    );
    if (!data.success || !data.data) {
      throw new Error(data.message || "User not found");
    }
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function updateProfile(
  payload: FormData
): Promise<User> {
  try {
    const { data } = await apiClient.put<ApiResponse<User>>(
      "/users/me",
      payload,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    if (!data.success || !data.data) {
      throw new Error(data.message || "Failed to update profile");
    }
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export interface SavedPostsResponse {
  posts: PostSummary[];
  meta?: PaginationMeta;
}

export async function getSavedPosts(
  page = 1,
  limit = 10
): Promise<SavedPostsResponse> {
  try {
    const { data } = await apiClient.get<ApiResponse<PostSummary[]>>(
      "/users/me/saved",
      { params: { page, limit } }
    );
    if (!data.success) {
      throw new Error(data.message || "Failed to fetch saved posts");
    }
    return { posts: data.data || [], meta: data.meta };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function getMyPosts(
  page = 1,
  limit = 10
): Promise<SavedPostsResponse> {
  try {
    const { data } = await apiClient.get<ApiResponse<PostSummary[]>>(
      "/users/me/posts",
      { params: { page, limit } }
    );
    if (!data.success) {
      throw new Error(data.message || "Failed to fetch your posts");
    }
    return { posts: data.data || [], meta: data.meta };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
