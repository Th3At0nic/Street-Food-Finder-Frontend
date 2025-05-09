// This is the main page component
'use client';

import { useInView } from 'react-intersection-observer';
import { usePostFeed } from "@/hooks/usePostFeed";
import { PostCardFeed } from '@/components/modules/post/PostCardFeed';
import { LoadingPosts } from '@/components/modules/post/LoadingPosts';
import { useEffect } from 'react';
import { CreatePostCard } from '@/components/modules/post/CreatePostCard';
import NoPost from '@/components/shared/noPost';

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
        <div className="min-h-screen">
            <main className="max-w-2xl mx-auto px-4 py-6">
                <CreatePostCard />

                <div className="space-y-4">

                    {posts.map(post => (
                        <PostCardFeed key={post.pId} post={post} />
                    ))}
                    {posts.length === 0 && (
                     <NoPost h="h-32" w="w-32" title='No Post ' />
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