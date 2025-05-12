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
import { Shield, Check, Search, Edit, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { updatePost, updatePostType } from "@/components/services/PostModerationByAdmin";
import { fetchPosts } from "@/app/actions/post-actions";
import { IMeta, PostStatus, PostType, TPost } from "@/types";
import { toast } from "sonner";
import NoPost from "@/components/shared/noPost";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { PaginationComponent } from "@/components/shared/PaginationComponent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import PostCategorySelect from "@/components/modules/post/PostCategorySelect";

const POSTS_PER_PAGE = 7;
export default function PostModerationPage() {
  const [posts, setPosts] = useState<TPost[]>([]);
  const [filterType, setFilterType] = useState<PostType | undefined>(PostType.NORMAL);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<IMeta>({
    page,
    limit: POSTS_PER_PAGE,
    total: 0,
    totalPages: 1
  });
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingPostId, setLoadingPostId] = useState<string | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState<string>("");

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

  const getApprovedPosts = async () => {
    setIsLoading(true);
    try {
      const result = await fetchPosts({
        page,
        limit: POSTS_PER_PAGE,
        status: PostStatus.APPROVED,
        postType: filterType,
        searchTerm
      });
      setPosts(result.data.data);
      setMeta(result.data.meta);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getApprovedPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, searchTerm, page]);

  const handlePremium = async (
    postId: string,
    body: {
      pType: PostType.PREMIUM;
    }
  ) => {
    setLoadingPostId(postId);
    try {
      const result = await updatePostType(postId, body.pType);
      console.log(result);
      if (typeof result !== "string" && result.statusCode === 200) {
        toast.success("Post has been made premium successfully!");
        await getApprovedPosts();
      }
    } catch (error) {
      console.log({postUpdateError: error});
      toast.error("Failed to update post type");
    } finally {
      setLoadingPostId(null);
    }
  };

  const handleNormal = async (
    postId: string,
    body: {
      pType: PostType.NORMAL;
    }
  ) => {
    setLoadingPostId(postId);
    try {
      const result = await updatePostType(postId, body.pType);
      if (typeof result !== "string" && result.statusCode === 200) {
        toast.success("Post type changed to normal successfully");
        await getApprovedPosts();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update post type");
    } finally {
      setLoadingPostId(null);
    }
  };

  const openCategoryModal = (postId: string) => {
    setSelectedPostId(postId);
    setCategoryModalOpen(true);
  };

  const handleCategoryChange = async () => {
    try {
      await updatePost({
        postId: selectedPostId!,
        categoryId: newCategory
      })
      toast.success("Post category updated successfully");
      setCategoryModalOpen(false);
      await getApprovedPosts();
    } catch (error) {
      console.log({ catUpdateError: error });
      toast.error("Failed to update category");
    }
  };

  return (
    <div className="space-y-8">
      {/* Pending Posts Section */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              Manage Premium and Normal Posts
            </CardTitle>
            <div className="text-sm text-gray-500">
              Total {meta.total} approved posts found!
            </div>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <Select value={filterType} onValueChange={(val) => {
              setFilterType(val === 'all' ? undefined : val as PostType);
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ALL</SelectItem>
                <SelectItem value={PostType.NORMAL}>{PostType.NORMAL}</SelectItem>
                <SelectItem value={PostType.PREMIUM}>{PostType.PREMIUM}</SelectItem>
              </SelectContent>
            </Select>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Post Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price Range</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Post Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? <TableSkeleton cols={7} /> : posts?.length === 0 ? (
                <div className="flex justify-center items-center py-10">
                  <NoPost h="h-20" w="w-20" title="No Approved Post Yet" />
                </div>
              ) : posts?.map((post) => (
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
                  <TableCell>
                    <Badge
                      variant={
                        post.pType === PostType.NORMAL
                          ? "destructive"
                          : "outline"
                      }
                      className="capitalize"
                    >
                      {post.pType}
                    </Badge>
                  </TableCell>

                  <TableCell className="flex flex-wrap justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openCategoryModal(post.pId)}
                      className="cursor-pointer"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Category
                    </Button>

                    {post.pType === PostType.NORMAL ? (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() =>
                          handlePremium(post.pId, {
                            pType: PostType.PREMIUM,
                          })
                        }
                        disabled={loadingPostId === post.pId}
                        className="cursor-pointer"
                      >
                        {loadingPostId === post.pId ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4 mr-2" />
                        )}
                        Make Premium
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          handleNormal(post.pId, {
                            pType: PostType.NORMAL,
                          })
                        }
                        disabled={loadingPostId === post.pId}
                        className="cursor-pointer"
                      >
                        {loadingPostId === post.pId ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4 mr-2" />
                        )}
                        Make Normal
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Category Edit Modal */}
      <Dialog open={categoryModalOpen} onOpenChange={setCategoryModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Post Category</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <PostCategorySelect
              handleCategoryChange={setNewCategory}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCategoryChange}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pagination Controls */}
      <PaginationComponent
        meta={meta}
        setPage={setPage}
        page={page}
        isTableLoading={isLoading}
        tableContentName="posts"
      />
    </div>
  );
}