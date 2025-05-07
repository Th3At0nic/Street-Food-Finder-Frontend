import { useState, useEffect } from "react";
import { Post, VoteType } from "@/types";
import { useSession } from "next-auth/react";

/**
 * Custom hook for handling post voting
 */
export function useVote(post: Post) {
  const { data: session } = useSession();
  const [isVoted, setIsVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [upVoteCount, setUpVoteCount] = useState(0);
  const [downVoteCount, setDownVoteCount] = useState(0);

  useEffect(() => {
    // Calculate initial vote count from post.votes
    if (post.votes) {
      const upVotes = post.votes.filter((vote) => vote.vType === VoteType.UPVOTE).length;
      const downVotes = post.votes.filter((vote) => vote.vType === VoteType.DOWNVOTE).length;
      setUpVoteCount(upVotes);
      setDownVoteCount(downVotes);
      setVoteCount(upVotes - downVotes);

      // Check if current user has voted
      if (session?.user?.email) {
        const userVote = post.votes.find((vote) => vote.voterId === session.user?.email);
        setIsVoted(!!userVote);
      }
    }
  }, [post.votes, session]);

  /**
   * Toggle vote status for the current post
   */
  const toggleVote = async (voteType: VoteType) => {
    if (!session) {
      console.log("User not authenticated");
      return;
    }

    try {
      // In a real implementation, this would be an API call
      // const response = await fetch(`/api/posts/${post.pId}/vote`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ voteType })
      // });

      // For demo, just toggle the vote state
      if (isVoted) {
        setVoteCount((prev) => prev - 1);
      } else {
        setVoteCount((prev) => prev + 1);
      }

      setIsVoted(!isVoted);
    } catch (error) {
      console.error("Error toggling vote:", error);
    }
  };

  return {
    isVoted,
    voteCount,
    upVoteCount,
    downVoteCount,
    toggleVote
  };
}
