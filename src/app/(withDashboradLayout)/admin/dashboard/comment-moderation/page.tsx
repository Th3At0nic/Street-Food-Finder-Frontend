/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { RxCross2 } from "react-icons/rx";
import { BsCheckAll } from "react-icons/bs";
import { TbEyeFilled } from "react-icons/tb";
import { toast } from "sonner";

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
import { NoDataFound } from "@/components/modules/common/NoDataFound";
import { formatDate } from "date-fns";
import { PaginationComponent } from "@/components/shared/PaginationComponent";
import Link from "next/link";
import { DeleteConfirmationModal } from "@/components/modules/deleteModal/deleteConfirmationModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateComment } from "@/app/actions/post-actions";
import { TableSkeleton } from "@/components/shared/TableSkeleton";

export default function CommentModerationPage() {
  const [comments, setComments] = useState<IComment[]>([]);
  const [page, setPage] = useState(1);
  const limit = 7;
  const [meta, setMeta] = useState<IMeta>({ page, limit, total: 0, totalPages: 1 });
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<CommentStatus | undefined>(CommentStatus.PENDING);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentComment, setCurrentComment] = useState<IComment | undefined>(undefined);


  const getAllComments = async () => {
    setIsTableLoading(true);
    try {
      const result = await fetchAllComments({ page, limit, status: filterStatus, searchTerm })
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
    getAllComments();
  }, [page, limit, filterStatus, searchTerm]);

  const handleUpdateCommentStatus = async (comment: IComment, status: CommentStatus) => {
    try {
      if (status === CommentStatus.REJECTED) {
        setIsDeleting(true);
      }

      const result = await updateComment({
        commentId: status === CommentStatus.REJECTED ? currentComment!.cId : comment.cId,
        status: status
      });

      if (result.success) {
        toast.success(`Comment ${status === CommentStatus.APPROVED ? 'approved' : 'rejected'} successfully`);
        getAllComments();
      } else {
        toast.error(`Failed to ${status === CommentStatus.APPROVED ? 'approve' : 'reject'} comment`);
      }

      if (status === CommentStatus.REJECTED) {
        setIsDeleteOpen(false);
      }
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : 'Something went wrong'}`);
    } finally {
      if (status === CommentStatus.REJECTED) {
        setIsDeleting(false);
      }
    }
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);

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
              <Input placeholder="Search comments..." className="pl-10"
                value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
              />
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
                  <TableSkeleton cols={6} />
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
                          {(comment.status === CommentStatus.REJECTED || comment.status === CommentStatus.PENDING) && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Button onClick={() => {
                                    handleUpdateCommentStatus(comment, CommentStatus.APPROVED);
                                  }} size="sm" variant="secondary">
                                    <BsCheckAll />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  Approve
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {(comment.status === CommentStatus.APPROVED || comment.status === CommentStatus.PENDING) && (
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
                          )}
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
        onConfirm={() => handleUpdateCommentStatus(currentComment!, CommentStatus.REJECTED)}
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