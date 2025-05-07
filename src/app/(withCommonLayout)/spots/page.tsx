// This is the main page component
'use client';

import { useInView } from 'react-intersection-observer';
import { usePostFeed } from "@/hooks/usePostFeed";
import { PostCardFeed } from '@/components/modules/post/PostCardFeed';
import { LoadingPosts } from '@/components/modules/post/LoadingPosts';
import { useEffect } from 'react';
import { CreatePostCard } from '@/components/modules/post/CreatePostCard';
import { FcEmptyTrash } from 'react-icons/fc';

export default function AllSpotsPage() {
    const { posts, loading, loadMorePosts } = usePostFeed();
   
    const { ref, inView } = useInView();

    // Load more when scrolled to the bottom
    useEffect(() => {
        if (inView && !loading) {
            loadMorePosts();
        }
    }, [inView, loading, loadMorePosts]);

    return (
        <div className="min-h-screen bg-gray-100">
            <main className="max-w-2xl mx-auto px-4 py-6">
                <CreatePostCard />

                <div className="space-y-4">

                    {posts.map(post => (
                        <PostCardFeed key={post.pId} post={post} />
                    ))}
                    {posts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-600">
                            <FcEmptyTrash className='h-32 w-32'/>
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h2>
                            <p className="text-sm text-gray-500 mb-4">When posts are created, they’ll show up here.</p>

                        </div>
                    )}

                </div>

                {/* Loading indicator and trigger for infinite scroll */}
                <div ref={ref} className="py-4 flex justify-center">
                    {loading && <LoadingPosts />}
                </div>
            </main>
        </div>
    );
}