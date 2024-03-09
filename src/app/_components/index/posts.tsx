"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import Post from "../posts/post";

export default () => {
  const posts = api.post.posts.useQuery();

  if (posts.isFetching || !posts.data) {
    return (
      <div className="flex flex-col gap-y-3">
        {Array.from(Array(12).keys()).map((row, index) => (
          <Skeleton className="w-full h-48" key={`index-posts-loading-${index}`} />
        ))}
      </div>
    )
  };

  return (
    <div className="flex flex-col gap-y-3">
      {posts.data.map((post, index) => (
        <Post post={post} key={`index-posts-${index}`} />
      ))}
    </div>
  )
};