import IconPlus from "/src/assets/images/icon-plus.svg";
import IconMinus from "/src/assets/images/icon-minus.svg";
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

            <Button
              variant="secondary"
              size="auto"
              onClick={() =>
                handleReplyToComment(comment.id, comment.user.username)
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 14 13"
                className="size-4"
              >
                <path
                  d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z"
                  fill="currentColor"
                />
              </svg>
              Reply
            </Button>
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

            <Button
              variant="tertiary"
              size="cancel"
              onClick={handleCancelReply}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
