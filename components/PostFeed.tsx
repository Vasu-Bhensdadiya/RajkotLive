"use client";

import { useState, useEffect } from "react";
import PostCard from "./PostCard";
import { PostSummary, PostCategory } from "@/lib/types";
import { getPosts } from "@/lib/api/postService";
import { Loader2 } from "lucide-react";

interface PostFeedProps {
  category?: PostCategory;
}

export default function PostFeed({ category }: PostFeedProps) {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPosts({ category, sort: "latest" })
      .then((res) => {
        setPosts(res.posts);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No posts found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
