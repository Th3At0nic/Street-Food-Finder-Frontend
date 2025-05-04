'use client';
// components/PostCard.tsx
import { MapPin, Star, ArrowUp, ArrowDown, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type VoteType = "up" | "down" | null;

export default function PostCard() {
  const [userVote, setUserVote] = useState<VoteType>(null);
  const [voteScore, setVoteScore] = useState(0);
  const [commentCount] = useState(15);

  const handleVote = (type: VoteType) => {
    if (userVote === type) {
      // Remove existing vote
      setUserVote(null);
      setVoteScore(prev => type === "up" ? prev - 1 : prev + 1);
    } else {
      // New vote or change vote
      if (userVote) {
        // If changing vote, remove previous impact first
        setVoteScore(prev => userVote === "up" ? prev - 1 : prev + 1);
      }
      // Apply new vote
      setUserVote(type);
      setVoteScore(prev => type === "up" ? prev + 1 : prev - 1);
    }
  };

  return (
    <Link href={`/spots/1`}>
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
        {/* // spot image will be here  */}
      <div className="h-48 bg-gray-200 rounded-t-lg"></div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Spicy Chicken Tacos</h3>
          <span className="flex items-center text-sm text-amber-600">
            <Star className="h-4 w-4 mr-1 fill-amber-500" />
            4.8
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1.5 text-orange-600" />
          Downtown Market
        </div>

        {/* Voting and Comments Section */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleVote('up')}
              className={`p-1 rounded-md hover:bg-gray-100 transition-colors ${
                userVote === 'up' 
                  ? 'text-green-600 bg-green-50 hover:bg-green-100' 
                  : 'text-gray-500'
              }`}
            >
              <ArrowUp className="h-5 w-5" />
            </button>
            <span className="text-sm font-medium text-gray-700 min-w-[20px] text-center">
              {voteScore}
            </span>
            <button 
              onClick={() => handleVote('down')}
              className={`p-1 rounded-md hover:bg-gray-100 transition-colors ${
                userVote === 'down' 
                  ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                  : 'text-gray-500'
              }`}
            >
              <ArrowDown className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center text-gray-500 hover:text-orange-600 cursor-pointer">
            <MessageCircle className="h-4 w-4 mr-1.5" />
            <span className="text-sm">{commentCount}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-orange-600 font-medium">$3 - $8</span>
          <span className="text-gray-500">15 reviews</span>
        </div>
      </div>
    </div>
    </Link>
  );
}