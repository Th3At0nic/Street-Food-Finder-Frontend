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
import { Shield, Check, X, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useCallback } from "react";
import { updatePost } from "@/components/services/PostModerationByAdmin";
import { fetchPosts } from "@/app/actions/post-actions";
import { IMeta, PostStatus, TPost } from "@/types";
import { toast } from "sonner";
import NoPost from "@/components/shared/noPost";
import { PaginationComponent } from "@/components/shared/PaginationComponent";
import { PostRejectConfirmationModal } from "@/components/modules/deleteModal/postRejectConfirmationModal";
import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/shared/TableSkeleton";

const POSTS_PER_PAGE = 7;

export default function ModerationPage() {
  const [posts, setPosts] = useState<TPost[]>([]);
  const [currentPost, setCurrentPost] = useState<TPost | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<IMeta>({
    page,
    limit: POSTS_PER_PAGE,
    total: 0,
    totalPages: 1
  });
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<PostStatus | undefined>(undefined);
  const [rejectReason, setRejectReason] = useState<string | undefined>(undefined);

  // Memoized fetch function
  const getPosts = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchPosts({
        page,
        limit: POSTS_PER_PAGE,
        status: PostStatus.PENDING,
        searchTerm
      });
      setPosts(result.data.data);
      setMeta(result.data.meta);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error("Failed to fetch posts");
    }
  }, [page, searchTerm]);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== searchTerm) {
        setSearchTerm(searchInput);
        setPage(1);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput, searchTerm]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const handleStatusUpdate = useCallback(async (
    postId: string,
    status: PostStatus.REJECTED | PostStatus.APPROVED,
    rejectReason?: string
  ) => {
    if (status === PostStatus.REJECTED && !rejectReason) {
      toast.warning("Please enter a reject reason!");
      return;
    }

    setActionLoadingId(postId);
    const toastId = toast.loading('Updating post status...');

    try {
      const result = await updatePost({ postId, status, rejectReason });
      if (result?.success) {
        toast.success(`Post ${status === PostStatus.APPROVED ? "approved" : "rejected"} successfully`, { id: toastId });
        await getPosts();
        setIsRejectModalOpen(false);
        setRejectReason(undefined);
      } else {
        toast.error(`Failed to ${status === PostStatus.APPROVED ? "approve" : "reject"} post`, { id: toastId });
      }
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : "Something went wrong"}`, { id: toastId });
    } finally {
      setActionLoadingId(null);
      setNewStatus(undefined);
    }
  }, [getPosts]);

  const handleApprove = useCallback((post: TPost) => {
    setCurrentPost(post);
    handleStatusUpdate(post.pId, PostStatus.APPROVED);
  }, [handleStatusUpdate]);

  const handleRejectClick = useCallback((post: TPost) => {
    setCurrentPost(post);
    setIsRejectModalOpen(true);
  }, []);

  // Handle status change when newStatus and rejectReason are set
  useEffect(() => {
    if (!newStatus ||
      newStatus === PostStatus.PENDING ||
      !currentPost ||
      (newStatus === PostStatus.REJECTED && !rejectReason)) {
      return;
    }

    handleStatusUpdate(
      currentPost.pId,
      newStatus,
      rejectReason
    );
  }, [currentPost, rejectReason, newStatus, handleStatusUpdate]);

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
              {loading ? <Skeleton className="h-4 w-[120px]" /> : `${posts.length} posts awaiting moderation`}
            </div>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-[240px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search posts..."
                className="pl-10"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
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
                <TableSkeleton cols={6} />
              </TableBody>
            </Table>
          ) : posts.length === 0 ? (
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
                {posts.map((post) => (
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
                        onClick={() => handleApprove(post)}
                        disabled={actionLoadingId === post.pId}
                        className="cursor-pointer"
                      >
                        {actionLoadingId === post.pId && currentPost?.pId === post.pId && newStatus === PostStatus.APPROVED ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4 mr-2" />
                        )}
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRejectClick(post)}
                        disabled={actionLoadingId === post.pId}
                        className="cursor-pointer"
                      >
                        {actionLoadingId === post.pId && currentPost?.pId === post.pId && newStatus === PostStatus.REJECTED ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <X className="h-4 w-4 mr-2" />
                        )}
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

      {/* Pagination Controls */}
      <PaginationComponent
        meta={meta}
        setPage={setPage}
        page={page}
        isTableLoading={loading}
        tableContentName="posts"
      />

      <PostRejectConfirmationModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={(reason) => {
          setRejectReason(reason);
          setNewStatus(PostStatus.REJECTED);
        }}
        title="Reject Post"
        description="Please provide a reason for rejecting this post."
        confirmText="Submit Rejection"
        cancelText="Cancel"
        isLoading={actionLoadingId === currentPost?.pId}
      />
    </div>
  );
}