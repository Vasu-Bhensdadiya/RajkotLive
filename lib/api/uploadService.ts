import apiClient, { extractErrorMessage } from "./client";
import { ApiResponse, UploadedFile } from "./types";

export async function uploadImages(
  files: File[],
  fileType: string = "post_image"
): Promise<UploadedFile[]> {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    formData.append("fileType", fileType);

    const { data } = await apiClient.post<ApiResponse<UploadedFile[]>>(
      "/upload",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    if (!data.success || !data.data) {
      throw new Error(data.message || "Upload failed");
    }
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}

export async function uploadAvatar(file: File): Promise<UploadedFile> {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const { data } = await apiClient.post<ApiResponse<UploadedFile>>(
      "/upload/avatar",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    if (!data.success || !data.data) {
      throw new Error(data.message || "Avatar upload failed");
    }
    return data.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
