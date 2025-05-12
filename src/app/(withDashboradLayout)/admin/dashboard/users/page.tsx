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
import { User, Search, Ban, Mail, Blocks } from "lucide-react";
import { useEffect, useState } from "react";
import {
  fetchUsersByRole,
  getAllUsers,
  updateUsers,
} from "@/components/services/AuthService/UserService";
import { toast } from "sonner";
import { TUser, UserRole, UserStatus } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserManagementPage() {
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [users, setUsers] = useState<TUser[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [meta, setMeta] = useState<{
    limit: number;
    page: number;
    total: number;
  }>();

  useEffect(() => {
    const fetchUsers = async () => {
      if (
        selectedRole === "ADMIN" ||
        selectedRole === "USER" ||
        selectedRole === "PREMIUM_USER"
      ) {
        const result = await fetchUsersByRole({ role: selectedRole as UserRole });
        setUsers(result.data.data);
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

  const handleUserStatus = async (id: string, body: string) => {
    if (body === "BLOCKED") {
      const data = await updateUsers(id, body);
      if (data.statusCode === 200) {
        toast.success("User blocked successfully");
      }
    } else {
      const data = await updateUsers(id, body);
      if (data.statusCode === 200) {
        toast.success("User unblocked successfully");
      }
    }
  };
  console.log(users);
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <Card>
        {/* Header Section */}
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-6 w-6 text-blue-600" />
                <span className="text-xl sm:text-2xl">User Management</span>
              </CardTitle>
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
        </CardHeader>
        {/* Table Container */}
        <CardContent>
          <Table className="min-w-[600px]">
            <TableHeader className="bg-accent">
              <TableRow className="font-bold">
                <TableHead className="w-[30%] rounded-l-lg">Email</TableHead>
                <TableHead className="w-[20%]">User Name</TableHead>
                <TableHead className="w-[10%]">Role</TableHead>
                <TableHead className="w-[10%]">Status</TableHead>
                <TableHead className="w-[15%]">Posts</TableHead>
                <TableHead className="w-[10%] text-right] rounded-r-lg">Actions</TableHead>

              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium truncate max-w-[200px] sm:max-w-none">
                    {user.email}
                  </TableCell>
                  <TableCell className="font-medium truncate max-w-[200px] sm:max-w-none">
                    {user?.userDetails?.name || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.role === UserRole.ADMIN
                          ? "destructive"
                          : user.role === UserRole.PREMIUM_USER
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
                            onClick={() => handleUserStatus(user.id, UserStatus.ACTIVE)}
                            size="icon"
                            variant="destructive"
                            className="h-8 w-8 cursor-pointer"
                          >
                            <Blocks></Blocks>
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => handleUserStatus(user.id, UserStatus.BLOCKED)}
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
        </CardContent>
      </Card>
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
