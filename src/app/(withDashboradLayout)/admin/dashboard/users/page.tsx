// app/admin/users/page.tsx
"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Star, Search, Ban, Mail, Blocks } from "lucide-react";
import { useEffect, useState } from "react";
import {
  fetchUsersByRole,
  getAllUsers,
  updateUsers,
} from "@/components/services/AuthService/UserService";
import { toast } from "sonner";

// const users = [
//   {
//     id: 1,
//     email: "user1@example.com",
//     role: "admin",
//     status: "active",
//     posts: 12,
//   },
//   {
//     id: 2,
//     email: "user2@example.com",
//     role: "premium",
//     status: "active",
//     posts: 5,
//   },
//   {
//     id: 3,
//     email: "user3@example.com",
//     role: "user",
//     status: "banned",
//     posts: 0,
//   },
// ];

export default function UserManagementPage() {
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [users, setUsers] = useState<
    { id: number; email: string; role: string; status: string; posts: number }[]
  >([]);
  const [meta, setMeta] = useState<{
    limit: number;
    page: number;
    total: number;
  }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (
        selectedRole === "ADMIN" ||
        selectedRole === "USER" ||
        selectedRole === "PREMIUM_USER"
      ) {
        const result = await fetchUsersByRole(selectedRole);
        setUsers(result.data);
      }
      if (selectedRole === "all") {
        const result = await getAllUsers();
        setUsers(result.data);
      }
    };
    fetchUsers();
  }, [selectedRole]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await getAllUsers();
        setMeta(result.meta);
        setUsers(result.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers(); // call the inner function
  }, []);



  // Revalidate Work is not working -------

  const handleBlock = async (id: number, body: string) => {
    if (body === "BLOCKED") {
      const data = await updateUsers(id, body);
      if (data.statusCode === 200) {
        toast.success("User Blocked Sucessfully");
      }
    } else {
      const data = await updateUsers(id, body);
      if (data.statusCode === 200) {
        toast.success("User UnBlocked Sucessfully");
      }
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <User className="h-6 w-6 text-blue-600" />
            <span className="text-xl sm:text-2xl">User Management</span>
          </h2>
          <p className="text-sm text-gray-500">
            Manage user accounts and permissions
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 w-full sm:w-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search users..." className="pl-10 w-full" />
          </div>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="PREMIUM_USER">Premium User</SelectItem>
              <SelectItem value="USER">User</SelectItem>
            </SelectContent>
          </Select>
          <div className="mt-4">
            Selected Role: <b>{selectedRole}</b>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[30%]">Email</TableHead>
                <TableHead className="w-[20%]">User Name</TableHead>
                <TableHead className="w-[10%]">Role</TableHead>
                <TableHead className="w-[10%]">Status</TableHead>
                <TableHead className="w-[15%]">Posts</TableHead>
                <TableHead className="w-[10%] text-right">Actions</TableHead>
               
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium truncate max-w-[200px] sm:max-w-none">
                    {user.email}
                  </TableCell>
                  <TableCell className="font-medium truncate max-w-[200px] sm:max-w-none">
                    {user.userDetails.name}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.role === "admin"
                          ? "destructive"
                          : user.role === "premium"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs sm:text-sm"
                    >
                      {user.role}
                    </Badge>
                  </TableCell>


                  <TableCell>
                    <Badge
                      variant={
                        user.status === "ACTIVE" ? "default" : "destructive"
                      }
                      className="text-xs sm:text-sm"
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.authoredPosts?.length}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 sm:gap-2">
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Mail className="h-4 w-4" />
                      </Button>
                      {user?.status === "BLOCKED" ? (
                        <>
                          {" "}
                          <Button
                            onClick={() => handleBlock(user.id, "ACTIVE")}
                            size="icon"
                            variant="destructive"
                            className="h-8 w-8 cursor-pointer"
                          >
                            <Blocks></Blocks>
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => handleBlock(user.id, "BLOCKED")}
                          size="icon"
                          variant="destructive"
                          className="h-8 w-8 cursor-pointer"
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-500">
          Showing 1-{users.length} of {users.length} users
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled>
            Previous
          </Button>
          <Button variant="outline" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
