// app/admin/page.tsx
import { fetchPosts } from "@/app/actions/post-actions";
import {
  fetchUsersByRole,
  getAllUsers,
  getSingleUser,
} from "@/components/services/AuthService/UserService";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PostStatus, UserRole } from "@/types";
import { authOptions } from "@/utils/authOptions";
import { Activity, Badge, Shield, Star, UserPlus, Users } from "lucide-react";
import { getServerSession } from "next-auth";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const singleUser = await getSingleUser();
  console.log({ singleUser });
  const userData = await getAllUsers();
  const premiumUser = await fetchUsersByRole("PREMIUM_USER");
  const pendingModeration = await fetchPosts(1, 5, PostStatus.PENDING);
  console.log(pendingModeration.totalPosts);

  const handleChangePassword = () => {};
  return (
    <div className="space-y-8">
      {/* Admin Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData?.meta.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Pending Moderation
            </CardTitle>
            <Shield className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingModeration.totalPosts}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
            <Star className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{premiumUser?.meta?.total}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users Table */}
      <Card>
        <CardHeader>
          <CardTitle> User Activity | Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* {recentUsers?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'Active' ? 'bg-green-100 text-green-800' :
                      user.status === 'Banned' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`${
                      user.role === 'Premium' ? 'text-amber-600' : 'text-gray-600'
                    }`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Manage</Button>
                  </TableCell>
                </TableRow>
              ))} */}
              <TableRow>
                <TableCell>{singleUser.email}</TableCell>
                <TableCell>{singleUser.userDetails.name}</TableCell>
                <TableCell>{singleUser.status}</TableCell>
                <TableCell>
                  <span
                    className={`${
                      singleUser.role === UserRole.ADMIN ||
                      UserRole.PREMIUM_USER
                        ? "text-amber-600"
                        : "text-gray-600"
                    }`}
                  >
                    {singleUser.role}
                    <Badge></Badge>
                  </span>
                </TableCell>
                <TableCell className="text-right flex flex-col justify-end items-end gap-1.5">
                  <Button
                 
                    variant="outline"
                    size="sm"
                    className="cursor-pointer text-blue-600 hover:text-blue-800"
                  >
                    Change Password
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="cursor-pointer text-white hover:text-red-800"
                  >
                    Forget Password
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer text-green-600 hover:text-green-800"
                  >
                    Reset Password
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* System Health Monitor */}
      <Card className="border-blue-100 bg-blue-50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600">
            <Activity className="h-5 w-5" />
            <CardTitle>System Health</CardTitle>
          </div>
          <span className="text-sm text-blue-600">All systems operational</span>
        </CardHeader>
      </Card>
    </div>
  );
}
