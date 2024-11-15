export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  displayStatus: string | null;
  createdAt: string;
  role?: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
  };
}

export interface Message {
  id: string;
  content: string;
  sender: User;
  conversationId: string;
  createdAt: string;
  updatedAt: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  files?: Array<{
    url: string;
    type: 'image' | 'document';
  }>;
  reactions?: Array<{
    emoji: string;
    count: number;
    users: string[];
  }>;
  replies?: Message[];
}

export interface Conversation {
  id: string;
  name: string;
  picture: string | null;
  isGroup: boolean;
  admin?: User;
  users: User[];
  latestMessage?: Message;
  createdAt: string;
  updatedAt: string;
}