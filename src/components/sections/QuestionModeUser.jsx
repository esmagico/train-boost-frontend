import React from "react";
import chat_history from "@/assets/svg/chat_history.svg";
import back_to_session from "@/assets/svg/back_to_session.svg";
import Image from "next/image";
import tap_to_speak from "@/assets/svg/tap-to-speak.svg";
import { useDispatch } from "react-redux";
import { setIsQuestionMode } from "@/store/features/videoSlice";

const QuestionModeUser = () => {
  const dispatch = useDispatch();

  const handleBackToSession = () => {
    dispatch(setIsQuestionMode(false));
  };

  return (
    <div className="flex-1 border border-[#E5E7EB] rounded-[10px] p-3 flex flex-col">
      {/* Main Content Frame */}
      <div className="flex-1 bg-[#F7F7F7] rounded-xl flex items-center justify-center p-6">
        {/* Center Content */}
        <div className="flex flex-col items-center gap-[30px] max-w-[275px]">
          {/* Tap to Speak */}
          <div className="w-[120px] h-[120px] flex items-center justify-center">
            <Image
              src={tap_to_speak}
              alt="tap to speak"
              width={72}
              height={72}
            />
          </div>

          {/* Question Text */}
          <p className="font-lato font-normal text-sm leading-[18px] text-center text-[#1A1C29]">
            Can you explain the key changes in the new savings account policy?
          </p>
        </div>
      </div>

      {/* Bottom Input Section */}
      <div className="mt-6 flex items-center justify-center px-3 gap-4 mx-auto">
        <button className="cursor-pointer flex items-center gap-1 px-3 py-[7px] bg-[rgba(110,96,223,0.1)] rounded-[73.75px]">
          <Image
            className="w-[18px] h-[18px]"
            src={chat_history}
            alt="chat_history"
          />
       
        </button>
        <button onClick={handleBackToSession} className="cursor-pointer flex items-center gap-1 px-3 py-1.5 bg-[#6E60DF] rounded-[73.75px]">
          <Image
            className="w-5 h-5"
            src={back_to_session}
            alt="back_to_session"
          />
          <span className="font-lato font-medium text-xs text-white">
            Continue Lesson
          </span>
        </button>
      </div>
    </div>
  );
};

export default QuestionModeUser;
