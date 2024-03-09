"use client";
import { Button } from "@/components/ui/button";
import { Comment } from "@/lib/types/posts";
import { timeSinceDate } from "@/lib/utils";
import { api } from "@/trpc/react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CommentReply, DownvoteIcon, UpvoteIcon } from "../../svg/post";
import ReplyBox from "./reply-box";

const CommentComponent = ({ comment, indetation = 0 }: { comment: Comment, indetation?: number }) => {
  const loadRepliesQuery = api.comment.getReplies.useQuery(comment.id, { enabled: false });

  const { isSignedIn } = useUser();
  const router = useRouter();
  const [replies, setReplies] = useState<Comment[]>(comment.comments ?? []);
  const [replyToggled, setReplyToggled] = useState<boolean>(false);
  const [showLoadReplies, setShowLoadReplies] = useState(comment.comments === null);
  const [userVote, setUserVote] = useState<null | boolean>(comment.userVote);
  const [voteScore, setVoteScore] = useState<number>(comment.voteScore);
  const voteMutation = api.comment.voteComment.useMutation({
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

  const loadReplies = async () => {
    loadRepliesQuery.refetch();
  };

  useEffect(() => {
    if (!loadRepliesQuery.data) return;
    setReplies(loadRepliesQuery.data);
  }, [loadRepliesQuery.data]);

  return (
    <div
      className={`flex flex-col gap-y-6 py-6 w-full`}
      style={{ marginLeft: `${indetation * 32}px` }}
    >
      <div className="flex flex-col gap-y-3">
        <div className="flex items-center gap-x-3">
          <Image className="rounded-full" src={comment.user.imageUrl} alt={`${comment.user.name} profile picture`} width={24} height={24} />
          <div className="flex text-sm text-gray-700">
            Posted by {comment.user.name} {timeSinceDate(comment.createdAt)}
          </div>
        </div>
        <div className="text-sm text-gray-800">{comment.content}</div>
        <div className="flex gap-x-2 items-center">
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
          <Button variant={"ghost"} className="flex gap-x-2 items-center text-gray-700 font-medium" onClick={() => setReplyToggled(!replyToggled)}>
            <CommentReply />
            <div className="text-sm">Reply</div>
          </Button>
        </div>
        {showLoadReplies && !loadRepliesQuery.isSuccess && <div className="text-indigo-500 text-sm hover:cursor-pointer" onClick={() => loadReplies()}>{loadRepliesQuery.isFetching ? "Loading Replies" : "Load Replies"}</div>}
      </div>
      {replyToggled && replies && <ReplyBox commentId={comment.id} comments={replies} setComments={setReplies} setReplyBox={setReplyToggled} indetation={indetation + 1} />}
      {replies && replies.map((comment, index) => (
        <CommentComponent comment={comment} indetation={indetation + 1} key={`comment-reply-${comment.id}-${index}`} />
      ))}
    </div>
  )
};

export default CommentComponent;