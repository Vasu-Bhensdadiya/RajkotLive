import apiClient, { extractErrorMessage } from "./client";
import { ApiResponse, CommentItem } from "./types";

export async function addComment(
  postId: string,
  content: string
): Promise<CommentItem> {
  try {
    const { data } = await apiClient.post<ApiResponse<CommentItem>>(
      `/posts/${postId}/comments`,
      { content }
    );
    if (!data.success || !data.data) {
      throw new Error(data.message || "Failed to add comment");
    }
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function replyToComment(
  commentId: string,
  content: string
): Promise<CommentItem> {
  try {
    const { data } = await apiClient.post<ApiResponse<CommentItem>>(
      `/comments/${commentId}/reply`,
      { content }
    );
    if (!data.success || !data.data) {
      throw new Error(data.message || "Failed to add reply");
    }
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function deleteComment(commentId: string): Promise<void> {
  try {
    const { data } = await apiClient.delete<ApiResponse>(
      `/comments/${commentId}`
    );
    if (!data.success) {
      throw new Error(data.message || "Failed to delete comment");
    }
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
