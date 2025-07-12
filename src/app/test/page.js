'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useGetQuizQuery } from '@/store/api/questionsApi';

export default function TestPage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  
  // Fetch quiz data
  const { data: quizData, isLoading, isError } = useGetQuizQuery();
  
  // Show loading state while fetching data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="animate-pulse space-y-6">
              {/* Loading header */}
              <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
              
              {/* Loading question count */}
              <div className="h-4 bg-gray-100 rounded w-1/4"></div>
              
              {/* Loading question text */}
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded w-5/6"></div>
              </div>
              
              {/* Loading options */}
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 mr-3"></div>
                      <div className="h-4 bg-gray-100 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Loading navigation buttons */}
              <div className="flex justify-between pt-4 border-t">
                <div className="h-10 bg-gray-100 rounded-full w-24"></div>
                <div className="h-10 bg-blue-100 rounded-full w-24"></div>
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">Failed to load quiz. Please try again later.</div>
      </div>
    );
  }

  const currentQuestion = quizData?.questions?.[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizData?.questions?.length - 1;

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizData?.questions?.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quizData?.questions?.forEach(question => {
      if (answers[question.question_id] === question.correct_answer) {
        correct++;
      }
    });
    return (correct / quizData?.questions?.length) * 100;
  };

  const handleSubmit = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setShowResult(true);
    setIsSubmitted(true);
    
    // Redirect to congratulations page if score is 100%
    if (finalScore === 100) {
      setTimeout(() => {
        router.push('/congratulations');
      }, 2500);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setShowResult(false);
    setIsSubmitted(false);
  };

  if (showResult) {
    const isPerfectScore = score === 100;
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-2xl w-full bg-white rounded-2xl overflow-hidden mt-[-200px]">
          <div className="p-8 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              {isPerfectScore ? (
                <svg 
                  className="w-14 h-14 text-green-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              ) : (
                <svg 
                  className="w-14 h-14 text-yellow-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  ></path>
                </svg>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {isPerfectScore ? 'Congratulations! 🎉' : 'Test Completed'}
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Your score: <span className="font-bold">{score.toFixed(0)}%</span>
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-8">
              <p className={`font-medium ${isPerfectScore ? 'text-green-700' : 'text-blue-700'}`}>
                {isPerfectScore 
                  ? 'You\'ve successfully passed the training and assessment with flying colors!'
                  : `You need to score 100% to pass the training.`
                }
              </p>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => router.push(isPerfectScore ? '/congratulations' : '/')}
                className={`cursor-pointer px-4 py-2 rounded-md font-medium text-white ${
                  isPerfectScore 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isPerfectScore ? 'View Certificate' : 'Retry Training'}
              </button>
              
              {!isPerfectScore && (
                <button
                  onClick={handleRetry}
                  className="cursor-pointer px-4 py-2 rounded-md font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-8 text-center">{quizData.title}</h1>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {quizData?.questions?.length}
              </span>
            </div>
            
            <h2 className="text-lg font-medium mb-4">{currentQuestion?.question_text}</h2>
            
            <div className="space-y-3">
              {Object.entries(currentQuestion?.options).map(([option, text]) => (
                <div 
                  key={option}
                  onClick={() => handleAnswer(currentQuestion.question_id, option)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    answers[currentQuestion.question_id] === option 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                      answers[currentQuestion.question_id] === option 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-400'
                    }`}>
                      {answers[currentQuestion.question_id] === option && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span>{option}. {text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between pt-4 border-t">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`px-4 py-2 rounded-md ${
                currentQuestionIndex === 0 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-pointer'
              }`}
            >
              Previous
            </button>
            
            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={!answers[currentQuestion.question_id]}
                className={`px-4 py-2 rounded-md font-medium ${
                  !answers[currentQuestion.question_id]
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                }`}
              >
                Submit Test
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!answers[currentQuestion.question_id]}
                className={`px-4 py-2 rounded-md font-medium ${
                  !answers[currentQuestion.question_id]
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                }`}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
