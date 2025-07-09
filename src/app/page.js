
"use client";
import React, { useState } from 'react';
import VideoPanel from '@/components/VideoPanel';
import PPTSection from '@/components/PPTSection';
import QuestionPanel from '@/components/QuestionPanel';

const transcript = [
  { time: 0.01, text: "Welcome to today's training session.",img: "https://images.unsplash.com/photo-1571025707260-46884124bdee?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHB0fGVufDB8fDB8fHww" },
  { time: 100, text: "We'll be covering three main topics.", img: "https://media.istockphoto.com/id/1448628255/photo/presentation-business-people-and-meeting-with-woman-speaker-screen-with-ppt-of-revenue-stats.webp?a=1&b=1&s=612x612&w=0&k=20&c=wJRr2rqKEEKXd5x1r2ahgeGlXKWazXTcRvVKivsEkPA=" },
  { time: 150, text: "First, let's look at the market trends." },
  { time: 200, text: "As you can see on this chart..." },
  { time: 250, text: "The second topic is about our new product." },
  { time: 300, text: "Here are the key features we've added." },
  { time: 310, text: "Finally, we'll discuss implementation." },
  { time: 390, text: "Any questions so far?" },
]

const Home = () => {
  const [isQuestionMode, setIsQuestionMode] = useState(false);

  const handleAskQuestion = () => {
    setIsQuestionMode(true);
  };

  const handleCloseQuestion = () => {
    setIsQuestionMode(false);
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 p-6 overflow-hidden">
          {!isQuestionMode ? (
            <div className="flex w-full h-full gap-6">
              <VideoPanel transcript={transcript}/>
              <PPTSection onAskQuestion={handleAskQuestion} currentImage={transcript[0].img} />
            </div>
          ) : (
            <div className="flex w-full h-full gap-6 transition-all duration-300">
              <div className="flex flex-col w-[70%] h-full">
                <div className="p-4 bg-white rounded-xl border border-gray-200 h-[calc(100vh-120px)] min-h-[500px] transition-all duration-300">
                  <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-lg overflow-hidden">
                    <div className="text-center p-4">
                      <div className="text-2xl font-bold mb-2">PowerPoint Slide (Zoomed Out)</div>
                      <div className="text-gray-600">You can see more of the slide now in this expanded view</div>
                    </div>
                  </div>
                </div>
              </div>
              <QuestionPanel onClose={handleCloseQuestion} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;