import { z } from "zod";

export const VotePostSchema = z.object({
  post_id: z.string(),
  vote: z.boolean()
});

export const VoteCommentSchema = z.object({
  comment_id: z.string(),
  vote: z.boolean()
});