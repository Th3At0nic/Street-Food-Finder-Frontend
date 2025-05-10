/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useInView } from "react-intersection-observer";
import { usePostFeed } from "@/hooks/usePostFeed";
import { PostCardFeed } from "@/components/modules/post/PostCardFeed";
import { LoadingPosts } from "@/components/modules/post/LoadingPosts";
import { useEffect, useState } from "react";
import { CreatePostCard } from "@/components/modules/post/CreatePostCard";
import NoPost from "@/components/shared/noPost";
import { Input } from "@/components/ui/input";
import { Search, Filter, X } from "lucide-react";
import PostCategorySelect from "@/components/modules/post/PostCategorySelect";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const PRICE_RANGE_LOW = 0;
const PRICE_RANGE_HIGH = 100000;

export default function AllSpotsPage() {
  const { posts, loading, loadMorePosts } = usePostFeed();
  const { ref, inView } = useInView();

  // Search and price filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([PRICE_RANGE_LOW, PRICE_RANGE_HIGH]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeFilters, setActiveFilters] = useState(0);

  // Load more posts on scroll
  useEffect(() => {
    if (inView && !loading) {
      loadMorePosts();
    }
  }, [inView, loading, loadMorePosts]);

  // Filter posts based on search, price and category
  const filteredPosts = posts?.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesPrice =
      post.priceRangeEnd >= priceRange[0] && post.priceRangeStart <= priceRange[1];
    const matchesCategory =
      !selectedCategory || post.categoryId === selectedCategory;
    return matchesSearch && matchesPrice && matchesCategory;
  });

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (searchQuery) count++;
    if (priceRange[0] > PRICE_RANGE_LOW || priceRange[1] < PRICE_RANGE_HIGH) count++;
    if (selectedCategory) count++;
    setActiveFilters(count);
  }, [searchQuery, priceRange, selectedCategory]);

  const resetFilters = () => {
    setSearchQuery("");
    setPriceRange([PRICE_RANGE_LOW, PRICE_RANGE_HIGH]);
    setSelectedCategory("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Mobile filter sheet */}
      <div className="lg:hidden mb-4 flex items-center justify-between">
        <div className="relative w-full mr-2">
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search street food spots..."
            className="w-full bg-gray-50 rounded-full pl-10 py-2 border-gray-200"
          />

          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Filter className="h-4 w-4" />
              {activeFilters > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">{activeFilters}</Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Filter street food spots by price and category
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-6 mt-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Price Range</h3>
                <div className="px-2">
                  <Slider
                    defaultValue={priceRange}
                    max={PRICE_RANGE_HIGH}
                    step={1}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="my-6"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Category</h3>
                <PostCategorySelect handleCategoryChange={setSelectedCategory} />
              </div>

              {activeFilters > 0 && (
                <Button variant="outline" onClick={resetFilters} className="w-full mt-4">
                  Clear All Filters
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-20 self-start">
          <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
            <div className="relative mb-6">
              <Input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search street food spots..."
                className="w-full bg-gray-50 rounded-full pl-10 py-2 border-gray-200"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>

            <Accordion type="single" collapsible className="w-full" defaultValue="price">
              <AccordionItem value="price" className="border-b border-gray-200">
                <AccordionTrigger className="text-sm font-medium py-3">Price Range</AccordionTrigger>
                <AccordionContent>
                  <div className="px-2">
                    <Slider
                      defaultValue={priceRange}
                      max={PRICE_RANGE_HIGH}
                      step={1}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="my-4"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="category" className="border-b border-gray-200">
                <AccordionTrigger className="text-sm font-medium py-3">Category</AccordionTrigger>
                <AccordionContent>
                  <PostCategorySelect handleCategoryChange={setSelectedCategory} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {activeFilters > 0 && (
              <Button variant="outline" onClick={resetFilters} className="w-full mt-6 text-sm">
                Clear All Filters
              </Button>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100 mb-6  max-w-[800px]">
            <CreatePostCard />
          </div>

          {/* Active filters */}
          {activeFilters > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
                  Search: {searchQuery}
                  <button onClick={() => setSearchQuery("")}>
                    <X className="h-3 w-3 ml-1" />
                  </button>
                </Badge>
              )}

              {(priceRange[0] > 0 || priceRange[1] < 100) && (
                <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
                  Price: ${priceRange[0]} - ${priceRange[1]}
                  <button onClick={() => setPriceRange([0, 100])}>
                    <X className="h-3 w-3 ml-1" />
                  </button>
                </Badge>
              )}

              {selectedCategory && (
                <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
                  Category Selected
                  <button onClick={() => setSelectedCategory("")}>
                    <X className="h-3 w-3 ml-1" />
                  </button>
                </Badge>
              )}
            </div>
          )}
          

          <div className="space-y-6  max-w-[800px]">
            {filteredPosts?.length === 0 ? (
              <div className="bg-white shadow-sm rounded-xl p-12 border border-gray-100 flex flex-col items-center justify-center">
                <NoPost h="h-32" w="w-32" title="No spots found" />
                <p className="text-gray-500 mt-4">{`Try adjusting your filters to find what you're looking for`}</p>
                {activeFilters > 0 && (
                  <Button variant="outline" onClick={resetFilters} className="mt-4">
                    Clear All Filters
                  </Button>
                )}
              </div>
            ) : (
              filteredPosts?.map((post) => (
                <div key={post.pId} className="transition-all hover:translate-y-[-4px]">
                  <PostCardFeed post={post} />
                </div>
              ))
            )}
          </div>

          {/* Infinite scroll loader */}
          <div ref={ref} className="py-6 flex justify-center">
            {loading && <LoadingPosts />}
          </div>
        </main>
      </div>
    </div>
  );
}