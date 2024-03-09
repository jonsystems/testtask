import { CommentPostSchema, CommentReplySchema } from "@/lib/schema/posts/comment";
import { VoteCommentSchema } from "@/lib/schema/posts/vote";
import { db } from "@/server/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export default createTRPCRouter({
  create: protectedProcedure
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
        comments: null,
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
    }),
  createReply: protectedProcedure
    .input(CommentReplySchema)
    .mutation(async ({ ctx, input }) => {
      const comment = await db.comment.findUnique({ where: { id: input.comment_id } });
      if (!comment) throw new TRPCError({ code: "NOT_FOUND", message: "This post doesn't exist!" });

      const commentReply = await db.comment.create({
        data: {
          content: input.content,
          parentId: comment.id,
          userId: ctx.session.userId
        },
        include: { user: true }
      });

      return {
        id: comment.id,
        content: input.content,
        voteScore: 0,
        userVote: null,
        user: commentReply.user,
        comments: null,
        createdAt: comment.createdAt
      };
    }),
  getReplies: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const comment = await db.comment.findUnique({ where: { id: input } });
      if (!comment) throw new TRPCError({ code: "NOT_FOUND", message: "This comment doesn't exist!" });

      const commentReplies = await db.comment.findMany({ where: { parentId: input }, include: { votes: true, user: true } });

      const replies = commentReplies.map(comment => {
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
          comments: null,
          createdAt: comment.createdAt
        }
      });

      return replies;
    })
})