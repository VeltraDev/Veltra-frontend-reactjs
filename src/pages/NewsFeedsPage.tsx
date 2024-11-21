import React from 'react';
import Suggestions from '@/components/newsfeeds/Suggestions';
import { useTheme } from '@/contexts/ThemeContext';
import Sidebar from '../components/newsfeeds/Sidebar';
import PostForm from '../components/newsfeeds/PostForm';
import NewsFeeds from '@/components/newsfeeds/NewsFeeds';

export default function NewsFeedsPage() {
  const { currentTheme } = useTheme();

  return (
    <>
      <div className={`min-h-screen ${currentTheme.bg} `}>
        <div className="max-w-full mx-auto flex ">
          <div className="w-[250px] flex-shrink-0">
            <Sidebar />
          </div>

          <div className="flex justify-between max-w-[1280px] pt-10">
            <div className="flex-1 w-[600px] mx-28">
              <PostForm />
              <div className=" w-[470px] mx-auto ">
                <NewsFeeds />
              </div>
            </div>
            <div className="w-[320px] hidden lg:block sticky top-24">
              <Suggestions />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
