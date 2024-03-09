"use client";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CommentReplySchema } from "@/lib/schema/posts/comment";
import { Comment } from "@/lib/types/posts";
import { api } from "@/trpc/react";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default ({ commentId, comments, setComments, setReplyBox, indetation }: { commentId: string, comments: Comment[], setComments: (state: Comment[]) => void, setReplyBox: (state: boolean) => void, indetation: number }) => {
  const router = useRouter();
  const { user } = useUser();
  const replyMutation = api.comment.createReply.useMutation();

  const form = useForm<z.infer<typeof CommentReplySchema>>({
    resolver: zodResolver(CommentReplySchema),
    defaultValues: {
      comment_id: commentId
    }
  });

  const onSubmit = async (values: z.infer<typeof CommentReplySchema>) => {
    const result = await replyMutation.mutateAsync(values);
    if (result.id) {
      setComments(comments.concat([result]));
      setReplyBox(false);
    }
  };

  if (!user) {
    router.push("/sign-in");
    return <></>;
  } //loggedout users cant post

  return (
    <div
      className="flex gap-x-3 h-fit p-4 border border-solid shadow-md rounded-2xl w-full"
      style={{ marginLeft: `${indetation * 32}px` }}
    >
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
                  <FormItem>
                    <Input className="border-0 text-base w-full" placeholder="Share your thoughts with the world!" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-end border-t-2 pt-4 px-0 border-solid w-full">
                <Button disabled={replyMutation.isLoading} type={"submit"}>Reply</Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
};