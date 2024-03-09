import { Button } from "@/components/ui/button";
import { Comment, Post } from "@/lib/types/posts";
import { timeSinceDate } from "@/lib/utils";
import { api } from "@/trpc/react";
import { useUser } from "@clerk/clerk-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DownvoteIcon, UpvoteIcon } from "../svg/post";
import CommentBox from "./comments/comment-box";

type SetComment = (state: Comment[]) => void;

export default ({
  post,
  comments = null,
  setComments = null,
  commentBox = false,
  border = true
}: {
  post: Post,
  comments?: null | Comment[],
  setComments?: null | SetComment,
  commentBox?: boolean,
  border?: boolean
}) => {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [userVote, setUserVote] = useState<null | boolean>(post.userVote);
  const [voteScore, setVoteScore] = useState<number>(post.voteScore);
  const voteMutation = api.post.vote.useMutation({
    onError: () => {
      setVoteScore(post.voteScore);
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
      post_id: post.id,
      vote
    });
  };

  return (
    <div className={`flex flex-col gap-y-4 ${border ? "border-b border-solid" : ""} ${commentBox ? "pb-10" : ""}`}>
      <div
        className={`flex items-center gap-x-4 w-full ${commentBox ? "py-5" : "py-10"}`}
      >
        <div className="flex flex-col gap-y-3 items-center justify-between">
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
        <div className={`flex flex-col gap-y-1 w-full ${commentBox ? "" : "hover:cursor-pointer"}`} onClick={() => router.push(`/posts/${post.id}`)}>
          <div className="flex items-center gap-x-3">
            <Image className="rounded-full" src={post.user.imageUrl} alt={`${post.user.name} profile picture`} width={24} height={24} />
            <div className="flex text-sm text-gray-700">
              Posted by {post.user.name} {timeSinceDate(post.createdAt)}
            </div>
          </div>
          <div className={`text-gray-900 text-base font-semibold ${commentBox ? "" : "truncate"}`}>{post.title}</div>
          <div className={`text-sm text-gray-700 ${commentBox ? "" : "truncate"}`}>{post.content}</div>
        </div>
      </div>
      {commentBox && comments !== null && setComments !== null && (
        <CommentBox postId={post.id} comments={comments} setComments={setComments} />
      )}
    </div>
  )
};