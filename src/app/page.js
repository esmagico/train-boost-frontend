"use client";
import React, { useState } from "react";
import VideoPanel from "@/components/VideoPanel";
import PPTSection from "@/components/PPTSection";
import QuestionPanel from "@/components/QuestionPanel";
import { useSelector } from "react-redux";
import { useGetAllVideoQuery } from "@/store/api/questionsApi";

const Home = () => {
  const isQuestionMode = useSelector((state) => state.video.isQuestionMode);
  const { data, isLoading, isError } = useGetAllVideoQuery();
  const videos = data?.data;

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 p-6 overflow-hidden">
          {!isQuestionMode ? (
            <div className="flex w-full h-full gap-6">
              <VideoPanel videos={videos} loading={isLoading}/>
              <PPTSection loading={isLoading} presentationUrl="https://docs.google.com/presentation/d/1yyZtqREBI0fS6zZ2HlKMwGnrUwO6VXab/edit?slide=id.p1#slide=id.p1" />
            </div>
          ) : (
            <div className="flex w-full h-full gap-6 transition-all duration-300">
              <div className="flex flex-col w-[70%] h-full">
                <div className="bg-white rounded-xl h-[calc(100vh-120px)] transition-all duration-300">
                  <PPTSection
                    removeAskQuestionButton={true}
                    isQuestionMode={true}
                    height="calc(100vh - 120px)"
                    width="100%"
                  />
                </div>
              </div>
              <QuestionPanel />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
