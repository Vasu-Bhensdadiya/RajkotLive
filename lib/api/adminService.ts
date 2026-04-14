import apiClient, { extractErrorMessage } from "./client";
import {
  ApiResponse,
  AdminStatsData,
  PostSummaryAdmin,
  AdminGetPostsParams,
  AdminUpdatePostStatusRequest,
  AdminReportedPost,
  AdminGetReportsParams,
  AdminUser,
  AdminGetUsersParams,
  AdminUpdateRoleRequest,
  AdminUserActionResponse,
  PaginationMeta,
} from "./types";

// ────────────────── Stats ──────────────────

export async function getAdminStats(): Promise<AdminStatsData> {
  try {
    const { data } = await apiClient.get<ApiResponse<AdminStatsData>>(
      "/admin/stats"
    );
    if (!data.success || !data.data) {
      throw new Error(data.message || "Failed to fetch admin stats");
    }
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

// ────────────────── Posts ──────────────────

export interface AdminPostsResponse {
  posts: PostSummaryAdmin[];
  meta?: PaginationMeta;
}

export async function getAdminPosts(
  params?: AdminGetPostsParams
): Promise<AdminPostsResponse> {
  try {
    const { data } = await apiClient.get<ApiResponse<PostSummaryAdmin[]>>(
      "/admin/posts",
      { params }
    );
    if (!data.success) {
      throw new Error(data.message || "Failed to fetch admin posts");
    }
    return { posts: data.data || [], meta: data.meta };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function updatePostStatus(
  postId: string,
  status: "ACTIVE" | "REMOVED"
): Promise<PostSummaryAdmin> {
  try {
    const { data } = await apiClient.put<ApiResponse<PostSummaryAdmin>>(
      `/admin/posts/${postId}/status`,
      { status } as AdminUpdatePostStatusRequest
    );
    if (!data.success || !data.data) {
      throw new Error(data.message || "Failed to update post status");
    }
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function adminDeletePost(postId: string): Promise<void> {
  try {
    const { data } = await apiClient.delete<ApiResponse>(
      `/admin/posts/${postId}`
    );
    if (!data.success) {
      throw new Error(data.message || "Failed to delete post");
    }
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

// ────────────────── Reports ──────────────────

export interface AdminReportsResponse {
  posts: AdminReportedPost[];
  meta?: PaginationMeta;
}

export async function getAdminReports(
  params?: AdminGetReportsParams
): Promise<AdminReportsResponse> {
  try {
    const { data } = await apiClient.get<ApiResponse<AdminReportedPost[]>>(
      "/admin/reports",
      { params }
    );
    if (!data.success) {
      throw new Error(data.message || "Failed to fetch reports");
    }
    return { posts: data.data || [], meta: data.meta };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function dismissReports(postId: string): Promise<void> {
  try {
    const { data } = await apiClient.delete<ApiResponse>(
      `/admin/reports/${postId}/dismiss`
    );
    if (!data.success) {
      throw new Error(data.message || "Failed to dismiss reports");
    }
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

// ────────────────── Users ──────────────────

export interface AdminUsersResponse {
  users: AdminUser[];
  meta?: PaginationMeta;
}

export async function getAdminUsers(
  params?: AdminGetUsersParams
): Promise<AdminUsersResponse> {
  try {
    const { data } = await apiClient.get<ApiResponse<AdminUser[]>>(
      "/admin/users",
      { params }
    );
    if (!data.success) {
      throw new Error(data.message || "Failed to fetch users");
    }
    return { users: data.data || [], meta: data.meta };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function updateUserRole(
  userId: string,
  role: "USER" | "ADMIN"
): Promise<AdminUserActionResponse> {
  try {
    const { data } = await apiClient.put<ApiResponse<AdminUserActionResponse>>(
      `/admin/users/${userId}/role`,
      { role } as AdminUpdateRoleRequest
    );
    if (!data.success || !data.data) {
      throw new Error(data.message || "Failed to update user role");
    }
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function toggleBanUser(
  userId: string
): Promise<AdminUserActionResponse> {
  try {
    const { data } = await apiClient.put<ApiResponse<AdminUserActionResponse>>(
      `/admin/users/${userId}/ban`
    );
    if (!data.success || !data.data) {
      throw new Error(data.message || "Failed to ban/unban user");
    }
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function adminDeleteUser(userId: string): Promise<void> {
  try {
    const { data } = await apiClient.delete<ApiResponse>(
      `/admin/users/${userId}`
    );
    if (!data.success) {
      throw new Error(data.message || "Failed to delete user");
    }
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
