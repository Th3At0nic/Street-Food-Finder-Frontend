import { useState, useEffect } from "react";
import { Post, VoteType } from "@/types";
import { useSession } from "next-auth/react";
import { getUserVote, getVoteCounts, voteOnPost } from "@/app/actions/post-actions";

/**
 * Custom hook for handling post voting
 */
export function useVote(post: Post) {
  const { data: session } = useSession();
  const [isVoted, setIsVoted] = useState(false);
  const [isUpVoted, setIsUpVoted] = useState(false);
  const [isDownVoted, setIsDownVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [upVoteCount, setUpVoteCount] = useState(0);
  const [downVoteCount, setDownVoteCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize vote data
    const fetchVoteData = async () => {
      if (!post.pId) return;

      try {
        setIsLoading(true);
        // Get vote counts for the post
        const voteCounts = await getVoteCounts({ postId: post.pId });
        setUpVoteCount(voteCounts.upVoteCount);
        setDownVoteCount(voteCounts.downVoteCount);
        setVoteCount(voteCounts.upVoteCount - voteCounts.downVoteCount);

        // Check if current user has voted, but only if they're logged in
        if (session?.user?.id) {
          const userVote = await getUserVote({ postId: post.pId });
          setIsVoted(!!userVote);
          setIsUpVoted(userVote?.vType === VoteType.UPVOTE);
          setIsDownVoted(userVote?.vType === VoteType.DOWNVOTE);
        }
      } catch (error) {
        console.error("Error fetching vote data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVoteData();
  }, [post.pId, session?.user?.id]);

  /**
   * Toggle vote status for the current post
   */
  const toggleVote = async (voteType: VoteType) => {
    if (!session) {
      console.log("User not authenticated");
      return;
    }

    try {
      const prevIsVoted = isVoted;
      const prevIsUpVoted = isUpVoted;
      const prevIsDownVoted = isDownVoted;
      const prevUpVoteCount = upVoteCount;
      const prevDownVoteCount = downVoteCount;
      const prevVoteCount = voteCount;

      if (!isVoted) {
        // Case 1: New vote (no previous vote)
        if (voteType === VoteType.UPVOTE) {
          setUpVoteCount(prevUpVoteCount + 1);
          setVoteCount(prevVoteCount + 1);
          setIsUpVoted(true);
        } else {
          setDownVoteCount(prevDownVoteCount + 1);
          setVoteCount(prevVoteCount - 1);
          setIsDownVoted(true);
        }
        setIsVoted(true);
      } else if ((isUpVoted && voteType === VoteType.UPVOTE) || (isDownVoted && voteType === VoteType.DOWNVOTE)) {
        // Case 2: Remove existing vote (clicking same button)
        if (isUpVoted) {
          setUpVoteCount(prevUpVoteCount - 1);
          setVoteCount(prevVoteCount - 1);
        } else {
          setDownVoteCount(prevDownVoteCount - 1);
          setVoteCount(prevVoteCount + 1);
        }
        setIsVoted(false);
        setIsUpVoted(false);
        setIsDownVoted(false);
      } else {
        // Case 3: Switching vote type
        if (isUpVoted && voteType === VoteType.DOWNVOTE) {
          // Switching from upvote to downvote
          setUpVoteCount(prevUpVoteCount - 1);
          setDownVoteCount(prevDownVoteCount + 1);
          setVoteCount(prevVoteCount - 2);
          setIsUpVoted(false);
          setIsDownVoted(true);
        } else {
          // Switching from downvote to upvote
          setDownVoteCount(prevDownVoteCount - 1);
          setUpVoteCount(prevUpVoteCount + 1);
          setVoteCount(prevVoteCount + 2);
          setIsDownVoted(false);
          setIsUpVoted(true);
        }
      }

      // Make API call
      const response = await voteOnPost({
        postId: post.pId,
        vType: voteType
      });

      // If the API call fails, rollback changes
      if (!response.success) {
        setIsVoted(prevIsVoted);
        setIsUpVoted(prevIsUpVoted);
        setIsDownVoted(prevIsDownVoted);
        setUpVoteCount(prevUpVoteCount);
        setDownVoteCount(prevDownVoteCount);
        setVoteCount(prevVoteCount);
        console.error("Error updating vote:", response);
      }
    } catch (error) {
      console.error("Error toggling vote:", error);
    }
  };

  return {
    isVoted,
    isUpVoted,
    isDownVoted,
    voteCount,
    upVoteCount,
    downVoteCount,
    toggleVote,
    isLoading
  };
}
