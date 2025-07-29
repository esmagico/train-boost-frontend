"use client";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setQuestion,
  setAnswerPptIndex,
} from "@/store/features/videoSlice";
import { useSubmitQuestionMutation } from "@/store/api/questionsApi";
import AnswerSection from "@/components/sections/AnswerSection";
import mic from "@/assets/svg/mic.svg";
import micActive from "@/assets/svg/mic-active.svg";
import submit from "@/assets/svg/submit.svg";
import submitActive from "@/assets/svg/submit-active.svg";
import { FiMessageCircle, FiX, FiMinus } from "react-icons/fi";

const FloatingChatbot = ({ onPauseVideo, videos = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [startingText, setStartingText] = useState("");
  const startingTextRef = useRef("");
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const dispatch = useDispatch();
  const { question, isPlaying } = useSelector((state) => state.video);
  const [submitQuestion] = useSubmitQuestionMutation();

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        setSpeechSupported(true);
        recognitionRef.current = new SpeechRecognition();

        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event) => {
          const lastResult = event.results[event.results.length - 1];
          const transcript = lastResult[0].transcript;

          const combinedText =
            startingTextRef.current +
            (startingTextRef.current && transcript ? " " : "") +
            transcript;
          dispatch(setQuestion(combinedText));

          if (lastResult.isFinal) {
            setStartingText(combinedText);
            startingTextRef.current = combinedText;
            setIsListening(false);
          }
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [dispatch]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement;
      container.scrollTo({
        top: messagesEndRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSubmit = async () => {
    if (!question.trim()) return;

    if (onPauseVideo) {
      onPauseVideo();
    }

    const userQuestion = question.trim();
    dispatch(setQuestion(""));
    setStartingText("");
    startingTextRef.current = "";
    setIsLoading(true);

    setConversation((prev) => [
      ...prev,
      { type: "question", content: userQuestion },
    ]);

    try {
      const response = await submitQuestion({
        question: userQuestion,
      }).unwrap();

      if (response?.primary_jump_target !== undefined) {
        dispatch(setAnswerPptIndex(response.primary_jump_target));
      }

      setConversation((prev) => [
        ...prev,
        {
          type: "answer",
          content: response?.answer || "No answer received",
          audioLink: response?.audio_url || "",
        },
      ]);
    } catch (error) {
      console.log("Error submitting question:", error);
      setConversation((prev) => [
        ...prev,
        {
          type: "error",
          content: "Failed to load answer. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSpeechRecognition = () => {
    if (!speechSupported) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      if (onPauseVideo) {
        onPauseVideo();
      }

      setStartingText(question);
      startingTextRef.current = question;

      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        setIsListening(false);
      }
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const clearConversation = () => {
    setConversation([]);
    dispatch(setQuestion(""));
    setStartingText("");
    startingTextRef.current = "";
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <div className="fixed bottom-6 right-6 z-50 ">
        {!isOpen && (
          <button
            onClick={toggleChat}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer"
            title="Open Chat"
          >
            <FiMessageCircle size={24} />
          </button>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-5 right-4 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col">
          {/* Chat Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FiMessageCircle size={20} />
              <h3 className="font-semibold">TrainBoost Assistant</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={clearConversation}
                className="text-white hover:text-gray-200 p-1 cursor-pointer"
                title="Clear conversation"
              >
                <FiMinus size={16} />
              </button>
              <button
                onClick={toggleChat}
                className="text-white hover:text-gray-200 p-1 cursor-pointer"
                title="Close chat"
              >
                <FiX size={20} />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {conversation.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <FiMessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="font-medium">Welcome to TrainBoost Assistant!</p>
                <p className="text-sm mt-2">
                  Ask me anything about the presentation and I'll help you find the answers.
                </p>
              </div>
            )}

            {conversation.map((item, index) => (
              <div key={index}>
                {item.type === "question" && (
                  <div className="flex justify-end mb-2">
                    <div className="bg-blue-600 text-white p-3 rounded-lg max-w-[80%]">
                      <p className="text-sm">{item.content}</p>
                    </div>
                  </div>
                )}
                {item.type === "answer" && (
                  <div className="flex justify-start mb-2">
                    <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
                      <AnswerSection
                        answer={item.content}
                        audioLink={item.audioLink}
                        onPauseVideo={onPauseVideo}
                      />
                    </div>
                  </div>
                )}
                {item.type === "error" && (
                  <div className="flex justify-start mb-2">
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg max-w-[80%]">
                      <p className="text-sm">{item.content}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start mb-2">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="relative">
              <textarea
                value={question}
                onChange={(e) => {
                  const newValue = e.target.value;
                  dispatch(setQuestion(newValue));
                  if (!isListening) {
                    setStartingText(newValue);
                    startingTextRef.current = newValue;
                  }
                }}
                className="w-full px-4 py-3 pr-20 text-gray-700 bg-white border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[52px] max-h-32"
                placeholder={isListening ? "Listening..." : "Ask TrainBoost..."}
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!isPlaying && question.trim()) {
                      handleSubmit();
                    }
                  }
                }}
                disabled={isListening}
              />

              {/* Speech Recognition Button */}
              {speechSupported && (
                <button
                  onClick={toggleSpeechRecognition}
                  disabled={isLoading || isPlaying}
                  className={`absolute right-2 top-2 p-2 rounded-full transition-colors ${
                    isLoading || isPlaying || isListening
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  title={isListening ? "Stop listening" : "Start voice input"}
                >
                  {isListening ? (
                    <img
                      src={micActive.src}
                      alt="Mic Active"
                      className="w-[24px] h-[24px]"
                    />
                  ) : (
                    <img src={mic.src} alt="Mic" className="w-[24px] h-[24px]" />
                  )}
                </button>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!question.trim() || isLoading || isPlaying}
                className={`absolute right-2 top-10 p-2 rounded-full transition-colors ${
                  !question.trim() || isLoading || isPlaying
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                title="Submit question"
              >
                {isLoading || isPlaying || question.trim() === "" ? (
                  <img
                    src={submit.src}
                    alt="Submit"
                    className="w-[24px] h-[24px]"
                  />
                ) : (
                  <img
                    src={submitActive.src}
                    alt="Submit Active"
                    className="w-[24px] h-[24px]"
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;