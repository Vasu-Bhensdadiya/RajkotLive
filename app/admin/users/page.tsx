"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getAdminUsers,
  adminDeleteUser,
  toggleBanUser,
} from "@/lib/api/adminService";
import { AdminUser } from "@/lib/types";
import { Trash2, Search, Ban, Shield, UserCheck } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadUsers = () => {
    setLoading(true);
    getAdminUsers()
      .then((res) => {
        setUsers(res.users);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (userId: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete user "${name}"? This will also delete all their posts.`
      )
    )
      return;
    try {
      await adminDeleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch {
      // ignore
    }
  };

  const handleToggleBan = async (userId: string) => {
    try {
      const result = await toggleBanUser(userId);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, status: result.status as AdminUser["status"] }
            : u
        )
      );
    } catch {
      // ignore
    }
  };

  const filtered = users.filter((u) => {
    if (u.role === "ADMIN") return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        u.displayName.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    }
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
        <h1 className="text-2xl font-bold">Users Management</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage platform users — ban or remove accounts
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, username, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        {filtered.length} user{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Users List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No users found.
            </CardContent>
          </Card>
        ) : (
          filtered.map((user) => {
            const isBanned = user.status === "INACTIVE";
            return (
              <Card
                key={user.id}
                className={
                  isBanned ? "border-red-300 bg-red-50/50 opacity-75" : ""
                }
              >
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Avatar */}
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={user.avatar || undefined}
                        alt={user.displayName}
                      />
                      <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                    </Avatar>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-sm">
                          {user.displayName}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          @{user.username}
                        </span>
                        {user.role === "ADMIN" && (
                          <Badge className="bg-amber-100 text-amber-800 text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                        {isBanned && (
                          <Badge variant="destructive" className="text-xs">
                            <Ban className="h-3 w-3 mr-1" />
                            Banned
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {user.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                        {" · "}
                        {user._count.posts} posts · {user._count.comments}{" "}
                        comments
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isBanned ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleBan(user.id)}
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Unban
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleBan(user.id)}
                          className="text-orange-600 border-orange-300 hover:bg-orange-50"
                        >
                          <Ban className="h-4 w-4 mr-1" />
                          Ban
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(user.id, user.displayName)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
