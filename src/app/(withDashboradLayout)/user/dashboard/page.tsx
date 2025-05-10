// app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { fetchPosts } from "@/app/actions/post-actions";
import { getSingleUser } from "@/components/services/AuthService/UserService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Alert,
  AlertDescription
} from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { IMeta, PostStatus, TPost, TUser, UserRole, UserStatus } from "@/types";
import {
  Activity,
  Eye,
  FileText,
  Key,
  Settings,
  Trash,
  User,
} from "lucide-react";
import { PaginationComponent } from "@/components/shared/PaginationComponent";
import { TableSkeleton } from "@/components/shared/TableSkeleton";

export default function UserDashboard() {
  const [singleUser, setSingleUser] = useState<TUser | null>(null);
  const [userPosts, setUserPosts] = useState<TPost[]>([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<IMeta>({ page, limit: 1, total: 0, totalPages: 1 })
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const userData = await getSingleUser();
        setSingleUser(userData);

        const postsData = await fetchPosts({
          page: page,
          limit: 5,
          authorId: userData?.id,
        });
        setUserPosts(postsData.data.data);
        setMeta(postsData.data.meta);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [page]);

  return (
    <div className="space-y-8">
      {/* User Stats Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meta.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
            <Activity className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userPosts?.reduce((acc, post) => acc + post._count.comments, 0) || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <Activity className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userPosts?.reduce((acc, post) => acc + post._count.votes, 0) || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <User className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-md font-medium">
              <Badge variant="outline" className={`${singleUser?.status === 'ACTIVE' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                singleUser?.status === UserStatus.BLOCKED ? 'bg-red-100 text-red-800 hover:bg-red-100' :
                  'bg-amber-100 text-amber-800 hover:bg-amber-100'
                }`}>
                {singleUser?.status || 'Unknown'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Posts Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Your Posts Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-accent">
              <TableRow>
                <TableHead className="rounded-l-lg">Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Votes</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Ratings</TableHead>
                <TableHead className="text-center rounded-r-lg">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton rows={5} cols={8} />
              ) : userPosts?.length ? (
                userPosts.map((post) => (
                  <TableRow key={post.pId}>
                    <TableCell className="font-medium max-w-xs truncate">
                      {post.title}
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className={`
                        ${post.status === "APPROVED" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                          post.status === "PENDING" ? "bg-amber-100 text-amber-800 hover:bg-amber-100" :
                            post.status === PostStatus.REJECTED ? "bg-red-100 text-red-800 hover:bg-red-100" :
                              "bg-gray-100 text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        {post.status}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <span className="text-amber-600">
                        {post.category?.name || "Uncategorized"}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className={`${post.location ? "text-gray-600" : "text-gray-400"}`}>
                        {post.location || "N/A"}
                      </span>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className={`${post._count.votes > 0 ? "bg-blue-50 text-blue-600" : ""}`}>
                        {post._count.votes}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className={`${post._count.comments > 0 ? "bg-purple-50 text-purple-600" : ""}`}>
                        {post._count.comments}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className={`${post._count.postRatings > 0 ? "bg-amber-50 text-amber-600" : ""}`}>
                        {post._count.postRatings}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-center items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4 text-blue-600" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Trash className="h-4 w-4 text-red-600" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <Alert className="bg-blue-50 border-blue-200">
                      <AlertDescription>
                        {`You haven't created any posts yet. Start sharing your content today!`}
                      </AlertDescription>
                    </Alert>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          {meta && (
            <PaginationComponent
              isTableLoading={isLoading}
              meta={meta}
              setPage={setPage}
              page={page}
              tableContentName="posts"
            />
          )}
        </CardFooter>
      </Card>

      {/* User Profile Section */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={singleUser?.userDetails?.profilePhoto || ""} alt={singleUser?.userDetails?.name || "User"} />
                    <AvatarFallback className="text-2xl">
                      {singleUser?.userDetails?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="font-medium text-lg">{singleUser?.userDetails?.name || "User"}</h3>
                    <p className="text-sm text-gray-500">{singleUser?.email}</p>
                    <Badge className={`mt-2 ${singleUser?.role === UserRole.PREMIUM_USER ? "bg-amber-100 text-amber-800 hover:bg-amber-100" :
                      singleUser?.role === UserRole.ADMIN ? "bg-purple-100 text-purple-800 hover:bg-purple-100" :
                        "bg-blue-100 text-blue-800 hover:bg-blue-100"
                      }`}>
                      {singleUser?.role || "USER"}
                    </Badge>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Account Status</p>
                      <p className="font-medium">{singleUser?.status || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Joined</p>
                      <p className="font-medium">{singleUser?.createdAt ? new Date(singleUser.createdAt).toLocaleDateString() : "Unknown"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="font-medium">{singleUser?.userDetails?.name || "Not specified"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="font-medium">{singleUser?.email || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full sm:w-auto" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </CardFooter>
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
                  Manage your account security settings and password options
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="cursor-pointer text-blue-600 hover:text-blue-800">
                  Change Password
                </Button>
                <Button variant="outline" className="cursor-pointer text-amber-600 hover:text-amber-800">
                  Forget Password
                </Button>
                <Button variant="outline" className="cursor-pointer text-green-600 hover:text-green-800">
                  Reset Password
                </Button>
              </div>

              <div className="pt-4">
                <h3 className="text-sm font-medium mb-2">Two-Factor Authentication</h3>
                <Button variant="default" size="sm">
                  Enable 2FA
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}