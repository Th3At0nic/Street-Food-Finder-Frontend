"use client";

import { useInView } from "react-intersection-observer";
import { usePostFeed } from "@/hooks/usePostFeed";
import { PostCardFeed } from "@/components/modules/post/PostCardFeed";
import { LoadingPosts } from "@/components/modules/post/LoadingPosts";
import { useEffect, useState } from "react";
import { CreatePostCard } from "@/components/modules/post/CreatePostCard";
import NoPost from "@/components/shared/noPost";
import { PostSearchBox } from "@/components/modules/post/PostSearchBox";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AllSpotsPage() {
  const { posts, loading, loadMorePosts } = usePostFeed();
  const { ref, inView } = useInView();

  // Search and price filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");

  // Load more posts on scroll
  useEffect(() => {
    if (inView && !loading) {
      loadMorePosts();
    }
  }, [inView, loading, loadMorePosts]);

  // Filter posts based on search and price
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesPrice =
      (!priceFrom || post.priceRangeStart >= Number(priceFrom)) &&
      (!priceTo || post.priceRangeEnd <= Number(priceTo));
    return matchesSearch && matchesPrice;
  });

  return (
    <div className=" flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full h-fit lg:w-70 bg-gray-50 border-2 rounded-lg m-6 p-6">
        <div className="space-y-8">
          <div className="">
            <h2 className="text-lg font-semibold mb-4">Search</h2>
            <div className="relative">
              <Input
                type="search"
                placeholder="Search street food spots..."
                className="w-full max-w-xs bg-gray-100 rounded-full pl-10 py-2"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          <div>
      
          </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Price Range</h2>
            <div className="flex gap-2">
              <input
                type="number"
                value={priceFrom}
                onChange={(e) => setPriceFrom(e.target.value)}
                placeholder="From"
                className="w-1/2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                value={priceTo}
                onChange={(e) => setPriceTo(e.target.value)}
                placeholder="To"
                className="w-1/2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>



         <div>
         <h2 className="text-lg font-semibold mb-4">Filter Categories</h2>
          <Select>
              <SelectTrigger className="w-[180px] border-0">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="snacks">Snacks</SelectItem>
                <SelectItem value="meals">Meals</SelectItem>
                <SelectItem value="sweets">Sweets</SelectItem>
              </SelectContent>
            </Select>
         </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:max-w-4xl  mx-auto p-6">
        <CreatePostCard />

        <div className="space-y-6 mt-6">
          {filteredPosts.map((post) => (
            <PostCardFeed key={post.pId} post={post} />
          ))}

          {filteredPosts.length === 0 && (
            <div className="flex justify-center items-center py-12">
              <NoPost h="h-32" w="w-32" title="No Post" />
            </div>
          )}
        </div>

        {/* Infinite scroll loader */}
        <div ref={ref} className="py-6 flex justify-center">
          {loading && <LoadingPosts />}
        </div>
      </main>
    </div>
  );
}
