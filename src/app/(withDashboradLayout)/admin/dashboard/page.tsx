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
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import {
  Alert,
  AlertDescription
} from "@/components/ui/alert";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { PostStatus, UserRole } from "@/types";
import { Activity, Shield, Star, Users, Key, LogOut, UserCog } from "lucide-react";

export default async function AdminDashboard() {
  const singleUser = await getSingleUser();
  const userData = await getAllUsers();
  const premiumUsers = await fetchUsersByRole(UserRole.PREMIUM_USER);
  const pendingModeration = await fetchPosts({
    page: 1,
    limit: 1,
    status: PostStatus.PENDING,
  });

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
            <div className="text-2xl font-bold">{userData?.meta.total || 0}</div>
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
              {pendingModeration.data.meta.total || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
            <Star className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{premiumUsers.data.meta.total || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* User Profile Section */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5" />
                User Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={singleUser?.userDetails?.avatar || ""} alt={singleUser?.userDetails?.name || "User"} />
                    <AvatarFallback className="text-2xl">
                      {singleUser?.userDetails?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="font-medium text-lg">{singleUser?.userDetails?.name}</h3>
                    <p className="text-sm text-gray-500">{singleUser?.email}</p>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Role</p>
                      <p className="font-medium">{singleUser?.role || "User"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <p className="font-medium">{singleUser?.status || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Joined</p>
                      <p className="font-medium">{singleUser?.createdAt ? new Date(singleUser.createdAt).toLocaleDateString() : "Unknown"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Last Login</p>
                      <p className="font-medium">{singleUser?.lastLogin ? new Date(singleUser.lastLogin).toLocaleDateString() : "Unknown"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription>
                  Manage your account security settings and access control
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="cursor-pointer text-blue-600 hover:text-blue-800">
                  Change Password
                </Button>
                <Button variant="outline" className="cursor-pointer text-green-600 hover:text-green-800">
                  Reset Password
                </Button>
              </div>

              <Button variant="destructive" size="sm" className="mt-4">
                <LogOut className="h-4 w-4 mr-2" />
                Force Logout All Devices
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Last login</TableCell>
                    <TableCell>{singleUser?.lastLogin ? new Date(singleUser.lastLogin).toLocaleString() : "Unknown"}</TableCell>
                    <TableCell>Success</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}