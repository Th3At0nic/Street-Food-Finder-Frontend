import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { postId: string }}): Promise<Metadata> {
  // Fetch post data
  const res = await fetch(
    `https://street-food-finder-backend.vercel.app/api/posts/${params.postId}`
  );
  const post = await res.json();

  return {
    title: `StreetBite | ${post?.data?.title || 'Food Location'}`,
    description: post?.description || "Explore this delicious street food location, see photos, reviews and more",
    keywords: `street food, ${post?.data?.category?.name || 'food'}, ${post?.data?.location || 'local cuisine'}`,
  };
}