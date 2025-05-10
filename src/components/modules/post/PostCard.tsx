/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { MapPin, Star, ArrowUp, ArrowDown, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation"; // for programmatic navigation

type VoteType = "up" | "down" | null;

export default function PostCard(data: any) {
  const postData = data?.data;
  const router = useRouter();

  const [userVote, setUserVote] = useState<VoteType>(null);
  const [voteScore, setVoteScore] = useState(0);

  const handleVote = (type: VoteType) => {
    if (userVote === type) {
      setUserVote(null);
      setVoteScore((prev) => (type === "up" ? prev - 1 : prev + 1));
    } else {
      if (userVote) {
        setVoteScore((prev) => (userVote === "up" ? prev - 1 : prev + 1));
      }
      setUserVote(type);
      setVoteScore((prev) => (type === "up" ? prev + 1 : prev - 1));
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (postData.pType === "PREMIUM") {
      e.preventDefault(); // stop default link behavior
      console.log("object");
      router.push("/subscription-plan");
    }
  };

  return (
    <Link href={`/posts/${postData.pId}`} onClick={handleClick}>
      <div className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${postData.pType === "PREMIUM" ? "blur-sm cursor-pointer" : ""}`}>
        {/* Spot image */}
        <div className="h-48 bg-gray-200 rounded-t-lg relative overflow-hidden">
          <Image
            src={postData.postImages[0].file_path}
            alt="Post image"
            fill
            className="object-cover object-center"
          />
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">{postData?.title}</h3>
            <span className="flex items-center text-sm text-amber-600">
              <Star className="h-4 w-4 mr-1 fill-amber-500" />
              {postData?._count?.PostRating}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin className="h-4 w-4 mr-1.5 text-orange-600" />
            {postData?.location}
          </div>

          {/* Voting and Comments */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault(); // stop Link navigation when voting
                  handleVote("up");
                }}
                className={`p-1 rounded-md hover:bg-gray-100 transition-colors ${
                  userVote === "up"
                    ? "text-green-600 bg-green-50 hover:bg-green-100"
                    : "text-gray-500"
                }`}
              >
                <ArrowUp className="h-5 w-5" />
              </button>

              <span className="text-sm font-medium text-gray-700 min-w-[20px] text-center">
                {postData?._count?.votes}
              </span>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleVote("down");
                }}
                className={`p-1 rounded-md hover:bg-gray-100 transition-colors ${
                  userVote === "down"
                    ? "text-red-600 bg-red-50 hover:bg-red-100"
                    : "text-gray-500"
                }`}
              >
                <ArrowDown className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center text-gray-500 hover:text-orange-600 cursor-pointer">
              <MessageCircle className="h-4 w-4 mr-1.5" />
              <span className="text-sm">{postData?._count?.comments}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-orange-600 font-medium">
              ${postData?.priceRangeStart} - ${postData?.priceRangeEnd}
            </span>
            <span className="text-gray-500">
              {postData?._count?.comments} reviews
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
