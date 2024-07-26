import { Comment as CommentType } from "../Types";
import { Comment } from "./Comment";
import { datas } from "../Datas";
import { ReplyList } from "./ReplyList";

interface CommentListProps {
  comments: CommentType[];
  currentUser: typeof datas.currentUser;
  onReply: (id: string, username: string) => void;
  onEdit: (id: string, content: string, isReply: boolean) => void;
  onDelete: (id: string) => void;
}

export function CommentList({
  comments,
  currentUser,
  onReply,
  onEdit,
  onDelete,
}: CommentListProps) {
  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="space-y-6">
          <Comment
            comment={comment}
            currentUser={currentUser}
            onReply={onReply}
            onEdit={onEdit}
            onDelete={onDelete}
          />

          {comment.replies.length > 0 && (
            <ReplyList
              replies={comment.replies}
              currentUser={currentUser}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          )}
        </div>
      ))}
    </div>
  );
}
