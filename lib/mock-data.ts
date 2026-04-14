import { PostCategory } from "./types";

// UI display constants — these are pure mappings, not mock data
export const categoryLabels: Record<PostCategory, string> = {
  EVENT: "Events",
  FOOD: "Food & Stalls",
  SPORTS: "Sports",
  DAYRO: "Dayro",
  OTHER: "General",
};

export const categoryColors: Record<PostCategory, string> = {
  EVENT: "bg-amber-100 text-amber-800 border-amber-300",
  FOOD: "bg-red-100 text-red-800 border-red-300",
  SPORTS: "bg-green-100 text-green-800 border-green-300",
  DAYRO: "bg-purple-100 text-purple-800 border-purple-300",
  OTHER: "bg-blue-100 text-blue-800 border-blue-300",
};

export const categoryMapColors: Record<PostCategory, string> = {
  EVENT: "#f59e0b",
  FOOD: "#ef4444",
  SPORTS: "#22c55e",
  DAYRO: "#a855f7",
  OTHER: "#3b82f6",
};
