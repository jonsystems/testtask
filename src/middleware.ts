import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes: ["/", "sign-in", "/posts", "/posts/(.*)", "/api/webhooks/clerk", "/api/trpc/post.posts", "/api/trpc/post.get", "/api/trpc/comment.getReplies"]
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"]
}