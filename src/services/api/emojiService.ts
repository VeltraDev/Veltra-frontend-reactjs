import axios from 'axios';

const API_KEY = '0411896bed8e7389724d1d285b479863d11e3fdb';
const BASE_URL = 'https://emoji-api.com';

interface EmojiCategory {
  slug: string;
  name: string;
  emoji: Emoji[];
}

interface Emoji {
  slug: string;
  character: string;
  unicodeName: string;
  codePoint: string;
  group: string;
  subGroup: string;
}

export const emojiService = {
  getCategories: async (): Promise<EmojiCategory[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/categories?access_key=${API_KEY}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch emoji categories:', error);
      return [];
    }
  },

  getEmojis: async (category?: string): Promise<Emoji[]> => {
    try {
      const url = category 
        ? `${BASE_URL}/categories/${category}?access_key=${API_KEY}`
        : `${BASE_URL}/emojis?access_key=${API_KEY}`;
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch emojis:', error);
      return [];
    }
  },

  search: async (query: string): Promise<Emoji[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/emojis?search=${query}&access_key=${API_KEY}`);
      return response.data;
    } catch (error) {
      console.error('Failed to search emojis:', error);
      return [];
    }
  }
};