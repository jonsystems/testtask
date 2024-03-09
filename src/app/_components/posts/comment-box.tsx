"use client";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CommentPostSchema } from "@/lib/schema/posts/comment";
import { Comment } from "@/lib/types/posts";
import { api } from "@/trpc/react";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default ({ postId, comments, setComments }: { postId: string, comments: Comment[], setComments: (state: Comment[]) => void }) => {
  const { user } = useUser();
  const commentMutation = api.post.comment.useMutation();

  const form = useForm<z.infer<typeof CommentPostSchema>>({
    resolver: zodResolver(CommentPostSchema),
    defaultValues: {
      post_id: postId
    }
  });

  const onSubmit = async (values: z.infer<typeof CommentPostSchema>) => {
    const result = await commentMutation.mutateAsync(values);
    if (result.id) setComments(comments.concat([result]))
  };

  if (!user) return null; //loggedout users cant post

  return (
    <div className="flex gap-x-3 h-fit p-4 border border-solid shadow-md rounded-2xl w-full">
      <div className="flex flex-col">
        <Image className="rounded-full" src={user.imageUrl} alt={`${user.fullName} profile picture`} width={32} height={32} />
      </div>
      <div className="flex flex-col w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col">
              <FormField
                control={form.control}
                name={"content"}
                render={({ field }) => (
                  <Input className="border-0 text-base w-full" placeholder="Share your thoughts with the world!" {...field} />
                )}
              />
              <div className="flex items-center justify-end border-t-2 pt-4 px-0 border-solid w-full">
                <Button disabled={commentMutation.isLoading} type={"submit"}>Comment</Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
};