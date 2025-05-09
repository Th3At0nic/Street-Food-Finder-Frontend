import { useState, useEffect } from "react";
import { TPost } from "@/types";
import { useSession } from "next-auth/react";
import { getMyPostRating, postRatingOnPost, updateMyPostRating } from "@/app/actions/post-actions";

/**
 * Custom hook for handling post rating
 */
export function usePostRating(post: TPost) {
  const { data: session } = useSession();
  const [myPostRating, setMyPostRating] = useState<number | null>(null);
  const [myPostRatingId, setMyPostRatingId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [initialRating, setInitialRating] = useState<number | null>(null);

  useEffect(() => {
    const fetchRatingData = async () => {
      try {
        const rating = await getMyPostRating(post.pId);
        console.log({ rating });
        const ratingValue = rating.data?.rating ?? null;
        setMyPostRating(ratingValue);
        setInitialRating(ratingValue);
        setMyPostRatingId(rating.data?.prId ?? "");
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching rating:", err);
        setIsLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchRatingData();
    } else {
      setIsLoading(false);
    }
  }, [post.pId, session?.user?.id]);

  useEffect(() => {
    const handleRatingChange = async () => {
      if (isLoading || myPostRating === initialRating) {
        return;
      }

      console.log({ myPostRating, initialRating, myPostRatingId });

      try {
        if (myPostRatingId) {
          if (myPostRating === null) {
            console.log("Deleting rating");
          } else {
            console.log("Updating rating");
            await updateMyPostRating(myPostRatingId, myPostRating);
          }
        } else if (myPostRating !== null) {
          console.log("Creating new rating");
          const result = await postRatingOnPost(post.pId, myPostRating);
          if (result.data?.prId) {
            setMyPostRatingId(result.data.prId);
          }
        }
      } catch (err) {
        console.error("Error updating rating:", err);
      }
    };

    handleRatingChange();
  }, [myPostRating, myPostRatingId, isLoading, initialRating, post.pId]);

  return {
    myPostRating,
    isLoading,
    myPostRatingId,
    setMyPostRating
  };
}
