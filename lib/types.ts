// Re-export API types for convenience
export type {
  PostCategory,
  Role,
  Gender,
  UserStatus,
  PostStatus,
  AuthorSummary,
  PostSummary,
  PostSummaryAdmin,
  CommentItem,
  PostDetail,
  PaginationMeta,
  ApiResponse,
  AdminStatsData,
  AdminUser,
  AdminReportedPost,
  UserProfile,
  UploadedFile,
} from "./api/types";

// ────────────────── App-level types (used across UI) ──────────────────

export type { PostCategory as Category } from "./api/types";

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar: string | null;
  bio: string | null;
  gender: string | null;
  role: string;
  status?: string;
  createdAt: string;
  updatedAt?: string;
  _count?: {
    posts: number;
    likes: number;
  };
}
