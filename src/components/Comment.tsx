import IconPlus from "/src/assets/images/icon-plus.svg";
import IconMinus from "/src/assets/images/icon-minus.svg";
import { Comment as CommentType, Reply } from "../Types";
import { Textarea } from "./Textearea";
import { Button } from "./Button";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { datas } from "../Datas";

interface CommentProps {
  comment: CommentType | Reply;
  currentUser: typeof datas.currentUser;
  onReply: (id: string, username: string) => void;
  onEdit: (id: string, content: string, isReply: boolean) => void;
  onDelete: (id: string) => void;
  isReply?: boolean;
}

export function Comment({
  comment,
  currentUser,
  onReply,
  onEdit,
  onDelete,
  isReply = false,
}: CommentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const handleUpdate = async () => {
    onEdit(comment.id, editedContent, isReply);
    setIsEditing(false);
  };

  const handleSubmitReply = async () => {
    if (replyContent.trim() === "") return; // Não envia se o conteúdo estiver vazio

    // Adiciona a nova resposta ao Firestore
    await addDoc(collection(db, "comments"), {
      content: replyContent,
      createdAt: new Date().toISOString(),
      score: 0,
      user: currentUser,
      replyingTo: comment.user.username,
      parentId: comment.id,
    });

    setReplyContent(""); // Limpa o conteúdo após o envio
    setIsReplying(false); // Oculta a área de resposta
  };

  const handleCancelReply = () => {
    setReplyContent(""); // Limpa o conteúdo
    setIsReplying(false); // Oculta a área de resposta
  };

  return (
    <div className="flex gap-4 rounded-xl p-6 bg-colorWhite">
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
                onClick={() => onDelete(comment.id)}
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
                onClick={() => setIsEditing(true)}
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
              onClick={() => setIsReplying(true)}
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
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />

              <div className="flex justify-end">
                <div className="space-x-4">
                  <Button onClick={handleUpdate}>UPDATE</Button>

                  <Button
                    variant="tertiary"
                    size="cancel"
                    onClick={() => {
                      setIsEditing(false);
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

          {isReplying && (
            <div className="flex flex-1 items-start gap-4 rounded-xl p-6 bg-colorWhite">
              <img
                className="size-10"
                src={currentUser.image.png}
                alt={`Image ${currentUser.username}`}
              />
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Add a reply..."
              />
              <div className="space-y-4 flex flex-col">
                <Button
                  onClick={handleSubmitReply}
                >
                  REPLY
                </Button>
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
      </div>
    </div>
  );
}
