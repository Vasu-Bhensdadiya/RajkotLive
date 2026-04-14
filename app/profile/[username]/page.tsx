"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { CalendarDays, FileText, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import PostCard from "@/components/PostCard";
import { PostSummary, UserProfile } from "@/lib/types";
import { getUserByUsername } from "@/lib/api/userService";
import { getPosts } from "@/lib/api/postService";
import { format } from "date-fns";

export default function ProfilePage() {
  const params = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const username = params.username as string;
    Promise.all([getUserByUsername(username), getPosts({ limit: 50 })])
      .then(([u, postsRes]) => {
        setProfile(u);
        // Filter posts by this author
        setPosts(postsRes.posts.filter((p) => p.author.username === username));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.username]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">User not found</h2>
        <p className="text-muted-foreground">This user doesn&apos;t exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar || undefined} />
              <AvatarFallback className="text-2xl">
                {profile.displayName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-bold">{profile.displayName}</h1>
              <p className="text-muted-foreground">@{profile.username}</p>
              {profile.bio && <p className="text-sm mt-2">{profile.bio}</p>}
              <div className="flex items-center gap-4 mt-3 justify-center sm:justify-start text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  Joined {format(new Date(profile.createdAt), "MMM yyyy")}
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {profile._count?.posts ?? posts.length} posts
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      <h2 className="text-lg font-semibold mb-4">
        Posts by {profile.displayName} ({posts.length})
      </h2>

      {posts.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No posts yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
