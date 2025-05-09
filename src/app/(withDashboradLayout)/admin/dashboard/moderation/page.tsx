"use client";
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
import { Badge } from "@/components/ui/badge";
import { Shield, Check, X, Star, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import {
  getAllPosts,
  updatePost,
} from "@/components/services/PostModerationByAdmin";
import { fetchPosts } from "@/app/actions/post-actions";
import { Post, PostStatus, TPost } from "@/types";
import { toast } from "sonner";
import NoPost from "@/components/shared/noPost";
import { LoadingPosts } from "@/components/modules/post/LoadingPosts";

// Mock data - replace with API calls
// const pendingPosts = [
//   {
//     id: 1,
//     title: "Spicy Chicken Tacos",
//     author: "user1@example.com",
//     category: "Snacks",
//     price: "$3-$8",
//     type: "normal",
//     status: "pending",
//     reported: 2
//   },
//   {
//     id: 2,
//     title: "Secret BBQ Stall",
//     author: "user2@example.com",
//     category: "Meals",
//     price: "$10-$15",
//     type: "premium",
//     status: "pending",
//     reported: 5
//   }
// ];

const reportedComments = [
  {
    id: 1,
    content: "Overrated, not worth the price!",
    author: "user3@example.com",
    post: "Spicy Chicken Tacos",
    reports: 3,
  },
];

export default function ModerationPage() {
  const [pending, setPending] = useState<TPost[]>([]);
  const [filterType, setFilterType] = useState("all");
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await fetchPosts(1, 5, PostStatus.PENDING);
        setPending(result.posts);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers(); // call the inner function
  }, []);
  console.log(pending);

  const handleApprove = async (
    postId: string,
    body: {
      status: PostStatus.APPROVED | PostStatus.PENDING | PostStatus.REJECTED;
    }
  ) => {
    // Add API call here
    const result = await updatePost(postId, body.status);
    console.log(result);
    if (typeof result !== "string" && result?.statusCode === 200) {
      toast.success("post Approve sucessfully");
    }
  };

  const handleReject = async (
    postId: string,
    body: {
      status: PostStatus.APPROVED | PostStatus.PENDING | PostStatus.REJECTED;
    }
  ) => {
    // Add API call here
    await updatePost(postId, body.status);
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <LoadingPosts></LoadingPosts>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      {/* Pending Posts Section */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              Pending Posts Approval
            </CardTitle>
            <div className="text-sm text-gray-500">
              {pending.length} posts awaiting moderation
            </div>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            {/* <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="normal">Normal Posts</SelectItem>
                <SelectItem value="premium">Premium Posts</SelectItem>
              </SelectContent>
            </Select> */}
            <div className="relative w-full sm:w-[240px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input placeholder="Search posts..." className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {pending.length === 0 ? (
            <div className="flex justify-center items-center py-10">
              <NoPost h="h-20" w="w-20" title="No Pending Post Yet" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Post Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pending.map((post) => (
                  <TableRow key={post.pId}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.author?.userDetails?.name}</TableCell>
                    <TableCell>{post.category?.name}</TableCell>
                    <TableCell>
                      {post.priceRangeStart}-{post.priceRangeEnd}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          post.status === PostStatus.PENDING
                            ? "destructive"
                            : "outline"
                        }
                        className="capitalize"
                      >
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() =>
                          handleApprove(post.pId, {
                            status: PostStatus.APPROVED,
                          })
                        }
                        className="cursor-pointer"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          handleReject(post.pId, {
                            status: PostStatus.REJECTED,
                          })
                        }
                        className="cursor-pointer"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Reported Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            Reported Comments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Comment</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Post</TableHead>
                <TableHead>Reports</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportedComments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell className="max-w-[300px] truncate">
                    {comment.content}
                  </TableCell>
                  <TableCell>{comment.author}</TableCell>
                  <TableCell>{comment.post}</TableCell>
                  <TableCell>
                    <Badge variant="destructive">{comment.reports}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="ghost">
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive">
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing 1-{pending.length} of {pending.length} results
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
