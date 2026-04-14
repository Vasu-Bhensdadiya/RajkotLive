import apiClient, { extractErrorMessage } from "./client";
import {
  ApiResponse,
  PostSummary,
  PostDetail,
  GetPostsParams,
  CreatePostRequest,
  UpdatePostRequest,
  LikeResponseData,
  SaveResponseData,
  ReportPostRequest,
  ReportResponseData,
  PaginationMeta,
} from "./types";

export interface PostsResponse {
  posts: PostSummary[];
  meta?: PaginationMeta;
}

export async function getPosts(
  params?: GetPostsParams
): Promise<PostsResponse> {
  try {
    const { data } = await apiClient.get<ApiResponse<PostSummary[]>>(
      "/posts",
      { params }
    );
    if (!data.success) {
      throw new Error(data.message || "Failed to fetch posts");
    }
    return { posts: data.data || [], meta: data.meta };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function getPostById(id: string): Promise<PostDetail> {
  try {
    const { data } = await apiClient.get<ApiResponse<PostDetail>>(
      `/posts/${id}`
    );
    if (!data.success || !data.data) {
      throw new Error(data.message || "Post not found");
    }
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function createPost(
  payload: CreatePostRequest
): Promise<PostSummary> {
  try {
    const { data } = await apiClient.post<ApiResponse<PostSummary>>(
      "/posts",
      payload
    );
    if (!data.success || !data.data) {
      throw new Error(data.message || "Failed to create post");
    }
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function updatePost(
  id: string,
  payload: UpdatePostRequest
): Promise<PostSummary> {
  try {
    const { data } = await apiClient.put<ApiResponse<PostSummary>>(
      `/posts/${id}`,
      payload
    );
    if (!data.success || !data.data) {
      throw new Error(data.message || "Failed to update post");
    }
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function deletePost(id: string): Promise<void> {
  try {
    const { data } = await apiClient.delete<ApiResponse>(`/posts/${id}`);
    if (!data.success) {
      throw new Error(data.message || "Failed to delete post");
    }
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function toggleLike(postId: string): Promise<LikeResponseData> {
  try {
    const { data } = await apiClient.post<ApiResponse<LikeResponseData>>(
      `/posts/${postId}/like`
    );
    if (!data.success || !data.data) {
      throw new Error(data.message || "Failed to toggle like");
    }
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function toggleSave(postId: string): Promise<SaveResponseData> {
  try {
    const { data } = await apiClient.post<ApiResponse<SaveResponseData>>(
      `/posts/${postId}/save`
    );
    if (!data.success || !data.data) {
      throw new Error(data.message || "Failed to toggle save");
    }
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function reportPost(
  postId: string,
  reason?: string
): Promise<ReportResponseData> {
  try {
    const { data } = await apiClient.post<ApiResponse<ReportResponseData>>(
      `/posts/${postId}/report`,
      { reason } as ReportPostRequest
    );
    if (!data.success || !data.data) {
      throw new Error(data.message || "Failed to report post");
    }
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
