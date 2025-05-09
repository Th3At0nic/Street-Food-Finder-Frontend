// app/admin/page.tsx

import { fetchPosts } from "@/app/actions/post-actions";
import { getSingleUser } from "@/components/services/AuthService/UserService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Activity,
  Badge,
  Shield,
  Star,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";

export default async function AdminDashboard() {
  const singleUser = await getSingleUser();

  const pendingModeration = await fetchPosts({
    page: 1,
    limit: 5,
    status: PostStatus.PENDING,
  });
  console.log(pendingModeration.totalPosts);
  const SpecificUserPosts = await fetchPosts({
    page: 1,
    limit: 5,
    authorId: singleUser?.id,
  });

  console.log(SpecificUserPosts);
  const handleChangePassword = () => { };

  // Handle Delete Work
  const handleDelete = (id: string) => {
    console.log(id);
  };
  return (
    <div className="space-y-8">
      {/* Admin Stats Cards */}
      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Your Posts</CardTitle>
            <Shield className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {SpecificUserPosts?.totalPosts}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Your Posts Type
            </CardTitle>
            <Shield className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {SpecificUserPosts.posts.map((post) => (
              <div key={post?.pId} className="text-xl font-bold">
               <p> {post.pType}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Your Post Status
            </CardTitle>
            <Star className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {SpecificUserPosts.posts.map((post) => (
              <div key={post?.pId} className="text-xl font-bold">
               <p> {post.status}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Your Post Comments
            </CardTitle>
            <Star className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {SpecificUserPosts.posts.map((post) => (
              <div key={post?.pId} className="text-xl font-bold">
               <p> {post._count.comments}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Your Post Ratings
            </CardTitle>
            <Star className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {SpecificUserPosts.posts.map((post) => (
              <div key={post?.pId} className="text-xl font-bold">
               <p> {post._count.postRatings}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div> */}
      <Card>
        <CardHeader>
          <CardTitle> Your Posts Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Posts Title</TableHead>
                <TableHead>Post Status</TableHead>
                <TableHead>Post Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Counts Votes</TableHead>
                <TableHead>Counts Comments</TableHead>
                <TableHead>Counts Ratings</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SpecificUserPosts?.posts?.map((post) => (
                <TableRow key={post.pId}>
                  <TableCell className="font-medium">{post.title}</TableCell>

                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : post.status === "PENDING"
                          ? "bg-red-100 text-red-800"
                          : post.status === PostStatus.REJECTED
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                    >
                      {post.status}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="text-amber-600">
                      {post.category?.name}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span
                      className={`${post.location === "BD"
                        ? "text-amber-600"
                        : "text-gray-600"
                        }`}
                    >
                      {post.location}
                    </span>
                  </TableCell>

                 
                  <TableCell>
                    <span
                      className={`${post._count.votes > 1
                        ? "text-amber-600"
                        : "text-gray-600"
                        }`}
                    >
                      {post._count.votes}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span
                      className={`${post._count.comments > 1
                        ? "text-amber-600"
                        : "text-gray-600"
                        }`}
                    >
                      {post._count.comments}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span
                      className={`${post._count.postRatings > 1
                        ? "text-amber-600"
                        : "text-gray-600"
                        }`}
                    >
                      {post._count.postRatings}
                    </span>
                  </TableCell>

                  <TableCell className="flex justify-center items-center">
                    <Button
                      // onClick={() => handleDelete(post.pId)}
                      variant="outline"
                      size="sm"
                      className="cursor-pointer text-red-600 hover:text-green-800"
                    >
                      <Trash className="h-4 w-4"></Trash>
                    </Button>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
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
                <TableCell>{singleUser?.email}</TableCell>
                <TableCell>{singleUser?.userDetails.name}</TableCell>
                <TableCell>{singleUser?.status}</TableCell>
                <TableCell>
                  <span
                    className={`${singleUser?.role === UserRole.ADMIN ||
                      UserRole.PREMIUM_USER
                      ? "text-amber-600"
                      : "text-gray-600"
                      }`}
                  >
                    {singleUser?.role}
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
