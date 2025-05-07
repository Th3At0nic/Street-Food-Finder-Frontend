// components/feed/PostCard.tsx
'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, Share2, Send, MapPin, DollarSign, Star, ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { Post, VoteType } from '@/types';
import { Badge } from '@/components/ui/badge';
import { useSession } from 'next-auth/react';
import { CommentItem } from './CommentItem';
import { ImageGallery } from './ImageGallery';
import { useVote } from '@/hooks/useVote';

interface PostCardFeedProps {
    post: Post;
}

export function PostCardFeed({ post }: PostCardFeedProps) {
    console.log({post});
    const [isCommenting, setIsCommenting] = useState(false);
    const [commentText, setCommentText] = useState('');
    const { data: session } = useSession();
    const { toggleVote, isVoted, upVoteCount, downVoteCount } = useVote(post);

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
        if (!commentText.trim()) return;

        try {
            // In a real implementation, this would call your API
            console.log('Adding comment:', commentText);
            // You would update the comments list after API call
            setCommentText('');
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    const averageRating = post.postRatings && post.postRatings.length > 0
        ? post.postRatings.reduce((sum, rating) => sum + rating.rating, 0) / post.postRatings.length
        : 0;

    return (
        <Card className="mb-4 shadow-sm">
            <CardHeader className="pb-2">
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

            <CardContent className="pt-2">
                <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
                <p className="mb-3">{post.description}</p>

                <div className="flex items-center mb-3 space-x-4">
                    <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-sm">
                            {formatPrice(post.priceRangeStart)} - {formatPrice(post.priceRangeEnd)}
                        </span>
                    </div>

                    {averageRating > 0 && (
                        <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm">{averageRating.toFixed(1)}</span>
                        </div>
                    )}
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
                    <div>
                        <span className="mr-2">{post.comments?.length || 0} comments</span>
                    </div>
                </div>

                <Separator className="mb-2" />

                <div className="flex justify-between w-full">
                    <div className="flex items-center space-x-4 text-sm">
                        <Button
                            variant={isVoted ? "default" : "ghost"}
                            size="sm"
                            className="flex-1"
                            onClick={() => toggleVote(VoteType.UPVOTE)}
                        >
                            <ArrowBigUp className={`h-4 w-4 ${isVoted ? "text-white" : ""}`} />
                            Upvote
                        </Button>
                        <Separator orientation="vertical" />
                        <Button
                            variant={isVoted ? "default" : "ghost"}
                            size="sm"
                            className="flex-1"
                            onClick={() => toggleVote(VoteType.UPVOTE)}
                        >
                            <ArrowBigDown className={`h-4 w-4 ${isVoted ? "text-white" : ""}`} />
                            Downvote
                        </Button>
                    </div>
                    <Button
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
                                    />
                                    <Button
                                        type="submit"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-1 top-1/2 transform -translate-y-1/2"
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </>
                )}

                {post.comments && post.comments.length > 0 && (
                    <div className="mt-4 space-y-3 w-full">
                        <Separator />
                        {post.comments.slice(0, 3).map((comment) => (
                            <CommentItem key={comment.cId} comment={comment} />
                        ))}
                        {post.comments.length > 3 && (
                            <Button variant="link" size="sm" className="text-sm text-gray-500">
                                View all {post.comments.length} comments
                            </Button>
                        )}
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}