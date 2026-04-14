"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getAdminReports,
  adminDeletePost,
  dismissReports,
} from "@/lib/api/adminService";
import { AdminReportedPost } from "@/lib/types";
import { categoryLabels, categoryColors } from "@/lib/mock-data";
import {
  Trash2,
  CheckCircle,
  ExternalLink,
  Flag,
  AlertTriangle,
  Eye,
  Heart,
} from "lucide-react";

export default function AdminReportsPage() {
  const [reported, setReported] = useState<AdminReportedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminReports()
      .then((res) => {
        setReported(res.posts);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDismiss = async (postId: string) => {
    try {
      await dismissReports(postId);
      setReported((prev) => prev.filter((p) => p.id !== postId));
    } catch {
      // ignore
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Delete this post permanently? This cannot be undone."))
      return;
    try {
      await adminDeletePost(postId);
      setReported((prev) => prev.filter((p) => p.id !== postId));
    } catch {
      // ignore
    }
  };

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
        <h1 className="text-2xl font-bold">Reported Content</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Review and moderate reported posts
        </p>
      </div>

      {reported.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="font-semibold text-lg">All Clear!</h3>
            <p className="text-muted-foreground text-sm mt-1">
              No reported posts to review.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">
              <strong>
                {reported.length} post{reported.length !== 1 ? "s" : ""}
              </strong>{" "}
              flagged by users for review.
            </p>
          </div>

          <div className="space-y-4">
            {reported.map((post) => (
              <Card key={post.id} className="border-red-200 bg-red-50/30">
                <CardContent className="p-5">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {post.images?.[0] && (
                        <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={post.images[0]}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold">{post.title}</h3>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              categoryColors[post.category]
                            }`}
                          >
                            {categoryLabels[post.category]}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>by {post.author.displayName}</span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" /> {post.viewCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" /> {post._count.likes}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Report Details */}
                    <div className="p-3 rounded-lg bg-red-100/50 border border-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Flag className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-semibold text-red-800">
                          {post._count.reports} Report
                          {post._count.reports !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <p className="text-xs text-red-700">
                        Reported by {post.reports.length} user
                        {post.reports.length !== 1 ? "s" : ""} &middot; Post
                        created {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-1">
                      <Link href={`/post/${post.id}`} target="_blank">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Post
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDismiss(post.id)}
                        className="text-green-700 border-green-300 hover:bg-green-50"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Dismiss Report
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete Post
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
