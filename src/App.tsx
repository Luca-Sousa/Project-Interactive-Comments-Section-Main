import { Comment } from "./Types";
import { datas } from "./Datas";
import { useEffect, useState } from "react";
import { Button } from "./components/Button";
import { Textarea } from "./components/Textearea";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { CommentList } from "./components/CommentList";

export function App() {
  const currentUser = datas.currentUser;
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentContent, setNewCommentContent] = useState<string>("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsCollection = collection(db, "comments");
        const querySnapshot = await getDocs(commentsCollection);

        const firebaseComments: Comment[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Comment, "id">),
        }));

        // Verifica se replies é um array e formata IDs
        const formattedFirebaseComments = firebaseComments.map((comment) => ({
          ...comment,
          replies: Array.isArray(comment.replies)
            ? comment.replies.map((reply) => ({
                ...reply,
                id: reply.id.toString(),
              }))
            : [], // Se replies não for um array, usa um array vazio
        }));

        // Combina dados estáticos com dados do Firebase
        const combinedComments = [
          ...datas.comments.map((comment) => ({
            ...comment,
            id: comment.id.toString(),
            replies: Array.isArray(comment.replies)
              ? comment.replies.map((reply) => ({
                  ...reply,
                  id: reply.id.toString(),
                }))
              : [],
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

  const handleReply = async (id: string, username: string) => {
    const content = prompt(`Reply to ${username}:`);
    if (content) {
      const newReply = {
        id: Math.random().toString(),
        content,
        createdAt: new Date().toLocaleString(),
        score: 0,
        replyingTo: username,
        user: currentUser,
      };

      const commentDocRef = doc(db, "comments", id);
      await updateDoc(commentDocRef, {
        replies: Array.isArray(comments.find((comment) => comment.id === id)?.replies)
          ? [
              ...comments.find((comment) => comment.id === id)!.replies,
              newReply,
            ]
          : [newReply],
      });

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === id
            ? {
                ...comment,
                replies: Array.isArray(comment.replies)
                  ? [...comment.replies, newReply]
                  : [newReply],
              }
            : comment
        )
      );
    }
  };

  const handleEdit = async (id: string, content: string, isReply: boolean) => {
    if (isReply) {
      setComments((prevComments) =>
        prevComments.map((comment) => ({
          ...comment,
          replies: Array.isArray(comment.replies)
            ? comment.replies.map((reply) =>
                reply.id === id ? { ...reply, content } : reply
              )
            : comment.replies,
        }))
      );
    } else {
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === id ? { ...comment, content } : comment
        )
      );
    }
  };

  const handleDelete = async (id: string) => {
    const commentDocRef = doc(db, "comments", id);
    await deleteDoc(commentDocRef);

    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== id)
    );
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
      <CommentList
        comments={comments}
        currentUser={currentUser}
        onReply={handleReply}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <div className="flex flex-1 items-start gap-4 rounded-xl p-6 bg-colorWhite">
        <img
          className="size-10"
          src={currentUser.image.png}
          alt={`Image ${currentUser.username}`}
        />
        <Textarea
          onChange={(e) => setNewCommentContent(e.target.value)}
          placeholder="Add a comment..."
          value={newCommentContent}
        />

        <Button onClick={handleAddComment}>SEND</Button>
      </div>
    </div>
  );
}
