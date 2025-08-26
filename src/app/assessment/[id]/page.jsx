"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useGetQuizQuery } from "@/store/api/questionsApi";
import Button from "@/components/common/Button";

export default function AssessmentPage() {
  const router = useRouter();
  const params = useParams();
  const presentationId = params.id;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (isSubmitted) {
      router.push(`/result?score=${score}&id=${presentationId}`);
    }
  }, [isSubmitted, score, presentationId, router]);

  // Fetch quiz data using the dynamic presentation ID
  const {
    data: quizData,
    isLoading,
    isError,
  } = useGetQuizQuery(presentationId);

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] py-8 px-6">
        <div className="max-w-3xl mx-auto bg-white rounded-xl border border-[#f1f2f4] overflow-hidden">
          <div className="p-6">
            <div className="animate-pulse">
              {/* Loading header */}
              <div className="mb-8">
                <div className="h-8 bg-[#f1f2f4] rounded-lg w-2/3 mx-auto"></div>
              </div>

              <div className="mb-6">
                {/* Loading question count */}
                <div className="flex justify-between items-center mb-4">
                  <div className="h-4 bg-[#f1f2f4] rounded w-32"></div>
                </div>

                {/* Loading question text */}
                <div className="mb-4">
                  <div className="h-[22px] bg-[#f1f2f4] rounded-lg mb-2"></div>
                  <div className="h-[22px] bg-[#f1f2f4] rounded-lg w-3/4"></div>
                </div>

                {/* Loading options */}
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="p-4 border border-[#f1f2f4] rounded-xl"
                    >
                      <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full border-2 border-[#6B7280] mr-3"></div>
                        <div className="h-5 bg-[#f1f2f4] rounded-lg w-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Loading navigation buttons */}
              <div className="flex justify-between pt-4 border-t border-[#f1f2f4]">
                <div className="h-10 w-[100px] bg-[#f1f2f4] rounded-xl"></div>
                <div className="h-10 w-[100px] bg-[#f1f2f4] rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if fetch fails
  if (isError || !quizData) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="text-[18px] font-lato font-semibold text-red-500">
          Failed to load assessment. Please try again later.
        </div>
      </div>
    );
  }

  const currentQuestion = quizData?.questions?.[currentQuestionIndex];
  const isLastQuestion =
    currentQuestionIndex === quizData?.questions?.length - 1;

  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizData?.questions?.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quizData?.questions?.forEach((question) => {
      if (answers[question.question_id] === question.correct_answer) {
        correct++;
      }
    });
    return Math.round((correct / quizData?.questions?.length) * 100);
  };

  const handleSubmit = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] py-8 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl border border-[#f1f2f4] overflow-hidden">
        <div className="p-6">
          <h1 className="text-[24px] font-lato font-bold mb-8 text-center text-[#121416]">
            {quizData.title}
          </h1>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[14px] font-lato font-medium text-[#6B7280]">
                Question {currentQuestionIndex + 1} of{" "}
                {quizData?.questions?.length}
              </span>
            </div>

            <h2 className="text-[18px] font-lato font-semibold mb-4 text-[#121416]">
              {currentQuestion?.question_text}
            </h2>

            <div className="space-y-3">
              {Object.entries(currentQuestion?.options).map(
                ([option, text]) => (
                  <div
                    key={option}
                    onClick={() =>
                      handleAnswer(currentQuestion.question_id, option)
                    }
                    className={`p-4 border rounded-xl cursor-pointer transition-colors ${
                      answers[currentQuestion.question_id] === option
                        ? "border-blue-600 bg-blue-50"
                        : "border-[#f1f2f4] hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                          answers[currentQuestion.question_id] === option
                            ? "border-blue-600 bg-blue-600"
                            : "border-[#6B7280]"
                        }`}
                      >
                        {answers[currentQuestion.question_id] === option && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span className="font-lato font-medium text-[#121416]">
                        {option}. {text}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-[#f1f2f4]">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              variant="secondary"
              className={`${
                currentQuestionIndex === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-pointer"
              }`}
            >
              Previous
            </Button>

            {isLastQuestion ? (
              <Button
                onClick={handleSubmit}
                disabled={!answers[currentQuestion.question_id]}
                variant="primary"
                className={`${
                  !answers[currentQuestion.question_id]
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                }`}
              >
                Submit Assessment
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!answers[currentQuestion.question_id]}
                variant="primary"
                className={`${
                  !answers[currentQuestion.question_id]
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                }`}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
