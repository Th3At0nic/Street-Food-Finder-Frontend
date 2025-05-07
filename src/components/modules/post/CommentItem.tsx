import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Comment } from '@/types';

interface CommentItemProps {
    comment: Comment;
}

export function CommentItem({ comment }: CommentItemProps) {
    return (
        <div className="flex space-x-2">
            <Avatar className="h-8 w-8">
                <AvatarImage
                    src={comment.commenter?.userDetails?.profilePhoto || '/api/placeholder/32/32'}
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
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                    <button className="hover:text-gray-700">Like</button>
                    <button className="hover:text-gray-700">Reply</button>
                </div>
            </div>
        </div>
    );
}