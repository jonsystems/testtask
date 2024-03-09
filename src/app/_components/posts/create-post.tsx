"use client";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CreatePostSchema } from "@/lib/schema/posts/create";
import { api } from "@/trpc/react";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default () => {
  const router = useRouter();
  const { user } = useUser();
  const postMutation = api.post.create.useMutation();

  const form = useForm<z.infer<typeof CreatePostSchema>>({
    resolver: zodResolver(CreatePostSchema)
  });

  const onSubmit = async (values: z.infer<typeof CreatePostSchema>) => {
    const result = await postMutation.mutateAsync(values);
    if (result) router.push(`/posts/${result}`);
  };

  if (!user) return null; //loggedout users cant post

  return (
    <div className="flex gap-x-3 min-h-36 h-fit p-4 border border-solid shadow-md rounded-2xl w-full">
      <div className="flex flex-col">
        <Image className="rounded-full" src={user.imageUrl} alt={`${user.fullName} profile picture`} width={32} height={32} />
      </div>
      <div className="flex flex-col w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name={"title"}
              render={({ field }) => (
                <Input className="border-0 text-base font-semibold w-full" placeholder="Title of your post" {...field} />
              )}
            />
            <div className="flex flex-col gap-y-2">
              <FormField
                control={form.control}
                name={"content"}
                render={({ field }) => (
                  <Textarea className="border-0 text-base w-full" placeholder="Share your thoughts with the world!" {...field} />
                )}
              />
              <div className="flex justify-end border-t-2 pt-3 px-0 border-solid w-full">
                <Button type={"submit"}>Post</Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
};