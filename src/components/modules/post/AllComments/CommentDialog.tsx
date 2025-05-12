/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Comment } from '@/types';
import { Loader2 } from 'lucide-react';
import { fetchPostComments } from '@/app/actions/post-actions';
import { CommentItem } from '../CommentItem';
import { LoadingPosts } from '../LoadingPosts';

interface CommentDialogProps {
    postId: string;
    initialComments: Comment[];
    totalComments: number;
    children: React.ReactNode;
    onEdit: (cId: string, comment: string) => Promise<void>;
    onDelete: (cId: string) => Promise<void>;
}

export function CommentDialog({
    postId,
    initialComments,
    totalComments,
    children,
    onEdit,
    onDelete
}: CommentDialogProps) {
    const [open, setOpen] = useState(false);
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(totalComments > initialComments.length);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open) {
            fetchComments(1);
        }
    }, [open]);

    useEffect(() => {
        if (!open) return;

        const options = {
            root: scrollContainerRef.current,
            rootMargin: '0px 0px 200px 0px',
            threshold: 0.1
        };

        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver((entries) => {
            const [entry] = entries;
            if (entry.isIntersecting && hasMore && !isLoading) {
                fetchComments(page + 1);
            }
        }, options);

        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [open, hasMore, isLoading, page]);

    const fetchComments = async (pageNum: number) => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            const result = await fetchPostComments({
                postId,
                page: pageNum,
                limit: 10
            });

            if (result.success) {
                if (pageNum === 1) {
                    setComments(result.data.data);
                } else {
                    setComments(prev => [...prev, ...result.data.data]);
                }

                setHasMore(result.data.meta.page < result.data.meta.totalPages);
                setPage(pageNum);
            }
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = async (cId: string, comment: string) => {
        await onEdit(cId, comment);
        // Update comment in our local state
        setComments(prev =>
            prev.map(c => c.cId === cId ? { ...c, comment } : c)
        );
    };

    const handleDelete = async (cId: string) => {
        await onDelete(cId);
        // Remove comment from our local state
        setComments(prev => prev.filter(c => c.cId !== cId));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md md:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Comments ({totalComments})</DialogTitle>
                </DialogHeader>
                <div
                    ref={scrollContainerRef}
                    className="max-h-[60vh] overflow-y-auto"
                >
                    <div className="space-y-4 p-1">
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <div key={comment.cId}>
                                    <CommentItem
                                        comment={comment}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                    <Separator className="my-3" />
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-4">No comments yet</p>
                        )}

                        {hasMore && (
                            <div
                                ref={loadMoreRef}
                                className="flex justify-center py-4"
                            >
                                {isLoading && (
                                    <div className="flex items-center">
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        <LoadingPosts/>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}