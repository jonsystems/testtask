import { z } from "zod";

export const CommentPostSchema = z.object({
  post_id: z.string(),
  content: z.string().max(1024, { message: "Your comment can't be longer than 1024 characters!" })
});

export const CommentReplySchema = z.object({
  comment_id: z.string(),
  content: z.string().max(1024, { message: "Your comment can't be longer than 1024 characters!" })
});