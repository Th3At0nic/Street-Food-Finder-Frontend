// app/page.tsx
import PostCard from "@/components/modules/post/PostCard";
import SearchBox from "@/components/shared/Search";
import { Button } from "@/components/ui/button";
import { MapPin, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HomePage() {

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Discover Hidden Street Food Gems
          </h1>
          <p className=" text-lg mb-8">
            Find, review, and share your favorite street food spots
          </p>

          {/* Search Form */}
          <SearchBox />
        </div>

        {/* Trending Spots */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold ">Trending Spots</h2>
            <Link href="/spots" className="text-orange-600 hover:text-orange-700 flex items-center">
              See all
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <PostCard key={item} />
            ))}
          </div>
        </section>

        {/* Premium Section */}
        <section className="bg-orange-300 rounded-xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <Sparkles className="h-8 w-8 text-orange-600" />
            <h2 className="text-2xl font-semibold ">Premium Spots</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-100 rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-20 w-20 bg-gray-200 rounded-lg"></div>
                <div>
                  <h3 className="font-medium mb-1">Secret BBQ Stall</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1.5 text-orange-600" />
                    Hidden Location
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Unlock Premium Spot
              </Button>
            </div>

            <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-lg p-6 text-white">
              <h3 className="text-xl font-semibold mb-2">Become a Premium Food Explorer</h3>
              <p className="text-sm mb-4 opacity-90">
                Get access to exclusive street food spots, premium reviews, and special discounts.
              </p>
              <Button className="bg-white text-orange-600 hover:bg-gray-100">
                Upgrade Now
              </Button>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}