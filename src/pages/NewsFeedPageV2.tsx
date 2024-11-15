import React from 'react';
//import Header from '@/components/newsfeed/Header';
import Stories from '@/components/newsfeed/Stories';
import PostList from '@/components/newsfeed/PostList';
// import Suggestions from '@/components/newsfeed/Suggestions';
import { useTheme } from '@/contexts/ThemeContext';
import Sidebar from '@/components/newsfeed-v2/Sidebar';

export default function NewsFeedPageV2() {
  const { currentTheme } = useTheme();

  return (
    <>
      <Sidebar />
      <div className={`min-h-screen ${currentTheme.bg} pt-20`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1 max-w-[630px]">
              {/* <Stories />
              <PostList /> */}
            </div>

            {/* Sidebar */}
            <div className="w-[320px] hidden lg:block sticky top-24">
              {/* <Suggestions /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
