import {
  setIsQuestionMode,
  setQuestionPanelPptSlide,
} from "@/store/features/videoSlice";
import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

const PPTSection = ({
  loading = false,
  removeAskQuestionButton = false,
  isQuestionMode = false,
  height = "calc(100vh - 220px)",
  width = "70%",
  autoPlayDelay = 3000,
  presentationUrl = "https://docs.google.com/presentation/d/1h2O6645kWV0kWihwFF--DKx82RykKc1L/edit?usp=drive_link&ouid=112603893642491756794&rtpof=true&sd=true", // new prop
}) => {
  const iframeRef = useRef(null);
  const { currentSlide, questionPanelPptSlide } = useSelector(
    (state) => state.video
  );
  const dispatch = useDispatch();
  const slideNumber = isQuestionMode ? questionPanelPptSlide : currentSlide;

  const extractPresentationId = (url) => {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  };

  const presentationId = extractPresentationId(presentationUrl);
  // const presentationId = "1yyZtqREBI0fS6zZ2HlKMwGnrUwO6VXab"
  // const getSlideUrl = () => {
  //   if (!presentationId) return "";
  //   return `https://docs.google.com/presentation/d/${presentationId}/embed?start=true&loop=true&delayms=${autoPlayDelay}&slide=${currentSlide}`;
  // };

  const getSlideUrl = () => {
    if (!presentationId) return "";
    return `https://docs.google.com/presentation/d/${presentationId}/embed?start=false&loop=false&delayms=${autoPlayDelay}&rm=minimal&slide=${slideNumber}`;
  };

  if (loading) {
    return (
      <div className={`flex flex-col w-[${width}] h-[calc(100vh-120px)]`}>
        <div
          className="p-4 bg-white rounded-xl border border-gray-200 min-h-[500px] relative animate-pulse"
          style={{ height }}
        >
          <div className="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="h-8 w-48 bg-gray-300 rounded mx-auto"></div>
              <div className="h-4 w-32 bg-gray-300 rounded mx-auto"></div>
            </div>
          </div>
        </div>
        {!removeAskQuestionButton && (
          <div className="flex justify-center mt-4">
            <div className="h-10 w-40 bg-gray-200 rounded-full"></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col w-[${width}] h-[calc(100vh-120px)]`}>
      <div
        className="p-4 bg-white rounded-xl border border-gray-200 min-h-[500px] relative"
        style={{ height }}
      >
        {presentationId ? (
          <iframe
            ref={iframeRef}
            src={getSlideUrl()}
            className="w-full h-full rounded-xl pointer-events-none"
            allowFullScreen
            allow="autoplay"
            title="Presentation Slides"
            frameBorder="0"
            sandbox="allow-same-origin allow-scripts allow-popups allow-presentation"
          />
        ) : (
          <div className="text-red-500 text-center">
            Invalid Google Drive Presentation URL
          </div>
        )}
      </div>
      {!removeAskQuestionButton && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => {
              dispatch(setIsQuestionMode(true));
              dispatch(setQuestionPanelPptSlide(currentSlide));
            }}
            className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
          >
            Ask a Question
          </button>
        </div>
      )}
    </div>
  );
};

export default PPTSection;
