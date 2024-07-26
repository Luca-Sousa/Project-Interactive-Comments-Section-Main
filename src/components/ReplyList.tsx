import { datas } from "../Datas";
import { Reply } from "../Types";
import { Comment } from "./Comment";

interface ReplyListProps {
  replies: Reply[];
  currentUser: typeof datas.currentUser;
  onReply: (id: string, username: string) => void;
  onEdit: (id: string, content: string, isReply: boolean) => void;
  onDelete: (id: string) => void;
}

export function ReplyList({
  replies,
  currentUser,
  onReply,
  onEdit,
  onDelete,
}: ReplyListProps) {
  return (
    <div className="flex">
      <div className="w-20">
        <div className="w-1 rounded-lg h-full mx-auto bg-colorLightGrayishBlue"></div>
      </div>
      <div className="flex-1 space-y-6">
        {replies.map((reply) => (
          <Comment
            key={reply.id}
            comment={reply}
            currentUser={currentUser}
            onReply={onReply}
            onEdit={onEdit}
            onDelete={onDelete}
            isReply
          />
        ))}
      </div>
    </div>
  );
}
