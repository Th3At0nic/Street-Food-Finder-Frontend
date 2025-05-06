// app/admin/users/page.tsx
'use client';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Star, Search, Ban, Mail } from "lucide-react";

const users = [
  { id: 1, email: "user1@example.com", role: "admin", status: "active", posts: 12 },
  { id: 2, email: "user2@example.com", role: "premium", status: "active", posts: 5 },
  { id: 3, email: "user3@example.com", role: "user", status: "banned", posts: 0 }
];

export default function UserManagementPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <User className="h-6 w-6 text-blue-600" />
            <span className="text-xl sm:text-2xl">User Management</span>
          </h2>
          <p className="text-sm text-gray-500">Manage user accounts and permissions</p>
        </div>
        
        {/* Search and Filter */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 w-full sm:w-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              className="pl-10 w-full"
            />
          </div>
          <Select>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="user">Normal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[35%]">Email</TableHead>
                <TableHead className="w-[20%]">Role</TableHead>
                <TableHead className="w-[20%]">Status</TableHead>
                <TableHead className="w-[15%]">Posts</TableHead>
                <TableHead className="w-[10%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium truncate max-w-[200px] sm:max-w-none">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        user.role === 'admin' ? 'destructive' :
                        user.role === 'premium' ? 'secondary' : 'outline'
                      }
                      className="text-xs sm:text-sm"
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.status === 'active' ? 'default' : 'destructive'}
                      className="text-xs sm:text-sm"
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.posts}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 sm:gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="destructive" 
                        className="h-8 w-8"
                      >
                        <Ban className="h-4 w-4" />
                      </Button>
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