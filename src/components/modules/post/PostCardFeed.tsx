'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, Share2, Send, MapPin, DollarSign, Star, ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { Post, VoteType, Comment } from '@/types';
import { Badge } from '@/components/ui/badge';
import { useSession } from 'next-auth/react';
import { CommentItem } from './CommentItem';
import { ImageGallery } from './ImageGallery';
import { useVote } from '@/hooks/useVote';
import { commentOnPost, updateComment, deleteComment } from '@/app/actions/post-actions';
import { toast } from 'sonner';
import { CommentDialog } from './AllComments/CommentDialog';

interface PostCardFeedProps {
    post: Post;
}

export function PostCardFeed({ post: initialPost }: PostCardFeedProps) {
    // Use state to manage post data so we can update it after commenting
    const [post, setPost] = useState<Post>(initialPost);
    const [isCommenting, setIsCommenting] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: session } = useSession();
    const { toggleVote, isUpVoted, isDownVoted, upVoteCount, downVoteCount } = useVote(post);

    // Update post state when initialPost changes
    useEffect(() => {
        setPost(initialPost);
    }, [initialPost]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    const formatTime = (date: Date) => {
        try {
            return formatDistanceToNow(new Date(date), { addSuffix: true });
        } catch (error: unknown) {
            console.log(error);
            return 'recently';
        }
    };

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const result = await commentOnPost({ postId: post.pId, comment: commentText });
            console.log({ result });

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            // Add the new comment to local state
            if (result.data) {
                const newComment: Comment = result.data;

                // Update post state with the new comment
                setPost(prevPost => ({
                    ...prevPost,
                    comments: [...(prevPost.comments || []), newComment],
                    _count: {
                        ...prevPost._count,
                        comments: (prevPost._count.comments || 0) + 1
                    }
                }));

                toast.success("Comment added successfully");
            }

            setCommentText('');
        } catch (error) {
            console.error('Failed to add comment:', error);
            toast.error("Failed to add comment");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCommentEdit = async (cId: string, comment: string) => {
        const toastId = toast.loading('Updating comment...');
        try {
            const result = await updateComment({ commentId: cId, comment });

            if (result.success) {
                // Update the comment in local state
                if (result.data) {
                    const updatedComment: Comment = result.data;

                    // Update post state with the edited comment
                    setPost(prevPost => ({
                        ...prevPost,
                        comments: prevPost.comments?.map(c =>
                            c.cId === cId ? updatedComment : c
                        ) || []
                    }));

                    toast.success(result.message || "Comment updated", { id: toastId });
                } else {
                    // If no data returned but operation successful, update locally
                    setPost(prevPost => ({
                        ...prevPost,
                        comments: prevPost.comments?.map(c =>
                            c.cId === cId ? { ...c, comment } : c
                        ) || []
                    }));

                    toast.success(result.message || "Comment updated", { id: toastId });
                }
            } else {
                toast.error(result.message || "Some error occurred while updating", { id: toastId });
            }
        } catch (error: unknown) {
            console.error(error);
            toast.error("Failed to update comment", { id: toastId });
        }
    };

    const handleCommentDelete = async (cId: string) => {
        const toastId = toast.loading('Deleting comment...');
        try {
            const result = await deleteComment({ commentId: cId });

            if (result.success) {
                // Remove the comment from local state
                setPost(prevPost => ({
                    ...prevPost,
                    comments: prevPost.comments?.filter(c => c.cId !== cId) || [],
                    _count: {
                        ...prevPost._count,
                        comments: Math.max(0, (prevPost._count.comments || 0) - 1)
                    }
                }));

                toast.success(result.message || "Comment deleted", { id: toastId });
            } else {
                toast.error(result.message || "Some error occurred while deleting", { id: toastId });
            }
        } catch (error: unknown) {
            console.error(error);
            toast.error("Failed to delete comment", { id: toastId });
        }
    };

    const averageRating = post.averageRating ?? 0;

    // Determine how many comments to show in the card
    // Usually we'd show the initial 3 comments
    const displayedComments = post.comments?.slice(0, 3) || [];
    const totalComments = post._count.comments || 0;
    const hasMoreComments = totalComments > displayedComments.length;

    return (
        <Card className="mb-4 shadow-sm">
            <CardHeader className="">
                <div className="flex items-center space-x-3">
                    <Avatar>
                        <AvatarImage
                            src={post.author?.userDetails?.profilePhoto || '/api/placeholder/32/32'}
                            alt={post.author?.userDetails?.name || 'User'}
                        />
                        <AvatarFallback>
                            {post.author?.userDetails?.name?.[0] || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">
                                {post.author?.userDetails?.name || 'Anonymous'}
                            </h3>
                            <span className="text-xs text-gray-500">
                                {formatTime(post.createdAt)}
                            </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{post.location}</span>
                            {post.pType === 'PREMIUM' && (
                                <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-200">
                                    Premium
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
                <p className="mb-3">{post.description}</p>

                <div className="flex items-center mb-3 space-x-4">
                    <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-sm">
                            {formatPrice(post.priceRangeStart)} - {formatPrice(post.priceRangeEnd)}
                        </span>
                    </div>
                </div>

                {post.postImages && post.postImages.length > 0 && (
                    <ImageGallery images={post.postImages} />
                )}
            </CardContent>

            <CardFooter className="flex flex-col">
                <div className="flex justify-between w-full text-sm text-gray-500 mb-2">
                    <div className="flex h-5 items-center space-x-4 text-sm">
                        <div className='flex justify-center items-center'> <ArrowBigUp className="h-4 w-4" /> {upVoteCount}</div>
                        <Separator orientation="vertical" />
                        <div className='flex justify-center items-center'><ArrowBigDown className="h-4 w-4" />{downVoteCount} </div>
                    </div>


                    {averageRating > -1 && (
                        <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm">{averageRating.toFixed(1)}</span>
                        </div>
                    )}

                    <div>
                        {hasMoreComments && (
                            <CommentDialog
                                postId={post.pId}
                                initialComments={displayedComments}
                                totalComments={totalComments}
                                onEdit={handleCommentEdit}
                                onDelete={handleCommentDelete}
                            >
                                <span className="mr-2 cursor-pointer">{post._count.comments || 0} comments</span>
                            </CommentDialog>
                        )}

                    </div>

                </div>

                <Separator className="mb-2" />

                <div className="flex justify-between w-full">
                    <div className="flex items-center space-x-4 text-sm">
                        <Button
                            disabled={!session?.user || session?.user.role === 'ADMIN'}
                            variant={isUpVoted ? "default" : "ghost"}
                            size="sm"
                            className="flex-1"
                            onClick={() => toggleVote(VoteType.UPVOTE)}
                        >
                            <ArrowBigUp className={`h-4 w-4 ${isUpVoted ? "text-white" : ""}`} />
                            {isUpVoted ? 'Upvoted' : 'Upvote'}
                        </Button>
                        <Separator orientation="vertical" />
                        <Button
                            disabled={!session?.user || session?.user.role === 'ADMIN'}
                            variant={isDownVoted ? "default" : "ghost"}
                            size="sm"
                            className="flex-1"
                            onClick={() => toggleVote(VoteType.DOWNVOTE)}
                        >
                            <ArrowBigDown className={`h-4 w-4 ${isDownVoted ? "text-white" : ""}`} />
                            {isDownVoted ? 'Downvoted' : 'Downvote'}
                        </Button>
                    </div>
                    <Button
                        disabled={!session?.user || session?.user.role === 'ADMIN'}
                        variant="ghost"
                        size="sm"
                        className="flex-1"
                        onClick={() => setIsCommenting(!isCommenting)}
                    >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Comment
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                    </Button>
                </div>

                {isCommenting && (
                    <>
                        <Separator className="my-2" />
                        <form onSubmit={handleComment} className="w-full">
                            <div className="flex items-center w-full">
                                <Avatar className="h-8 w-8 mr-2">
                                    <AvatarImage
                                        src={session?.user?.image || '/api/placeholder/32/32'}
                                        alt="Your avatar"
                                    />
                                    <AvatarFallback>YA</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 relative">
                                    <Input
                                        placeholder="Write a comment..."
                                        className="pr-10 rounded-full bg-gray-100"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                    <Button
                                        type="submit"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-1 top-1/2 transform -translate-y-1/2"
                                        disabled={isSubmitting}
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </>
                )}

                {displayedComments.length > 0 && (
                    <div className="mt-4 space-y-3 w-full">
                        <Separator />
                        {displayedComments.map((comment) => (
                            <CommentItem
                                key={comment.cId}
                                comment={comment}
                                onEdit={handleCommentEdit}
                                onDelete={handleCommentDelete}
                            />
                        ))}

                        {hasMoreComments && (
                            <CommentDialog
                                postId={post.pId}
                                initialComments={displayedComments}
                                totalComments={totalComments}
                                onEdit={handleCommentEdit}
                                onDelete={handleCommentDelete}
                            >
                                <Button variant="link" size="sm" className="text-sm text-gray-500">
                                    View all {totalComments} comments
                                </Button>
                            </CommentDialog>
                        )}
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}