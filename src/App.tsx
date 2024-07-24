import IconPlus from "./assets/images/icon-plus.svg";
import IconMinus from "./assets/images/icon-minus.svg";
import IconReply from "./assets/images/icon-reply.svg";
import IconDelete from "./assets/images/icon-delete.svg";
import IconEdit from "./assets/images/icon-edit.svg";
import { Comment, Reply } from "./Types";
import { datas } from "./Datas";
import { useEffect, useState } from "react";
import { Button } from "./components/Button";
import { Textarea } from "./components/Textearea";
import { CommentsAndReplies } from "./components/CommentsAndReplies";

export function App() {
  const currentUser = datas.currentUser;
  const [comments, setComments] = useState<Comment[]>([]);
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  const [replyingCommentId, setReplyingCommentId] = useState<number | null>(
    null
  );
  const [replyingReplyId, setReplyingReplyId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState<string>("");

  useEffect(() => {
    const storedComments = localStorage.getItem("comments");
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    } else {
      setComments(datas.comments);
    }
  }, []);

  const handleEdit = (replyId: number, currentContent: string) => {
    setEditingReplyId(replyId);
    setEditedContent(currentContent);
  };

  const handleReplyToComment = (commentId: number, username: string) => {
    setReplyingCommentId(commentId);
    setReplyingReplyId(null);
    setReplyContent(`@${username}, `);
  };

  const handleReplyToReply = (replyId: number, username: string) => {
    setReplyingReplyId(replyId);
    setReplyingCommentId(null);
    setReplyContent(`@${username}, `);
  };

  const handleCancelReply = () => {
    setReplyingCommentId(null);
    setReplyingReplyId(null);
    setReplyContent("");
  };

  const handleUpdate = (replyId: number) => {
    const updatedComments = comments.map((comment) => ({
      ...comment,
      replies: comment.replies.map((reply) =>
        reply.id === replyId ? { ...reply, content: editedContent } : reply
      ),
    }));

    setComments(updatedComments);
    localStorage.setItem("comments", JSON.stringify(updatedComments));
    setEditingReplyId(null);
    setEditedContent("");
  };

  const handleDelete = (replyId: number) => {
    const updatedComments = comments.map((comment) => ({
      ...comment,
      replies: comment.replies.filter((reply) => reply.id !== replyId),
    }));
    setComments(updatedComments);
  };

  return (
    <div className="w-[760px] mx-auto px-6 py-10 space-y-6">
      {datas.comments.map((comment: Comment) => (
        <div className="space-y-6">
          <CommentsAndReplies
            comment={comment}
            replyingCommentId={replyingCommentId}
            replyContent={replyContent}
            currentUser={currentUser}
            handleReplyToComment={handleReplyToComment}
            setReplyContent={setReplyContent}
            handleCancelReply={handleCancelReply}
          />

          {comment.replies.length > 0 && (
            <div className="flex">
              <div className="w-44">
                <div className="w-1 rounded-lg h-full mx-auto bg-colorLightGrayishBlue"></div>
              </div>
              <div className="space-y-6">
                {comment.replies.map((reply: Reply) => (
                  <div
                    key={reply.id}
                    className="flex flex-col flex-1 gap-2 rounded-xl"
                  >
                    <div className="flex flex-1 gap-4 rounded-xl p-6 bg-colorWhite">
                      <div className="w-10 h-fit flex flex-col items-center justify-center p-4 bg-colorLightGray rounded-xl gap-4">
                        <button>
                          <img src={IconPlus} alt="Icon Plus" />
                        </button>
                        <div className="font-medium text-colorModerateBlue">
                          {reply.score}
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
                              src={reply.user.image.png}
                              alt={`Image User: ${reply.user.username}`}
                            />
                            <h2 className="flex gap-2 items-center text-colorDarkBlue font-medium">
                              {reply.user.username}
                              {reply.user.username === currentUser.username && (
                                <p className="text-sm text-colorWhite bg-colorModerateBlue px-1">
                                  you
                                </p>
                              )}
                            </h2>

                            <p className="text-colorGrayishBlue">
                              {reply.createdAt}
                            </p>
                          </div>

                          {reply.user.username === currentUser.username ? (
                            <div className="flex gap-6 items-center">
                              <button
                                className="flex items-center gap-2 text-colorSoftRed font-bold"
                                onClick={() => handleDelete(reply.id)}
                              >
                                <img src={IconDelete} alt="Delete Reply" />
                                Delete
                              </button>

                              <button
                                onClick={() =>
                                  handleEdit(reply.id, reply.content)
                                }
                                className="flex items-center gap-2 text-colorModerateBlue font-bold"
                              >
                                <img src={IconEdit} alt="Edit Reply" />
                                Edit
                              </button>
                            </div>
                          ) : (
                            <button
                              className="flex items-center gap-2 text-colorModerateBlue font-bold"
                              onClick={() =>
                                handleReplyToReply(
                                  reply.id,
                                  reply.user.username
                                )
                              }
                            >
                              <img
                                className="size-4"
                                src={IconReply}
                                alt="Icon Reply"
                              />
                              Reply
                            </button>
                          )}
                        </div>

                        <div className="text-colorGrayishBlue">
                          {editingReplyId === reply.id ? (
                            <div className="space-y-2">
                              <Textarea
                                value={editedContent}
                                onChange={(e) =>
                                  setEditedContent(e.target.value)
                                }
                              />

                              <div className="flex justify-end">
                                <div className="space-x-4">
                                  <Button
                                    onClick={() => handleUpdate(reply.id)}
                                  >
                                    UPDATE
                                  </Button>

                                  <button
                                    className="mx-auto px-2 text-colorSoftRed rounded-xl hover:scale-105"
                                    onClick={() => {
                                      setEditingReplyId(null);
                                      setEditedContent("");
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <span className="text-colorModerateBlue font-bold">
                                @{reply.replyingTo}{" "}
                              </span>
                              {reply.content}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {replyingReplyId === reply.id &&
                      reply.user.username !== currentUser.username && (
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
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="flex flex-1 items-start gap-4 rounded-xl p-6 bg-colorWhite">
        <img
          className="size-10"
          src={currentUser.image.png}
          alt={`Image ${currentUser.username}`}
        />
        <Textarea placeholder="Add a comment..." />

        <Button>SEND</Button>
      </div>
    </div>
  );
}
