
'use client';

import { RxCross2 } from "react-icons/rx";
import { BsCheckAll } from "react-icons/bs";
import { TbEyeFilled } from "react-icons/tb";

import { fetchAllComments } from "@/components/services/CommentServices";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IMeta } from "@/types";
import { CommentStatus, IComment } from "@/types/comments.types";
import { Search, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { NoDataFound } from "@/components/modules/common/NoDataFound";
import { formatDate } from "date-fns";
import { PaginationComponent } from "@/components/shared/PaginationComponent";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DeleteConfirmationModal } from "@/components/modules/deleteModal/deleteConfirmationModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CommentModerationPage() {
  const [comments, setComments] = useState<IComment[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(7);
  const [meta, setMeta] = useState<IMeta>({ page, limit, total: 0, totalPages: 1 });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<CommentStatus | undefined>(undefined);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentComment, setCurrentComment] = useState<IComment | undefined>(undefined);

  const getAllComment = async () => {
    try {
      const result = await fetchAllComments({})
      setComments(result.data.data);
      setMeta(result.data.meta);
      console.log({ result });
    } catch (err) {
      console.log(err);
    } finally {
      setIsTableLoading(false);
    }
  }

  useEffect(() => {
    getAllComment();
  }, [page, searchTerm]);

  const handleRejectComment = () => {
    setIsDeleting(true);
  }

  const handleCommentDelete = () => {
    setIsDeleting(true);
  }

  const TableSkeleton = () => {
    return Array.from({ length: limit }).map((_, index) => (
      <TableRow key={index}>
        <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-8 w-8 ml-auto" />
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              Pending Comment Approval
            </CardTitle>
            <div className="text-sm text-gray-500">
              Totals {meta.total} Comments
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 w-full sm:w-auto">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input placeholder="Search comments..." className="pl-10" />
            </div>
            {/* Filter Dropdown */}
            <Select value={filterStatus} onValueChange={(value) => {
              setFilterStatus(value === 'all' ? undefined : value as CommentStatus);
              setPage(1);
            }}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value={CommentStatus.PENDING}>{CommentStatus.PENDING}</SelectItem>
                <SelectItem value={CommentStatus.APPROVED}>{CommentStatus.APPROVED}</SelectItem>
                <SelectItem value={CommentStatus.REJECTED}>{CommentStatus.REJECTED}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-accent">
              <TableRow>
                <TableHead className=" rounded-l-lg">Comment</TableHead>
                <TableHead>Commenter</TableHead>
                <TableHead>Post Title</TableHead>
                <TableHead>Reports</TableHead>
                <TableHead>Commented At</TableHead>
                <TableHead className="text-right rounded-r-lg">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {
                isTableLoading ? (
                  <TableSkeleton />
                ) : comments.length ? (
                  comments.map((comment) => (
                    <TableRow key={comment.cId}>
                      <TableCell className="max-w-[300px] truncate">
                        {comment.comment}
                      </TableCell>
                      <TableCell>{comment.commenter.userDetails.name}</TableCell>
                      <TableCell>
                        <a href={`/spots/${comment.post.pId}`}>
                          {comment.post.title}
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">{comment.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{formatDate(comment.createdAt, "dd-MMM-yy hh:mm")}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Link href={`/posts/${comment.post.pId}`} target="_blank">
                                  <Button size="sm" variant="default">
                                    <TbEyeFilled />
                                  </Button>
                                </Link>

                              </TooltipTrigger>
                              <TooltipContent>
                                View Post
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Button size="sm" variant="secondary">
                                  <BsCheckAll />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                Approve
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Button size="sm" variant="destructive" onClick={() => {
                                  setCurrentComment(comment);
                                  setIsDeleteOpen(true);
                                }}>
                                  <RxCross2 />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                Reject
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <NoDataFound />
                    </TableCell>
                  </TableRow>
                )
              }
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <PaginationComponent
        isTableLoading={isTableLoading}
        meta={meta}
        setPage={setPage}
        page={page}
        tableContentName="comments"
      />
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleRejectComment}
        isLoading={isDeleting}
        title="Reject the comment?"
        confirmText="Reject"
        description={<>
          Are you sure you want to reject the comment <span className="font-bold">{currentComment?.comment}</span>?.
        </>}
      />
    </div>
  );
};

