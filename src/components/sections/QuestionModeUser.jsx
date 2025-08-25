import React from "react";
import chat_history from "@/assets/svg/chat_history.svg";
import back_to_session from "@/assets/svg/back_to_session.svg";
import Image from "next/image";
import tap_to_speak from "@/assets/svg/tap_to_speak.svg";

const QuestionModeUser = () => {
  return (
    <div className="flex-1 border border-[#E5E7EB] rounded-[10px] p-3 flex flex-col">
      {/* Main Content Frame */}
      <div className="flex-1 bg-[#F7F7F7] rounded-xl flex items-center justify-center p-6">
        {/* Center Content */}
        <div className="flex flex-col items-center gap-[30px] max-w-[275px]">
          {/* Avatar with Animation */}
          <div className="w-[120px] h-[120px] relative flex items-center justify-center">
            <div className="w-[150px] h-[150px] absolute">
              {/* Animated waves */}
              <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 animate-pulse"></div>
            </div>
            {/* You can add your avatar content here */}
            <div className="w-[120px] h-[120px] rounded-full bg-gray-200 z-10"></div>
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
        <button className="cursor-pointer flex items-center gap-1 px-3 py-1.5 bg-[#6E60DF] rounded-[73.75px]">
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
