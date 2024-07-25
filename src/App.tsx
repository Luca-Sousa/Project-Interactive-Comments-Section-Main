import IconPlus from "./assets/images/icon-plus.svg";
import IconMinus from "./assets/images/icon-minus.svg";
import { Comment, Reply } from "./Types";
import { datas } from "./Datas";
import { useEffect, useState } from "react";
import { Button } from "./components/Button";
import { Textarea } from "./components/Textearea";
// import { CommentsAndReplies } from "./components/CommentsAndReplies";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

export function App() {
  const currentUser = datas.currentUser;
  const [comments, setComments] = useState<Comment[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(
    null
  );
  const [replyingReplyId, setReplyingReplyId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<string>("");
  const [newCommentContent, setNewCommentContent] = useState<string>("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsCollection = collection(db, "comments");
        const querySnapshot = await getDocs(commentsCollection);

        const firebaseComments: Comment[] = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Firebase ID é uma string
          ...(doc.data() as Omit<Comment, "id">),
        }));

        // Formatar IDs como strings
        const formattedFirebaseComments = firebaseComments.map((comment) => ({
          ...comment,
          replies: comment.replies.map((reply) => ({
            ...reply,
            id: reply.id.toString(), // Garantir que ID é uma string
          })),
        }));

        // Combinar dados estáticos com dados do Firebase
        const combinedComments = [
          ...datas.comments.map((comment) => ({
            ...comment,
            id: comment.id.toString(), // Garantir que ID é uma string
            replies: comment.replies.map((reply) => ({
              ...reply,
              id: reply.id.toString(), // Garantir que ID é uma string
            })),
          })),
          ...formattedFirebaseComments,
        ];

        setComments(combinedComments);
      } catch (error) {
        console.error("Error fetching comments: ", error);
      }
    };

    fetchComments();
  }, []);

  const handleCommentEdit = (replyId: string, currentContent: string) => {
    setEditingCommentId(replyId);
    setEditedContent(currentContent);
  };

  const handleReplyEdit = (replyId: string, currentContent: string) => {
    setEditingReplyId(replyId);
    setEditedContent(currentContent);
  };

  const handleReplyToComment = (commentId: string, username: string) => {
    setReplyingCommentId(commentId);
    setReplyingReplyId(null);
    setReplyContent(`@${username}, `);
  };

  const handleReplyToReply = (replyId: string, username: string) => {
    setReplyingReplyId(replyId);
    setReplyingCommentId(null);
    setReplyContent(`@${username}, `);
  };

  const handleCancelReply = () => {
    setReplyingCommentId(null);
    setReplyingReplyId(null);
    setReplyContent("");
  };

  const handleUpdate = async (id: string) => {
    const commentToUpdate = comments.find((comment) =>
      comment.replies.some((reply) => reply.id === id)
    );

    if (commentToUpdate) {
      const updatedReplies = commentToUpdate.replies.map((reply) =>
        reply.id === id ? { ...reply, content: editedContent } : reply
      );

      const updatedComment = {
        ...commentToUpdate,
        replies: updatedReplies,
      };

      const commentDocRef = doc(db, "comments", commentToUpdate.id);
      await updateDoc(commentDocRef, {
        replies: updatedComment.replies,
      });

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentToUpdate.id ? updatedComment : comment
        )
      );
      setEditingReplyId(null);
      setEditingCommentId(null);
      setEditedContent("");
    }
  };

  const handleDelete = async (replyId: string) => {
    const commentToUpdate = comments.find((comment) =>
      comment.replies.some((reply) => reply.id === replyId)
    );

    if (commentToUpdate) {
      const updatedReplies = commentToUpdate.replies.filter(
        (reply) => reply.id !== replyId
      );

      const updatedComment = {
        ...commentToUpdate,
        replies: updatedReplies,
      };

      const commentDocRef = doc(db, "comments", commentToUpdate.id);
      await updateDoc(commentDocRef, {
        replies: updatedComment.replies,
      });

      setComments(
        comments.map((comment) =>
          comment.id === commentToUpdate.id ? updatedComment : comment
        )
      );
    }
  };

  const handleAddComment = async () => {
    if (newCommentContent.trim() === "") return;

    try {
      const newComment: Omit<Comment, "id"> = {
        content: newCommentContent,
        createdAt: new Date().toISOString(),
        score: 0,
        user: currentUser,
        replies: [],
      };

      const commentsCollection = collection(db, "comments");
      const docRef = await addDoc(commentsCollection, newComment);

      setComments([...comments, { id: docRef.id, ...newComment }]);

      setNewCommentContent("");
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  return (
    <div className="w-[760px] mx-auto px-6 py-10 space-y-6">
      {comments.map((comment: Comment) => (
        <div className="space-y-6" key={comment.id}>
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
              <div className="flex gap-2 items-center text-colorDarkBlue font-medium">
                <h2>{comment.user.username}</h2>
                {comment.user.username === currentUser.username && (
                  <p className="text-sm text-colorWhite bg-colorModerateBlue px-1">
                    you
                  </p>
                )}
              </div>

              <p className="text-colorGrayishBlue">{comment.createdAt}</p>
            </div>

            {comment.user.username === currentUser.username ? (
              <div className="flex items-center gap-6">
                <Button
                  variant="tertiary"
                  size="auto"
                  onClick={() => handleDelete(comment.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 12 14"
                    className="size-3"
                  >
                    <path
                      d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z"
                      fill="currentColor"
                    />
                  </svg>
                  Delete
                </Button>

                <Button
                  variant="secondary"
                  size="auto"
                  onClick={() => handleCommentEdit(comment.id, comment.content)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 14 14"
                    className="size-3"
                  >
                    <path
                      d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z"
                      fill="currentColor"
                    />
                  </svg>
                  Edit
                </Button>
              </div>
            ) : (
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
            )}
          </div>

          <div className="text-colorGrayishBlue">
            {editingCommentId === comment.id ? (
              <div className="space-y-2">
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />

                <div className="flex justify-end">
                  <div className="space-x-4">
                    <Button onClick={() => handleUpdate(comment.id)}>
                      UPDATE
                    </Button>

                    <Button
                      variant="tertiary"
                      size="cancel"
                      onClick={() => {
                        setEditingCommentId(null);
                        setEditedContent("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div>{comment.content}</div>
            )}
          </div>
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
                            <div className="flex gap-2 items-center text-colorDarkBlue font-medium">
                              <h2>{reply.user.username}</h2>
                              {reply.user.username === currentUser.username && (
                                <p className="text-sm text-colorWhite bg-colorModerateBlue px-1">
                                  you
                                </p>
                              )}
                            </div>

                            <p className="text-colorGrayishBlue">
                              {reply.createdAt}
                            </p>
                          </div>

                          {reply.user.username === currentUser.username ? (
                            <div className="flex items-center gap-6">
                              <Button
                                variant="tertiary"
                                size="auto"
                                onClick={() => handleDelete(reply.id)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 12 14"
                                  className="size-3"
                                >
                                  <path
                                    d="M1.167 12.448c0 .854.7 1.552 1.555 1.552h6.222c.856 0 1.556-.698 1.556-1.552V3.5H1.167v8.948Zm10.5-11.281H8.75L7.773 0h-3.88l-.976 1.167H0v1.166h11.667V1.167Z"
                                    fill="currentColor"
                                  />
                                </svg>
                                Delete
                              </Button>

                              <Button
                                variant="secondary"
                                size="auto"
                                onClick={() =>
                                  handleReplyEdit(reply.id, reply.content)
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 14 14"
                                  className="size-3"
                                >
                                  <path
                                    d="M13.479 2.872 11.08.474a1.75 1.75 0 0 0-2.327-.06L.879 8.287a1.75 1.75 0 0 0-.5 1.06l-.375 3.648a.875.875 0 0 0 .875.954h.078l3.65-.333c.399-.04.773-.216 1.058-.499l7.875-7.875a1.68 1.68 0 0 0-.061-2.371Zm-2.975 2.923L8.159 3.449 9.865 1.7l2.389 2.39-1.75 1.706Z"
                                    fill="currentColor"
                                  />
                                </svg>
                                Edit
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="secondary"
                              size="auto"
                              onClick={() =>
                                handleReplyToReply(
                                  reply.id,
                                  reply.user.username
                                )
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

                                  <Button
                                    variant="tertiary"
                                    size="cancel"
                                    onClick={() => {
                                      setEditingReplyId(null);
                                      setEditedContent("");
                                    }}
                                  >
                                    Cancel
                                  </Button>
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
        <Textarea
          onChange={(e) => setNewCommentContent(e.target.value)}
          placeholder="Add a comment..."
        />

        <Button onClick={handleAddComment}>SEND</Button>
      </div>
    </div>
  );
}
