import IconPlus from "./assets/images/icon-plus.svg";
import IconMinus from "./assets/images/icon-minus.svg";
import IconReply from "./assets/images/icon-reply.svg";
import IconDelete from "./assets/images/icon-delete.svg";
import IconEdit from "./assets/images/icon-edit.svg";

import { datas } from "./Datas";
import { useEffect, useState } from "react";

interface User {
  image: {
    png: string;
    webp: string;
  };
  username: string;
}

interface Reply {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  replyingTo: string;
  user: User;
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  user: User;
  replies: Reply[];
}

interface Data {
  currentUser: User;
  comments: Comment[];
}

export function App() {
  const currentUser = datas.currentUser;
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const storedComments = localStorage.getItem("comments");
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    } else {
      setComments(datas.comments);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(comments));
  }, [comments]);

  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  const [replyingCommentId, setReplyingCommentId] = useState<number | null>(
    null
  );
  const [replyingReplyId, setReplyingReplyId] = useState<number | null>(null);

  const handleEdit = (replyId: number, currentContent: string) => {
    setEditingReplyId(replyId);
    setEditedContent(currentContent);
  };

  const handleReplyToComment = (commentId: number) => {
    setReplyingCommentId(commentId);
    setReplyingReplyId(null);
  };

  const handleReplyToReply = (replyId: number) => {
    setReplyingReplyId(replyId);
    setReplyingCommentId(null);
  };

  const handleUpdate = (replyId: number) => {
    const updatedComments = comments.map((comment) => ({
      ...comment,
      replies: comment.replies.map((reply) => {
        if (reply.id === replyId) {
          return { ...reply, content: editedContent };
        }
        return reply;
      }),
    }));
    setComments(updatedComments);
    setEditingReplyId(null);
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
          <div
            key={comment.id}
            className="flex gap-4 rounded-xl p-6 bg-colorWhite"
          >
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
                  onClick={() => handleReplyToComment(comment.id)}
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
              <textarea
                className="w-full h-24 p-4 focus:outline outline-colorDarkBlue resize-none rounded-lg border border-colorLightGray"
                name=""
                id=""
                value={`@${comment.user.username},`}
              ></textarea>
              <button className="w-28 py-3 text-colorWhite bg-colorModerateBlue rounded-xl hover:bg-colorLightGrayishBlue">
                REPLY
              </button>
            </div>
          )}

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
                              onClick={() => handleReplyToReply(reply.id)}
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
                              <textarea
                                className="w-full h-24 p-4 focus:outline outline-colorDarkBlue resize-none rounded-lg border border-colorLightGray"
                                value={editedContent}
                                onChange={(e) =>
                                  setEditedContent(e.target.value)
                                }
                              ></textarea>
                              <div className="flex justify-end">
                                <button
                                  className="w-28 py-2 px-4 bg-colorModerateBlue text-colorWhite rounded-lg hover:bg-colorLightGrayishBlue"
                                  onClick={() => handleUpdate(reply.id)}
                                >
                                  UPDATE
                                </button>
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
                          <textarea
                            className="w-full h-24 p-4 focus:outline outline-colorDarkBlue resize-none rounded-lg border border-colorLightGray"
                            name=""
                            id=""
                            value={`@${reply.user.username},`}
                          ></textarea>
                          <button className="w-24 py-3 text-colorWhite bg-colorModerateBlue rounded-xl hover:bg-colorLightGrayishBlue">
                            REPLY
                          </button>
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
        <textarea
          className="flex-1 h-24 p-4 outline-none resize-none rounded-lg border border-colorLightGray"
          name=""
          id=""
          placeholder="Add a comment..."
        ></textarea>
        <button className="w-28 py-3 text-colorWhite bg-colorModerateBlue rounded-xl hover:bg-colorLightGrayishBlue">
          SEND
        </button>
      </div>
    </div>
  );
}
