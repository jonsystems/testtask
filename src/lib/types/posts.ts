import { User } from "@prisma/client";

export type Post = {
  id: string;
  title: string;
  content: string;
  voteScore: number;
  userVote: null | boolean;
  user: User;
  comments: null | Comment[];
  createdAt: Date;
};

export type Comment = {
  id: string;
  content: string;
  voteScore: number;
  userVote: null | boolean;
  user: User;
  comments: null | Comment[];
  createdAt: Date;
};