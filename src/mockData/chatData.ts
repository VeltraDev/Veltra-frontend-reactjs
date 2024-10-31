import { v4 as uuidv4 } from 'uuid';

export interface Message {
  senderAvatar: string | undefined;
  id: string;
  sender: 'self' | 'other';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  messages: Message[];
  lastActivity: Date;
}

export const mockConversations: Conversation[] = [
  {
    id: '1',
    user: {
      id: '101',
      name: 'young.clement',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    messages: [
      {
        id: uuidv4(),
        sender: 'other',
        content: 'Hey, how are you doing?',
        timestamp: new Date('2024-03-10T12:00:00')
      },
      {
        id: uuidv4(),
        sender: 'self',
        content: "I'm good, thanks! How about you?",
        timestamp: new Date('2024-03-10T12:05:00')
      },
      {
        id: uuidv4(),
        sender: 'other',
        content: "I'm doing great! Just finished a big project at work.",
        timestamp: new Date('2024-03-10T12:10:00')
        },
      {
        id: uuidv4(),
        sender: 'other',
        content: "I'm doing great! Just finished a big project at work.",
        timestamp: new Date('2024-03-10T12:10:00')
        },
       {
        id: uuidv4(),
        sender: 'other',
        content: "I'm doing great! Just finished a big project at wzzzzzzzzzzzzzzzzzzzzzork.",
        timestamp: new Date('2024-03-10T12:10:00')
      },
       
      
    
    
      
    ],
    lastActivity: new Date('2024-03-10T12:10:00')
  },
  {
    id: '2',
    user: {
      id: '102',
      name: 'sarah.johnson',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg'
    },
    messages: [
      {
        id: uuidv4(),
        sender: 'other',
        content: "Hey, how's it going?",
        timestamp: new Date('2024-03-09T15:30:00')
      },
        {
        id: uuidv4(),
        sender: 'other',
        content: "Hey, how's it going?",
        timestamp: new Date('2024-03-09T15:30:00')
      },
        {
        id: uuidv4(),
        sender: 'other',
        content: "Hey, how's it going?",
        timestamp: new Date('2024-03-09T15:30:00')
      },
        {
        id: uuidv4(),
        sender: 'other',
        content: "Hey, how's it going?",
        timestamp: new Date('2024-03-09T15:30:00')
      },
        {
        id: uuidv4(),
        sender: 'other',
        content: "Hey, how's it going?",
        timestamp: new Date('2024-03-09T15:30:00')
      },
        {
        id: uuidv4(),
        sender: 'other',
        content: "Hey, how's it going?",
        timestamp: new Date('2024-03-09T15:30:00')
      },
        {
        id: uuidv4(),
        sender: 'other',
        content: "Hey, how's it going?",
        timestamp: new Date('2024-03-09T15:30:00')
      },
        {
        id: uuidv4(),
        sender: 'other',
        content: "Hey, how's it going?",
        timestamp: new Date('2024-03-09T15:30:00')
      },
        {
        id: uuidv4(),
        sender: 'other',
        content: "Hey, how's it going?",
        timestamp: new Date('2024-03-09T15:30:00')
      },
        {
        id: uuidv4(),
        sender: 'other',
        content: "Hey, how's it going?",
        timestamp: new Date('2024-03-09T15:30:00')
      },
        {
        id: uuidv4(),
        sender: 'other',
        content: "Hey, how's it going?",
        timestamp: new Date('2024-03-09T15:30:00')
      },
        {
        id: uuidv4(),
        sender: 'other',
        content: "Hey, how's it going?",
        timestamp: new Date('2024-03-09T15:30:00')
      },
        {
        id: uuidv4(),
        sender: 'other',
        content: "Hey, how's it going?",
        timestamp: new Date('2024-03-09T15:30:00')
      },
        {
        id: uuidv4(),
        sender: 'other',
        content: "Hey, how's it going?",
        timestamp: new Date('2024-03-09T15:30:00')
      },
        {
        id: uuidv4(),
        sender: 'other',
        content: "Hey, how's it going?",
        timestamp: new Date('2024-03-09T15:30:00')
      },
      {
        id: uuidv4(),
        sender: 'self',
        content: 'Not bad, just working on a project. You?',
        timestamp: new Date('2024-03-09T15:35:00')
        },
      
      {
        id: uuidv4(),
        sender: 'other',
        content: 'Same here. Want to grab coffee later?',
        timestamp: new Date('2024-03-09T15:40:00')
        },
       
      {
        id: uuidv4(),
        sender: 'other',
        content: 'Same here. Want to grab coffee laterz?',
        timestamp: new Date('2024-03-09T15:50:00')
      },
       
      {
        id: uuidv4(),
        sender: 'other',
        content: 'duc map',
        timestamp: new Date('2024-03-09T15:50:00')
      }
    ],
    lastActivity: new Date('2024-03-09T15:40:00')
  },
  {
    id: '3',
    user: {
      id: '103',
      name: 'alex.wong',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg'
    },
    messages: [
      {
        id: uuidv4(),
        sender: 'self',
        content: 'Did you see the latest tech news?',
        timestamp: new Date('2024-03-08T09:00:00')
      },
      {
        id: uuidv4(),
        sender: 'other',
        content: 'No, what happened?',
        timestamp: new Date('2024-03-08T09:05:00')
      },
      {
        id: uuidv4(),
        sender: 'self',
        content: 'A new AI model was released that can generate entire movies!',
        timestamp: new Date('2024-03-08T09:10:00')
      }
    ],
    lastActivity: new Date('2024-03-08T09:10:00')
  },
  {
    id: '4',
    user: {
      id: '104',
      name: 'emma.taylor',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
    },
    messages: [
      {
        id: uuidv4(),
        sender: 'other',
        content: 'Are we still on for the team meeting tomorrow?',
        timestamp: new Date('2024-03-07T14:00:00')
      },
      {
        id: uuidv4(),
        sender: 'self',
        content: 'Yes, 10 AM as usual. Ill prepare the slides.',
        timestamp: new Date('2024-03-07T14:05:00')
      },
      {
        id: uuidv4(),
        sender: 'other',
        content: 'Great, thanks! See you then.',
        timestamp: new Date('2024-03-07T14:10:00')
      }
    ],
    lastActivity: new Date('2024-03-07T14:10:00')
  },
  {
    id: '5',
    user: {
      id: '105',
      name: 'david.miller',
      avatar: 'https://randomuser.me/api/portraits/men/46.jpg'
    },
    messages: [
      {
        id: uuidv4(),
        sender: 'self',
        content: 'Hey David, can you review my pull request when you have a moment?',
        timestamp: new Date('2024-03-06T11:00:00')
      },
      {
        id: uuidv4(),
        sender: 'other',
        content: 'Sure thing! Ill take a look after lunch.',
        timestamp: new Date('2024-03-06T11:05:00')
      },
      {
        id: uuidv4(),
        sender: 'self',
        content: 'Thanks, appreciate it!',
        timestamp: new Date('2024-03-06T11:10:00')
      }
    ],
    lastActivity: new Date('2024-03-06T11:10:00')
  }
];