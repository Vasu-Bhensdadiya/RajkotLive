"use client";

import Link from "next/link";
import { Heart, MessageCircle, Eye, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostSummary } from "@/lib/types";
import { categoryLabels, categoryColors } from "@/lib/mock-data";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: PostSummary;
}
export default function PostCard({ post }: PostCardProps) {
  const image = post.images?.[0];

  return (
    <Link href={`/post/${post.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        {image && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <Badge
              className={`absolute top-3 left-3 ${
                categoryColors[post.category]
              }`}
              variant="outline"
            >
              {categoryLabels[post.category]}
            </Badge>
          </div>
        )}
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>

          {post.address && (
            <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
              <span className="truncate">{post.address}</span>
            </div>
          )}

          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {post.content}
          </p>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={post.author.avatar || undefined} />
                <AvatarFallback>{post.author.displayName[0]}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {post.author.displayName}
              </span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Heart className="h-3.5 w-3.5" />
                {post._count.likes}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" />
                {post._count.comments}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {post.viewCount}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
