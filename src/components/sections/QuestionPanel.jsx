// Updated QuestionPanel.jsx
import React, { useState, useRef, useEffect } from "react";
import AnswerSection from "./AnswerSection";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsQuestionMode,
  setQuestion,
  setQuestionPanelPptSlide,
} from "@/store/features/videoSlice";
import { useSubmitQuestionMutation } from "@/store/api/questionsApi";
import Button from "@/components/common/Button";

const QuestionPanel = () => {
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const { question, isPlaying } = useSelector((state) => state.video);
  const [submitQuestion] = useSubmitQuestionMutation();

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

    const userQuestion = question.trim();
    setCurrentQuestion(userQuestion);
    dispatch(setQuestion(""));
    setIsLoading(true);

    // Add user question to conversation
    setConversation((prev) => [
      ...prev,
      { type: "question", content: userQuestion },
    ]);

    try {
      const response = await submitQuestion({
        question: userQuestion,
      }).unwrap();
      dispatch(setQuestionPanelPptSlide(response?.primary_jump_target));
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

  return (
    <div className="flex flex-col w-[30%] h-full">
      <div className="bg-white rounded-xl border border-gray-200 p-4 h-[calc(100vh-120px)] flex flex-col">
        <div
          className="flex-1 overflow-y-auto mb-4"
          style={{ maxHeight: "calc(100vh - 250px)", minHeight: "200px" }}
        >
          {conversation.map((item, index) => (
            <div key={index} className="mb-4">
              {item.type === "question" && (
                <div className="mb-2 p-3 bg-blue-100 rounded-lg">
                  <p className="font-medium text-blue-800">Question:</p>
                  <p>{item.content}</p>
                </div>
              )}
              {item.type === "answer" && (
                <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                  <AnswerSection
                    answer={item.content}
                    audioLink={item.audioLink}
                  />
                </div>
              )}
              {item.type === "error" && (
                <div className="text-red-500 p-2 bg-red-50 rounded">
                  {item.content}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="animate-pulse p-3">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="mt-auto">
          <div className="mb-4">
            <h3 className="font-medium mb-2">Your Question</h3>
            <textarea
              value={question}
              onChange={(e) => dispatch(setQuestion(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Type your question here..."
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // Prevent new line
                  if (!isPlaying) {
                    handleSubmit();
                  }
                }
              }}
            />
          </div>
          <div className="flex justify-between">
          <Button
              onClick={() => dispatch(setIsQuestionMode(false))}
              variant="secondary"
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!question.trim() || isLoading || isPlaying}
              variant="primary"
            >
              {isLoading ? (
                <>
                  <svg
                    className="inline mr-2 w-5 h-5 text-gray-500 animate-spin"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit Question"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPanel;
