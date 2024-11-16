import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { Conversation } from '@/types';
import { setActiveConversation, getConversationMessages } from '@/redux/chatSlice';

export function useConversation(conversationId: string | undefined) {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const conversations = useSelector((state: RootState) => state.chat.conversations);
  const activeConversation = useSelector((state: RootState) => state.chat.activeConversation);

  // Find conversation from cache first
  const conversation = conversationId 
    ? conversations.find(c => c.id === conversationId) 
    : null;

  useEffect(() => {
    async function loadConversation() {
      if (!conversationId) return;

      try {
        setIsLoading(true);
        setError(null);

        // If we have the conversation in cache, set it as active immediately
        if (conversation) {
          dispatch(setActiveConversation(conversation));
        }

        // Fetch messages in background
        await dispatch(getConversationMessages(conversationId)).unwrap();
      } catch (err: any) {
        setError(err.message || 'Failed to load conversation');
      } finally {
        setIsLoading(false);
      }
    }

    loadConversation();
  }, [conversationId, dispatch, conversation]);

  return {
    conversation: activeConversation || conversation,
    isLoading,
    error
  };
}