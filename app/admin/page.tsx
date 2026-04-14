"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminStats } from "@/lib/api/adminService";
import { AdminStatsData } from "@/lib/types";
import { Users, FileText, Flag } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Banned Users",
      value: stats.bannedUsers,
      icon: Users,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Total Posts",
      value: stats.totalPosts,
      icon: FileText,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Today's Posts",
      value: stats.todayPosts,
      icon: FileText,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Removed Posts",
      value: stats.removedPosts,
      icon: FileText,
      color: "text-gray-600",
      bg: "bg-gray-50",
    },
    {
      title: "Total Reports",
      value: stats.totalReports,
      icon: Flag,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      title: "Reported Posts",
      value: stats.reportedPostsCount,
      icon: Flag,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Overview of your RajkotLive platform
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-3 rounded-full`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-muted-foreground">Platform</p>
              <p className="font-mono mt-1">RajkotLive v1.0</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-muted-foreground">API Base</p>
              <p className="font-mono mt-1">
                {process.env.NEXT_PUBLIC_API_BASE_URL || "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
