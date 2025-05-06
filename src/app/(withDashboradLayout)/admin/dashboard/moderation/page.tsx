
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield, Check, X, Star, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

// Mock data - replace with API calls
const pendingPosts = [
  {
    id: 1,
    title: "Spicy Chicken Tacos",
    author: "user1@example.com",
    category: "Snacks",
    price: "$3-$8",
    type: "normal",
    status: "pending",
    reported: 2
  },
  {
    id: 2,
    title: "Secret BBQ Stall",
    author: "user2@example.com",
    category: "Meals",
    price: "$10-$15",
    type: "premium",
    status: "pending",
    reported: 5
  }
];

const reportedComments = [
  {
    id: 1,
    content: "Overrated, not worth the price!",
    author: "user3@example.com",
    post: "Spicy Chicken Tacos",
    reports: 3
  }
];

export default function ModerationPage() {
  const [filterType, setFilterType] = useState("all");

  const handleApprove = (postId: number) => {
    console.log("Approving post:", postId);
    // Add API call here
  };

  const handleReject = (postId: number) => {
    console.log("Rejecting post:", postId);
    // Add API call here
  };

  const handleMarkPremium = (postId: number) => {
    console.log("Marking premium:", postId);
    // Add API call here
  };

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
              {pendingPosts.length} posts awaiting moderation
            </div>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="normal">Normal Posts</SelectItem>
                <SelectItem value="premium">Premium Posts</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative w-full sm:w-[240px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search posts..."
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
              {pendingPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>{post.price}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={post.status === 'pending' ? 'destructive' : 'outline'}
                      className="capitalize"
                    >
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleApprove(post.id)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(post.id)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleMarkPremium(post.id)}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Premium
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
          Showing 1-{pendingPosts.length} of {pendingPosts.length} results
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