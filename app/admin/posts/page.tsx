"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getAdminPosts, adminDeletePost } from "@/lib/api/adminService";
import { PostSummaryAdmin, PostCategory } from "@/lib/types";
import { categoryLabels, categoryColors } from "@/lib/mock-data";
import {
  Trash2,
  Search,
  Eye,
  Heart,
  MessageSquare,
  Flag,
  ExternalLink,
} from "lucide-react";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<PostSummaryAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<PostCategory | "all">(
    "all"
  );
  const [filterReported, setFilterReported] = useState(false);

  useEffect(() => {
    getAdminPosts()
      .then((res) => {
        setPosts(res.posts);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (postId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this post? This cannot be undone."
      )
    )
      return;
    try {
      await adminDeletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch {
      // ignore
    }
  };

  const filtered = posts.filter((p) => {
    if (search) {
      const q = search.toLowerCase();
      if (
        !p.title.toLowerCase().includes(q) &&
        !p.author.displayName.toLowerCase().includes(q)
      )
        return false;
    }
    if (filterCategory !== "all" && p.category !== filterCategory) return false;
    if (filterReported && p._count.reports === 0) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Posts Management</h1>
        <p className="text-muted-foreground text-sm mt-1">
          View, search, and manage all posts on the platform
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or author..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) =>
                setFilterCategory(e.target.value as PostCategory | "all")
              }
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="all">All Categories</option>
              {(Object.keys(categoryLabels) as PostCategory[]).map((cat) => (
                <option key={cat} value={cat}>
                  {categoryLabels[cat]}
                </option>
              ))}
            </select>
            <Button
              variant={filterReported ? "destructive" : "outline"}
              onClick={() => setFilterReported(!filterReported)}
              className="whitespace-nowrap"
            >
              <Flag className="h-4 w-4 mr-1" />
              {filterReported ? "Showing Reported" : "Show Reported"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filtered.length} of {posts.length} posts
      </p>

      {/* Posts Table */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No posts found matching your filters.
            </CardContent>
          </Card>
        ) : (
          filtered.map((post) => (
            <Card
              key={post.id}
              className={
                post._count.reports > 0 ? "border-red-300 bg-red-50/50" : ""
              }
            >
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Post Image */}
                  {post.images?.[0] && (
                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.images[0]}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Post Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm truncate">
                        {post.title}
                      </h3>
                      <Badge
                        variant="outline"
                        className={`text-xs ${categoryColors[post.category]}`}
                      >
                        {categoryLabels[post.category]}
                      </Badge>
                      {post._count.reports > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          <Flag className="h-3 w-3 mr-1" />
                          {post._count.reports} reports
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      by {post.author.displayName} &middot;{" "}
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" /> {post.viewCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" /> {post._count.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />{" "}
                        {post._count.comments}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link href={`/post/${post.id}`} target="_blank">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
