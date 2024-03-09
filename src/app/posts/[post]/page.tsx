"use client";
import Comments from "@/app/_components/posts/comments/comments";
import Post from "@/app/_components/posts/post";
import { Skeleton } from "@/components/ui/skeleton";
import { Comment } from "@/lib/types/posts";
import { api } from "@/trpc/react";
import Link from "next/link";
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
      <Link href={"/"}>
        <div className="flex items-center gap-x-3">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.33333 4.16667L2.5 9.99995M2.5 9.99995L8.33333 15.8333M2.5 9.99995H17.5" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="font-sm font-medium text-gray-800">Back To Posts</div>
        </div>
      </Link>
      <Post post={post.data} comments={comments} setComments={setComments} commentBox={true} />
      <Comments comments={comments} />
    </div>
  )
};