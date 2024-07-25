export interface User {
  username: string;
  image: {
    png: string;
    webp: string;
  };
}

export interface Reply {
  id: string; // Mantém id como string
  content: string;
  createdAt: string;
  score: number;
  user: User;
  replyingTo: string;
}

export interface Comment {
  id: string; // Altera id para string
  content: string;
  createdAt: string;
  score: number;
  user: User;
  replies: Reply[];
}
