import z from "zod";

export const CreatePostSchema = z.object({
  title: z.string()
    .max(128, { message: "Your post title can't be longer than 128 characters!" }),
  content: z.string()
    .max(4096, { message: "Your post content must be shorter than 4096 characters!" })
});