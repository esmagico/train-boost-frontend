"use client";
import React from "react";
import VideoPanel from "@/components/sections/VideoPanel";
import PPTSection from "@/components/sections/PPTSection";
import { useGetAllVideoQuery } from "@/store/api/questionsApi";

const Home = () => {
  const { data, isLoading } = useGetAllVideoQuery();
  const videos = data?.data?.filter(
    (video) => video?.trainer_video && video?.trainer_video?.trim() !== ""
  );

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 p-6 overflow-hidden">
          {/* {!isQuestionMode ? ( */}
            <div className="flex w-full h-full gap-6">
              <PPTSection
                videos={videos}
                loading={isLoading}
              />
              <VideoPanel videos={videos} loading={isLoading} />
            </div>
          {/* // ) : (
          //   <div className="flex w-full h-full gap-6 transition-all duration-300">
          //     <div className="flex flex-col w-[70%] h-full">
          //       <div className="bg-white rounded-xl h-[calc(100vh-120px)] transition-all duration-300">
          //         <PPTSection
          //           presentationUrl={presentationUrl}
          //           removeAskQuestionButton={true}
          //           isQuestionMode={true}
          //           height="calc(100vh - 120px)"
          //           width="100%"
          //         />
          //       </div>
          //     </div>
          //     <QuestionPanel />
          //   </div>
          // )} */}
        </div>
      </div>
    </div>
  );
};

export default Home;
