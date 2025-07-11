import React, { useState } from "react";
import AnswerSection from "./AnswerSection";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentSlide,
  setIsQuestionMode,
  setQuestion,
  setQuestionPanelPptSlide,
} from "@/store/features/videoSlice";
import { useSubmitQuestionMutation } from "@/store/api/questionsApi";

const QuestionPanel = () => {

  const [answer, setAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [audioLink, setAudioLink] = useState("");
  const dispatch = useDispatch();
  const {question} = useSelector((state) => state.video);
  const [submitQuestion, { isLoading, isError, error }] =
    useSubmitQuestionMutation();

  const handleSubmit = async () => {
    if (!question.trim()) return;
    try {
      // Submit the question and get the response
      const response = await submitQuestion({ question }).unwrap();
      console.log(response,"response")
      // Store the answer from the response
      setAnswer(response?.answer || "No answer received");
      setAudioLink(response?.audio_url || "");
      dispatch(setQuestionPanelPptSlide(response?.primary_jump_target));
      setShowAnswer(true);
      dispatch(setQuestion(""));
    } catch (error) {
      console.log("Error submitting question:", error);
      // Optionally show an error message to the user
      setAnswer("Sorry, there was an error processing your question.");
      setShowAnswer(true);
    }
  };

  return (
    <div className="flex flex-col w-[30%] h-full">
      <div className="bg-white rounded-xl border border-gray-200 p-4 h-[calc(100vh-120px)] overflow-y-auto">
        {/* <div className="mb-6">
          <h3 className="font-medium mb-2">
            Transcript at time of question (00:45)
          </h3>
          <p className="p-3 bg-gray-50 rounded">
            "Welcome to today's training session."
          </p>
        </div> */}

        <div className="mb-6">
          <h3 className="font-medium mb-2">Your Question</h3>
          <textarea
            value={question}
            onChange={(e) => dispatch(setQuestion(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            placeholder="Type your question here..."
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => dispatch(setIsQuestionMode(false))}
            className="cursor-pointer px-6 py-2 border border-gray-300 rounded-full font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={!question.trim()}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              !question.trim()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            }`}
          >
            {isLoading ? "Submitting..." : "Submit Question"}
          </button>
        </div>

        {showAnswer && <AnswerSection answer={answer} audioLink={audioLink} />}
      </div>
    </div>
  );
};

export default QuestionPanel;
