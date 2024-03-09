import { CommentPostSchema } from "@/lib/schema/posts/comment";
import { CreatePostSchema } from "@/lib/schema/posts/create";
import { VoteCommentSchema, VotePostSchema } from "@/lib/schema/posts/vote";
import { Comment, Post } from "@/lib/types/posts";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const postRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const post = await db.post.findUnique({ where: { id: input }, include: { user: true, votes: true, comments: { include: { votes: true, user: true } } } });
      if (!post) throw new TRPCError({ code: "NOT_FOUND", message: "This post doesn't exist!" });

      const positiveVotes = post.votes.filter(p => p.vote === true).length;
      const negativeVotes = post.votes.filter(p => p.vote === false).length;

      const voteScore = positiveVotes - negativeVotes;

      let userVote = null;
      if (ctx.session.userId) {
        const voteIndex = post.votes.findIndex(v => v.userId === ctx.session.userId);
        if (voteIndex !== -1) {
          const vote = post.votes[voteIndex];
          if (vote) {
            userVote = vote.vote;
          }
        }
      };

      const comments = post.comments.map(comment => {
        const commentPositiveVotes = comment.votes.filter(p => p.vote === true).length;
        const commentNegativeVotes = comment.votes.filter(p => p.vote === false).length;

        const commentVoteScore = commentPositiveVotes - commentNegativeVotes;

        let userCommentVote = null;
        if (ctx.session.userId) {
          const commentVoteIndex = comment.votes.findIndex(v => v.userId === ctx.session.userId);
          if (commentVoteIndex !== -1) {
            const vote = comment.votes[commentVoteIndex];
            if (vote) {
              userCommentVote = vote.vote;
            }
          }
        };

        return {
          id: comment.id,
          content: comment.content,
          voteScore: commentVoteScore,
          userVote: userCommentVote,
          user: comment.user,
          createdAt: comment.createdAt
        }
      }) as Comment[];

      return {
        id: post.id,
        title: post.title,
        content: post.content,
        voteScore,
        userVote,
        user: post.user,
        comments: comments,
        createdAt: post.createdAt
      } as Post;
    }),
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
      let posts = await db.post.findMany({ include: { user: true, votes: true } });

      let mappedPosts = posts.map((post) => {
        const positiveVotes = post.votes.filter(p => p.vote === true).length;
        const negativeVotes = post.votes.filter(p => p.vote === false).length;

        const voteScore = positiveVotes - negativeVotes;

        let userVote = null;
        if (ctx.session.userId) {
          const voteIndex = post.votes.findIndex(v => v.userId === ctx.session.userId);
          if (voteIndex !== -1) {
            const vote = post.votes[voteIndex];
            if (vote) {
              userVote = vote.vote;
            }
          }
        };

        return {
          id: post.id,
          title: post.title,
          content: post.content,
          voteScore,
          userVote,
          user: post.user,
          comments: null,
          createdAt: post.createdAt
        }
      }) as Post[];

      return mappedPosts;
    }),
  vote: protectedProcedure
    .input(VotePostSchema)
    .mutation(async ({ ctx, input }) => {
      const post = await db.post.findUnique({ where: { id: input.post_id } });
      if (!post) throw new TRPCError({ code: "NOT_FOUND", message: "This post doesn't exist!" });

      const existingUserVote = await db.postVote.findFirst({
        where: {
          AND: [
            { postId: post.id },
            { userId: ctx.session.userId }
          ]
        }
      });

      if (existingUserVote) {
        if (existingUserVote.vote === input.vote) {
          await db.postVote.delete({
            where: { id: existingUserVote.id }
          })
        } else {
          await db.postVote.update({
            where: { id: existingUserVote.id },
            data: {
              vote: input.vote
            }
          });
        }
      } else {
        await db.postVote.create({
          data: {
            vote: input.vote,
            postId: post.id,
            userId: ctx.session.userId
          }
        })
      };

      return true;
    }),
  comment: protectedProcedure
    .input(CommentPostSchema)
    .mutation(async ({ ctx, input }) => {
      const post = await db.post.findUnique({ where: { id: input.post_id } });
      if (!post) throw new TRPCError({ code: "NOT_FOUND", message: "This post doesn't exist!" });

      const comment = await db.comment.create({
        data: {
          content: input.content,
          postId: post.id,
          userId: ctx.session.userId
        },
        include: { user: true }
      });

      return {
        id: comment.id,
        content: comment.content,
        voteScore: 0,
        userVote: null,
        user: comment.user,
        createdAt: comment.createdAt
      };
    }),
  voteComment: protectedProcedure
    .input(VoteCommentSchema)
    .mutation(async ({ ctx, input }) => {
      const comment = await db.comment.findUnique({ where: { id: input.comment_id } });
      if (!comment) throw new TRPCError({ code: "NOT_FOUND", message: "This comment doesn't exist!" });

      const existingUserVote = await db.commentVote.findFirst({
        where: {
          AND: [
            { commentId: comment.id },
            { userId: ctx.session.userId }
          ]
        }
      });

      if (existingUserVote) {
        if (existingUserVote.vote === input.vote) {
          await db.commentVote.delete({
            where: { id: existingUserVote.id }
          })
        } else {
          await db.commentVote.update({
            where: { id: existingUserVote.id },
            data: {
              vote: input.vote
            }
          });
        }
      } else {
        await db.commentVote.create({
          data: {
            vote: input.vote,
            commentId: comment.id,
            userId: ctx.session.userId
          }
        })
      };

      return true;
    })

});
