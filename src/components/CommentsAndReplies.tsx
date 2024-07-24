import IconPlus from "/src/assets/images/icon-plus.svg";
import IconMinus from "/src/assets/images/icon-minus.svg";
import IconReply from "/src/assets/images/icon-reply.svg";
import { Comment, User } from "../Types";
import { Textarea } from "./Textearea";
import { Button } from "./Button";

interface CommentsAndRepliesProps {
  comment: Comment;
  replyingCommentId: number | null;
  replyContent: string;
  currentUser: User;
  handleReplyToComment: (commentId: number, username: string) => void;
  setReplyContent: (content: string) => void;
  handleCancelReply: () => void;
}

export function CommentsAndReplies({
  comment,
  replyingCommentId,
  replyContent,
  currentUser,
  handleReplyToComment,
  setReplyContent,
  handleCancelReply,
}: CommentsAndRepliesProps) {
  return (
    <>
      <div key={comment.id} className="flex gap-4 rounded-xl p-6 bg-colorWhite">
        <div className="w-10 h-fit flex flex-col items-center justify-center p-4 bg-colorLightGray rounded-xl gap-4">
          <button>
            <img src={IconPlus} alt="Icon Plus" />
          </button>
          <div className="font-medium text-colorModerateBlue">
            {comment.score}
          </div>
          <button>
            <img src={IconMinus} alt="Icon Minus" />
          </button>
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex">
            <div className="flex items-center gap-4 flex-1">
              <img
                className="size-8"
                src={comment.user.image.png}
                alt={`Image User: ${comment.user.username}`}
              />
              <h2 className="text-colorDarkBlue font-medium">
                {comment.user.username}
              </h2>
              <p className="text-colorGrayishBlue">{comment.createdAt}</p>
            </div>

            <button
              className="flex items-center gap-2 text-colorModerateBlue font-bold"
              onClick={() =>
                handleReplyToComment(comment.id, comment.user.username)
              }
            >
              <img className="size-4" src={IconReply} alt="Icon Reply" />
              Reply
            </button>
          </div>

          <p className="text-colorGrayishBlue">{comment.content}</p>
        </div>
      </div>

      {replyingCommentId === comment.id && (
        <div className="flex flex-1 items-start gap-4 rounded-xl p-6 bg-colorWhite">
          <img
            className="size-10"
            src={currentUser.image.png}
            alt={`Image ${currentUser.username}`}
          />

          <Textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />

          <div className="space-y-4 flex flex-col">
            <Button>REPLY</Button>

            <button
              className="mx-auto px-2 text-colorSoftRed rounded-xl hover:scale-105"
              onClick={handleCancelReply}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
