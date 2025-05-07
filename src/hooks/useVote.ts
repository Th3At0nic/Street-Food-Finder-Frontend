import { useState, useEffect } from "react";
import { Post, VoteType } from "@/types";
import { useSession } from "next-auth/react";
import { voteOnPost } from "@/app/actions/post-actions";

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

  useEffect(() => {
    // Calculate initial vote count from post.votes
    if (post.votes) {
      const upVotes = post.votes.filter((vote) => vote.vType === VoteType.UPVOTE).length;
      const downVotes = post.votes.filter((vote) => vote.vType === VoteType.DOWNVOTE).length;
      setUpVoteCount(upVotes);
      setDownVoteCount(downVotes);
      setVoteCount(upVotes - downVotes);

      // Check if current user has voted
      if (session?.user?.id) {
        const userVote = post.votes.find((vote) => vote.voterId === session.user.id);
        setIsVoted(!!userVote);
        if (userVote?.vType === VoteType.UPVOTE) {
          setIsUpVoted(true);
          setIsDownVoted(false);
        } else if (userVote?.vType === VoteType.DOWNVOTE) {
          setIsUpVoted(false);
          setIsDownVoted(true);
        } else {
          setIsUpVoted(false);
          setIsDownVoted(false);
        }
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
      // Save current state for rollback if needed
      const prevIsVoted = isVoted;
      const prevIsUpVoted = isUpVoted;
      const prevIsDownVoted = isDownVoted;
      const prevUpVoteCount = upVoteCount;
      const prevDownVoteCount = downVoteCount;

      // Optimistically update UI based on current state and vote type
      if (!isVoted) {
        // Case 1: New vote (no previous vote)
        if (voteType === VoteType.UPVOTE) {
          setUpVoteCount((prev) => prev + 1);
          setIsUpVoted(true);
          setIsDownVoted(false);
        } else if (voteType === VoteType.DOWNVOTE) {
          setDownVoteCount((prev) => prev + 1);
          setIsUpVoted(false);
          setIsDownVoted(true);
        }
        setIsVoted(true);
      } else if ((isUpVoted && voteType === VoteType.UPVOTE) || (isDownVoted && voteType === VoteType.DOWNVOTE)) {
        // Case 2: Remove existing vote (clicking same button)
        if (isUpVoted) {
          setUpVoteCount((prev) => prev - 1);
        } else if (isDownVoted) {
          setDownVoteCount((prev) => prev - 1);
        }
        setIsVoted(false);
        setIsUpVoted(false);
        setIsDownVoted(false);
      } else {
        // Case 3: Switching vote type
        if (isUpVoted && voteType === VoteType.DOWNVOTE) {
          // Switching from upvote to downvote
          setUpVoteCount((prev) => prev - 1);
          setDownVoteCount((prev) => prev + 1);
          setIsUpVoted(false);
          setIsDownVoted(true);
        } else if (isDownVoted && voteType === VoteType.UPVOTE) {
          // Switching from downvote to upvote
          setDownVoteCount((prev) => prev - 1);
          setUpVoteCount((prev) => prev + 1);
          setIsDownVoted(false);
          setIsUpVoted(true);
        }
      }

      // Calculate new total vote count
      const newUpVoteCount =
        voteType === VoteType.UPVOTE && !isUpVoted
          ? upVoteCount + 1
          : isUpVoted && voteType !== VoteType.UPVOTE
          ? upVoteCount - 1
          : upVoteCount;

      const newDownVoteCount =
        voteType === VoteType.DOWNVOTE && !isDownVoted
          ? downVoteCount + 1
          : isDownVoted && voteType !== VoteType.DOWNVOTE
          ? downVoteCount - 1
          : downVoteCount;

      setVoteCount(newUpVoteCount - newDownVoteCount);

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
        setVoteCount(prevUpVoteCount - prevDownVoteCount);
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
    toggleVote
  };
}
