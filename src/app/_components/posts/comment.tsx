"use client";
import { Button } from "@/components/ui/button";
import { Comment } from "@/lib/types/posts";
import { timeSinceDate } from "@/lib/utils";
import { api } from "@/trpc/react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DownvoteIcon, UpvoteIcon } from "../svg/post";

export default ({ comment }: { comment: Comment }) => {
  console.log(comment);
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [userVote, setUserVote] = useState<null | boolean>(comment.userVote);
  const [voteScore, setVoteScore] = useState<number>(comment.voteScore);
  const voteMutation = api.post.voteComment.useMutation({
    onError: () => {
      setVoteScore(comment.voteScore);
    }
  });

  const voteAction = async (vote: boolean) => {
    if (!isSignedIn) return router.push("/sign-in");
    if (vote !== userVote) {
      if (userVote !== null) {
        setVoteScore(vote ? voteScore + 2 : voteScore - 2);
      } else {
        setVoteScore(vote ? voteScore + 1 : voteScore - 1);
      }
      setUserVote(vote);
    } else {
      setVoteScore(!userVote ? voteScore + 1 : voteScore - 1);
      setUserVote(null);
    }
    await voteMutation.mutateAsync({
      comment_id: comment.id,
      vote
    });
  };

  return (
    <div
      className={`flex items-center gap-x-3 w-full py-6`}
    >
      <div className="flex flex-col gap-y-3">
        <div className="flex items-center gap-x-3">
          <Image className="rounded-full" src={comment.user.imageUrl} alt={`${comment.user.name} profile picture`} width={24} height={24} />
          <div className="flex text-sm text-gray-700">
            Posted by {comment.user.name} {timeSinceDate(comment.createdAt)}
          </div>
        </div>
        <div className="text-sm text-gray-700 truncate">{comment.content}</div>
        <div className="flex gap-x-3 items-center">
          <Button variant={"ghost"} size={"icon"} disabled={voteMutation.isLoading} onClick={() => voteAction(true)}>
            <UpvoteIcon className={userVote === true ? "stroke-indigo-500" : "stroke-gray-700"} />
          </Button>
          <div className="text-base text-gray-800 font-medium">
            {voteScore}
          </div>
          <Button variant={"ghost"} size={"icon"} disabled={voteMutation.isLoading} onClick={() => voteAction(false)}>
            <DownvoteIcon className={userVote === false ? "stroke-indigo-500" : "stroke-gray-700"} />
          </Button>
        </div>
      </div>
    </div>
  )
};