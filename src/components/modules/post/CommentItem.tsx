'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Comment } from '@/types';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';

interface CommentItemProps {
    comment: Comment;
    onDelete: (cId: string) => void;
    onEdit: (cId: string, comment: string) => void;
}

export function CommentItem({ comment, onDelete, onEdit }: CommentItemProps) {
    const { data: userSession } = useSession();
    const [openDelete, setOpenDelete] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [editedComment, setEditedComment] = useState(comment.comment);

    const canModifyComment = userSession?.user?.id && userSession?.user?.id === comment.commenterId;

    const handleDelete = () => {
        onDelete(comment.cId);
        setOpenDelete(false);
    };

    const handleEdit = () => {
        onEdit(comment.cId, editedComment);
        setOpenEdit(false);
    };

    return (
        <div className="flex space-x-2 group relative">
            <Avatar className="h-8 w-8">
                <AvatarImage
                    src={
                        comment.commenter?.userDetails?.profilePhoto ||
                        '/api/placeholder/32/32'
                    }
                    alt={comment.commenter?.userDetails?.name || 'User'}
                />
                <AvatarFallback>
                    {comment.commenter?.userDetails?.name?.[0] || 'U'}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1">
                <div className="bg-gray-100 rounded-xl p-2 px-3">
                    <p className="font-semibold text-sm">
                        {comment.commenter?.userDetails?.name || 'Anonymous'}
                    </p>
                    <p className="text-sm">{comment.comment}</p>
                </div>
                <div className="flex space-x-3 mt-1 text-xs text-gray-500">
                    <span>
                        {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                        })}
                    </span>

                    {canModifyComment && (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 px-2 text-xs"
                                onClick={() => setOpenEdit(true)}
                            >
                                Edit
                            </Button>

                            {/* Edit Dialog */}
                            <AlertDialog open={openEdit} onOpenChange={setOpenEdit}>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Edit your comment</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Modify and save your updated comment below.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <div className="my-2">
                                        <Input
                                            value={editedComment}
                                            onChange={(e) => setEditedComment(e.target.value)}
                                        />
                                    </div>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleEdit}>
                                            Save
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            {/* Delete Dialog */}
                            <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-5 px-2 text-xs text-red-500 hover:text-red-600"
                                    >
                                        Delete
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Are you sure you want to delete this comment?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete}>
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
