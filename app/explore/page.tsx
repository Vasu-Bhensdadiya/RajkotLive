"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { PostSummary } from "@/lib/types";
import { getPosts } from "@/lib/api/postService";

const ExploreMapClient = dynamic(
  () => import("@/components/ExploreMapClient"),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    ),
  }
);

export default function ExplorePage() {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts({ limit: 100 })
      .then((res) => {
        setPosts(res.posts.filter((p) => p.locationCoordinate));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <ExploreMapClient posts={posts} />;
}
