import React, { useState, useEffect } from 'react';
import Suggestions from '@/components/newsfeeds/Suggestions';
import { useTheme } from '@/contexts/ThemeContext';
import Sidebar from '../components/newsfeeds/Sidebar';
import PostForm from '../components/newsfeeds/PostForm';
import NewsFeeds from '@/components/newsfeeds/NewsFeeds';
import { http } from '@/api/http';


export default function NewsFeedsPage() {
  const { currentTheme } = useTheme();
  const [posts, setPosts] = useState<any[]>([]);
  const [refreshPosts, setRefreshPosts] = useState(false); 


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await http.get('/posts?page=1&limit=10&sortBy=createdAt&order=desc');
        setPosts(response.data.results);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [refreshPosts]); 


  const handlePostCreated = () => {
    setRefreshPosts((prev) => !prev); 
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>
      <div className="max-w-full mx-auto flex">
        <div className="w-[250px] flex-shrink-0">
          <Sidebar />
        </div>

        <div className="flex justify-between max-w-[1280px] pt-10">
          <div className="flex-1 w-[600px] mx-28">
            <PostForm onNewPost={handlePostCreated} />
            <div className="w-[470px] mx-auto">
              <NewsFeeds refreshPosts={refreshPosts} />
            </div>
          </div>
          <div className="w-[320px] hidden lg:block sticky top-24">
            <Suggestions />
          </div>
        </div>
      </div>
    </div>
  );
}
