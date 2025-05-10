// app/admin/permissions/page.tsx
'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const roles = [
  { name: "Admin", managePosts: true, manageUsers: true, manageContent: true },
  { name: "Moderator", managePosts: true, manageUsers: false, manageContent: true },
  { name: "Premium", managePosts: false, manageUsers: false, manageContent: false },
];

export default function PermissionsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">Role Permissions</h2>
        <p className="text-sm text-gray-500">Manage user roles and access levels</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Role</TableHead>
            <TableHead>Manage Posts</TableHead>
            <TableHead>Manage Users</TableHead>
            <TableHead>Manage Content</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.name}>
              <TableCell className="font-medium">{role.name}</TableCell>
              <TableCell>
                {role.managePosts ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-600" />}
              </TableCell>
              <TableCell>
                {role.manageUsers ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-600" />}
              </TableCell>
              <TableCell>
                {role.manageContent ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-600" />}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}