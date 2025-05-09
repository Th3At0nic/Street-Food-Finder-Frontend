'use client'
// app/spots/[id]/page.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Star,
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Utensils,
  Clock,
  Wallet,
  Shield,
  Map
} from "lucide-react";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { useState } from "react";


export default function FoodSpotPage() {
  const isPremiumUser = false; // Replace with actual auth check
  const isPremiumPost = true; // Replace with post data
  const [comment, setComment] = useState("");
  
  // Temporary data - replace with API calls
  const spot = {
    id: 1,
    title: "Spicy Chicken Tacos",
    rating: 4.8,
    price: "$3 - $8",
    location: "Downtown Market",
    category: "Snacks",
    description: "Authentic Mexican-style tacos with secret family recipe salsa",
    hours: "11 AM - 9 PM Daily",
    reviews: 15,
    images: Array(3).fill(null),
  
  };

  return (
    <div className="min-h-screen bg-gray-50">
    

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Navigation */}
      <nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/spots" className="text-orange-600 hover:text-orange-700 flex items-center">
            ← Back to all spots
          </Link>
        </div>
      </nav>
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold  mb-2">
              {spot.title}
              {isPremiumPost && (
                <Badge  className="ml-2">
                  <Shield className="h-4 w-4 mr-1" />
                  Premium
                </Badge>
              )}
            </h1>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1.5 text-orange-600" />
              {spot.location}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            <span className="font-medium">{spot.rating}</span>
            <span className="text-gray-500">({spot.reviews} reviews)</span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {spot.images.map((_, index) => (
            <div key={index} className="h-64 bg-gray-200 rounded-lg relative">
              
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                {/* spot images will be here */}
                </div>
             
            </div>
          ))}
        </div>

        {/* Details Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            {/* Description */}
            <section className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">About this spot</h2>
              <p className="text-gray-600">{spot.description}</p>
            </section>

            {/* Reviews & Comments */}
            <section className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Reviews ({spot.reviews})</h2>
              
              {/* Comment Form */}
              <div className="mb-6">
                <Input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  className="mb-2"
                />
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <Star key={num} className="h-5 w-5 text-amber-500 cursor-pointer" />
                    ))}
                  </div>
                  <Button>Post Review</Button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {[1, 2, 3].map((comment) => (
                  <div key={comment} className="border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">User {comment}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        4.5
                      </div>
                    </div>
                    <p className="text-gray-600">Amazing tacos! The spicy sauce is incredible.</p>
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
                  Category: {spot.category}
                </div>
                <div className="flex items-center text-gray-600">
                  <Wallet className="h-4 w-4 mr-2 text-orange-600" />
                  Price: {spot.price}
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2 text-orange-600" />
                  Hours: {spot.hours}
                </div>
              </div>
            </div>

            {/* Voting */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-4">Helpful?</h3>
              <div className="flex items-center gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowUp className="h-4 w-4" />
                  24
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowDown className="h-4 w-4" />
                  2
                </Button>
              </div>
            </div>

    
          </div>
        </div>
      </div>
    </div>
  );
}