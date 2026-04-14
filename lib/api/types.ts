// ────────────────── Enums ──────────────────

export type Role = "USER" | "ADMIN";
export type Gender = "MALE" | "FEMALE" | "OTHER";
export type UserStatus = "ACTIVE" | "INACTIVE";
export type PostCategory = "EVENT" | "FOOD" | "SPORTS" | "DAYRO" | "OTHER";
export type PostStatus = "ACTIVE" | "REMOVED";

// ────────────────── Global Response Wrapper ──────────────────

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  success: false;
  message: string;
  statusCode?: number;
}

// ────────────────── Shared Schemas ──────────────────

export interface AuthorSummary {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
}

export interface PostSummary {
  id: string;
  title: string;
  content: string;
  images: string[];
  category: PostCategory;
  subcategory: string | null;
  tags: string[];
  status: PostStatus;
  eventDate: string | null;
  eventVenue: string | null;
  isOngoing: boolean;
  viewCount: number;
  address: string | null;
  locationCoordinate: string | null;
  authorId: string;
  author: AuthorSummary;
  createdAt: string;
  updatedAt: string;
  _count: {
    likes: number;
    comments: number;
  };
}

export interface PostSummaryAdmin extends PostSummary {
  _count: {
    likes: number;
    comments: number;
    reports: number;
  };
}

export interface CommentItem {
  id: string;
  content: string;
  authorId: string;
  author: AuthorSummary;
  postId: string;
  parentId: string | null;
  createdAt: string;
  replies: CommentItem[];
}

export interface PostDetail extends PostSummary {
  comments: CommentItem[];
}

// ────────────────── Auth ──────────────────

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  displayName: string;
  gender?: Gender;
}

export interface RegisterResponseData {
  user: {
    id: string;
    username: string;
    email: string;
    displayName: string;
    gender: string | null;
    role: string;
    createdAt: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseData {
  user: {
    id: string;
    username: string;
    email: string;
    displayName: string;
    avatar: string | null;
    bio: string | null;
    role: string;
    gender: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponseData {
  accessToken: string;
  refreshToken: string;
}

export interface MeResponseData {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar: string | null;
  bio: string | null;
  gender: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    posts: number;
    likes: number;
  };
}

// ────────────────── Upload ──────────────────

export interface UploadedFile {
  url: string;
  fileType: string;
  originalName: string;
  size: number;
  mimeType: string;
}

// ────────────────── Posts ──────────────────

export interface GetPostsParams {
  category?: PostCategory;
  subcategory?: string;
  search?: string;
  sort?: "latest" | "popular" | "upcoming";
  page?: number;
  limit?: number;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  category: PostCategory;
  subcategory?: string;
  tags?: string | string[];
  eventDate?: string;
  eventVenue?: string;
  isOngoing?: boolean;
  address?: string;
  locationCoordinate?: string;
  images?: string[];
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  category?: PostCategory;
  subcategory?: string;
  tags?: string | string[];
  eventDate?: string;
  eventVenue?: string;
  isOngoing?: boolean;
  address?: string;
  locationCoordinate?: string;
  images?: string[];
}

export interface LikeResponseData {
  liked: boolean;
}

export interface SaveResponseData {
  saved: boolean;
}

export interface ReportPostRequest {
  reason?: string;
}

export interface ReportResponseData {
  id: string;
  reason: string | null;
  userId: string;
  postId: string;
  createdAt: string;
}

// ────────────────── Comments ──────────────────

export interface AddCommentRequest {
  content: string;
}

// ────────────────── Users ──────────────────

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  bio: string | null;
  gender: string | null;
  role: string;
  createdAt: string;
  _count: {
    posts: number;
  };
  posts: {
    id: string;
    title: string;
    category: PostCategory;
    createdAt: string;
    _count: { likes: number; comments: number };
  }[];
  likesReceived: number;
}

export interface UpdateProfileRequest {
  displayName?: string;
  bio?: string;
  gender?: Gender;
}

// ────────────────── Admin ──────────────────

export interface AdminStatsData {
  totalPosts: number;
  todayPosts: number;
  removedPosts: number;
  totalUsers: number;
  bannedUsers: number;
  totalReports: number;
  reportedPostsCount: number;
}

export interface AdminGetPostsParams {
  search?: string;
  category?: PostCategory;
  status?: PostStatus;
  reported?: "true";
  page?: number;
  limit?: number;
}

export interface AdminUpdatePostStatusRequest {
  status: PostStatus;
}

export interface AdminGetReportsParams {
  page?: number;
  limit?: number;
}

export interface AdminReportedPost extends PostSummaryAdmin {
  reports: {
    id: string;
    reason: string | null;
    userId: string;
    postId: string;
    createdAt: string;
    user: {
      id: string;
      username: string;
      displayName: string;
    };
  }[];
}

export interface AdminGetUsersParams {
  search?: string;
  status?: UserStatus;
  role?: Role;
  page?: number;
  limit?: number;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar: string | null;
  gender: string | null;
  role: Role;
  status: UserStatus;
  createdAt: string;
  _count: {
    posts: number;
    comments: number;
    likes: number;
    reports: number;
  };
}

export interface AdminUpdateRoleRequest {
  role: Role;
}

export interface AdminUserActionResponse {
  id: string;
  username: string;
  email: string;
  displayName: string;
  role: string;
  status: string;
}

// ────────────────── Gender Options ──────────────────

export interface GenderOption {
  value: Gender;
  label: string;
}
