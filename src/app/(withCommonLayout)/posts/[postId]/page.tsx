/* eslint-disable @typescript-eslint/no-explicit-any */
// app/spots/[id]/page.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Star,
  Utensils,
  Wallet,
  Shield,

} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
// import { useState } from "react";

export default async function FoodSpotPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const res = await fetch(
    `https://street-food-finder-backend.vercel.app/api/posts/${postId}`
  );
  const post = await res.json();
  const isPremiumPost = true; // Replace with post data
  // const [comment, setComment] = useState("");

  // Temporary data - replace with API calls

  return (
    <div className="min-h-screen bg-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <nav>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/"
              className="text-orange-600 hover:text-orange-700 flex items-center"
            >
              ← Back to all posts
            </Link>
          </div>
        </nav>
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold  mb-2">
              {post?.data?.title}
              {isPremiumPost && (
                <Badge className="ml-2">
                  <Shield className="h-4 w-4 mr-1" />
                  {post?.data?.pType}
                </Badge>
              )}
            </h1>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1.5 text-orange-600" />
              {post?.data?.location}
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            <span className="font-medium">{post?.data?.rating}</span>
            <span className="text-gray-500">({post?.data?.status} Status)</span>
            <span className="text-gray-500">
              ({post?.data?.category?.name} Category)
            </span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {post?.data?.postImages.map((image: any, index: number) => (
            <div
              key={index}
              className="h-64 bg-gray-200 rounded-lg relative overflow-hidden "
            >
              {/* Image itself */}
              <Image
                src={image.file_path}
                alt={`Post image ${index + 1}`}
                fill
                className="object-cover object-center "
                sizes="(max-width: 768px) 100vw, 33vw" // responsive sizing
                priority={index === 0} // optionally prioritize first image 
              />

              {/* Black overlay */}
              <div className="absolute inset-0 bg-black/30 rounded-lg"></div>
            </div>
          ))}
        </div>

        {/* Details Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            {/* Description */}
            <section className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">About this post</h2>
              <p className="text-gray-600">{post.description}</p>
            </section>

            {/* Reviews & Comments */}
            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">
                Reviews ({post.reviews})
              </h2>

              {/* Comment Form */}
              <div className="mb-6">
                {/* <Input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  className="mb-2"
                /> */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <Star
                        key={num}
                        className="h-5 w-5 text-amber-500 cursor-pointer"
                      />
                    ))}
                  </div>
                  <Button>Post Review</Button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {post?.data?.comments.map((comment:any) => (
                  <div key={comment.cId} className="border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">User </span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        4.5
                      </div>
                    </div>
                    <p className="text-gray-600">
                    {comment.comment}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Utensils className="h-4 w-4 mr-2 text-orange-600" />
                  Category: {post?.data.category.name}
                </div>
                <div className="flex items-center text-gray-600">
                  <Wallet className="h-4 w-4 mr-2 text-orange-600" />
                  Price: {post?.data?.priceRangeStart} - {post?.data?.priceRangeEnd}
                </div>
              </div>
            </div>

            {/* Voting */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-4">Helpful?</h3>
              <div className="flex items-center gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  Votes {post?.data?._count?.votes}
                </Button>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
