export const mockUser = {
  id: "1",
  username: "johndoe",
  fullName: "John Doe",
  avatar:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
};

export const mockStories = [
  {
    id: "1",
    username: "emily_wilson",
    userAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    hasViewed: false,
  },
  {
    id: "2",
    username: "michael.scott",
    userAvatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop",
    hasViewed: false,
  },
  {
    id: "3",
    username: "sarah.parker",
    userAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    hasViewed: true,
  },
  // Add more stories as needed
];

export const mockPosts = [
  {
    id: "1",
    username: "emily_wilson",
    userAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    location: "Paris, France",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1000&h=1000&fit=crop",
    caption: "Evening in Paris 🗼✨ #ParisLife #EiffelTower",
    likes: 1234,
    hasMultiple: true,
    comments: [
      {
        id: "1",
        username: "michael.scott",
        content: "Beautiful view! 😍",
        timestamp: "2024-02-20T10:00:00Z",
      },
    ],
    timestamp: "2024-02-20T09:00:00Z",
  },
  {
    id: "2",
    username: "michael.scott",
    userAvatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop",
    location: "New York City",
    image:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1000&h=1000&fit=crop",
    caption: "City that never sleeps 🌃 #NYC #CityLife",
    likes: 2345,
    hasMultiple: false,
    comments: [],
    timestamp: "2024-02-20T08:00:00Z",
  },
  // Add more posts as needed
];

export const mockSuggestions = [
  {
    id: "1",
    username: "alex.smith",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop",
    reason: "Followed by emily_wilson + 8 more",
  },
  {
    id: "2",
    username: "lisa.jones",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
    reason: "New to Instagram",
  },
  {
    id: "3",
    username: "mark.wilson",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    reason: "Followed by michael.scott + 3 more",
  },
  {
    id: "4",
    username: "sarah.parker",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    reason: "Suggested for you",
  },
  {
    id: "5",
    username: "david.brown",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    reason: "Followed by alex.smith + 2 more",
  },
];


export const mockPostsWithReactions = [
  {
    id: '1',
    username: 'emily_wilson',
    userAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    location: 'Paris, France',
    image:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1000&h=1000&fit=crop',
    caption: 'Evening in Paris 🗼✨ #ParisLife #EiffelTower',
    reactions: {
      like: 800,
      love: 300,
      haha: 50,
      wow: 20,
      sad: 10,
      angry: 5,
    },
    hasMultiple: true,
    comments: [
      {
        id: '1',
        username: 'michael.scott',
        content: 'Beautiful view! 😍',
        timestamp: '2024-02-20T10:00:00Z',
      },
      {
        id: '2',
        username: 'pam.beesly',
        content: 'I want to visit Paris someday! 🗼',
        timestamp: '2024-02-20T11:00:00Z',
      },
    ],
    timestamp: '2024-02-20T09:00:00Z',
  },
  {
    id: '2',
    username: 'michael.scott',
    userAvatar:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop',
    location: 'New York City',
    image:
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1000&h=1000&fit=crop',
    caption: 'City that never sleeps 🌃 #NYC #CityLife',
    reactions: {
      like: 1000,
      love: 1500,
      haha: 80,
      wow: 40,
      sad: 15,
      angry: 2,
    },
    hasMultiple: false,
    comments: [
      {
        id: '1',
        username: 'dwight.schrute',
        content: 'NYC is amazing, but the beet farm is better 🚜',
        timestamp: '2024-02-20T09:30:00Z',
      },
    ],
    timestamp: '2024-02-20T08:00:00Z',
  },
  {
    id: '3',
    username: 'pam.beesly',
    userAvatar:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop',
    location: 'Venice, Italy',
    image:
      'https://images.unsplash.com/photo-1549893074-44b08cc8b88c?w=1000&h=1000&fit=crop',
    caption: 'Canals and sunsets 🌅✨ #VeniceItaly #TravelDream',
    reactions: {
      like: 1200,
      love: 600,
      haha: 100,
      wow: 75,
      sad: 20,
      angry: 10,
    },
    hasMultiple: false,
    comments: [
      {
        id: '1',
        username: 'jim.halpert',
        content: 'Looks like a painting 🎨',
        timestamp: '2024-02-20T10:15:00Z',
      },
      {
        id: '2',
        username: 'kevin.malone',
        content: 'I hope you brought pizza 🍕',
        timestamp: '2024-02-20T11:00:00Z',
      },
    ],
    timestamp: '2024-02-20T07:00:00Z',
  },
];
