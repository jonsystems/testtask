
import { CreatePostSchema } from "@/lib/schema/posts/create";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(CreatePostSchema)
    .mutation(async ({ ctx, input }) => {
      const post = await db.post.create({
        data: {
          title: input.title,
          content: input.content,
          userId: ctx.session.userId
        }
      });

      return post.id;
    }),
  posts: publicProcedure
    .query(async ({ ctx }) => {

    })
});
