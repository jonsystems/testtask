"use client";
import Comments from "@/app/_components/posts/comments";
import Post from "@/app/_components/posts/post";
import { Skeleton } from "@/components/ui/skeleton";
import { Comment } from "@/lib/types/posts";
import { api } from "@/trpc/react";
import { useEffect, useState } from "react";

export default ({ params }: { params: { post: string } }) => {
  const post = api.post.get.useQuery(params.post);

  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (!post.data || !post.data.comments) return;
    setComments(post.data.comments);
  }, [post.data]);

  if (post.isFetching || !post.data) {
    return (
      <div className="flex flex-col gap-y-4 w-full">
        <Skeleton className="w-full h-48" />
        <div className="flex flex-col gap-y-3">
          {Array.from(Array(12).keys()).map((row, index) => (
            <Skeleton className="w-full h-32" key={`post-loading-comment-${index}`} />
          ))}
        </div>
      </div>
    )
  };

  return (
    <div className="flex flex-col gap-y-4 w-full">
      <Post post={post.data} comments={comments} setComments={setComments} commentBox={true} />
      <Comments comments={comments} />
    </div>
  )
};