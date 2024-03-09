import { Comment as CommentType } from "@/lib/types/posts";
import Comment from "./comment";

export default ({ comments }: { comments: CommentType[] }) => {
  return (
    <div className="flex flex-col gap-y-3 py-3">
      <div className="text-sm text-gray-800 font-medium">All Comments</div>
      {comments.map((comment, index) => (
        <Comment comment={comment} key={`post-comments-${index}`} />
      ))}
    </div>
  )
};