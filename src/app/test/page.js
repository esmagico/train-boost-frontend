'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const quizData = {
    "questions": [
        {
            "correct_answer": "C",
            "options": {
                "A": "WFH days are reduced.",
                "B": "WFH days are now allocated monthly.",
                "C": "Unused WFH days can now be carried over and accumulated.",
                "D": "The WFH policy is eliminated."
            },
            "question_id": 1,
            "question_text": "What is the key update to the Work From Home policy effective January 1st, 2025?",
            "source_slide_id": 100
        },
        {
            "correct_answer": "B",
            "options": {
                "A": "Elimination of all management roles.",
                "B": "Creation of Chapter Leads for each domain.",
                "C": "Reduction of team sizes.",
                "D": "Implementation of a completely flat organizational structure."
            },
            "question_id": 2,
            "question_text": "What is a key structural change being implemented to improve the organizational structure?",
            "source_slide_id": 100
        },
        {
            "correct_answer": "B",
            "options": {
                "A": "Aniket Dandagavhan",
                "B": "Shreyas Sanghvi",
                "C": "Kanhaiya Singh",
                "D": "Aakash Satpute"
            },
            "question_id": 3,
            "question_text": "Who leads both the Design and Product chapters?",
            "source_slide_id": 100
        },
        {
            "correct_answer": "D",
            "options": {
                "A": "Project Oversight Departments",
                "B": "Product Oriented Divisions",
                "C": "Plan of Development",
                "D": "Autonomous, cross-functional teams"
            },
            "question_id": 4,
            "question_text": "What does the acronym POD stand for in the context of enhanced execution capabilities?",
            "source_slide_id": 100
        },
        {
            "correct_answer": "B",
            "options": {
                "A": "To track individual employee performance.",
                "B": "To define the scope, tasks, and responsibilities for an upcoming sprint.",
                "C": "To document completed projects.",
                "D": "To manage budgets for individual projects."
            },
            "question_id": 5,
            "question_text": "What is the primary purpose of the Sprint Planning Sheet?",
            "source_slide_id": 100
        },
        {
            "correct_answer": "C",
            "options": {
                "A": "January 22nd, 2025",
                "B": "January 28th, 2025",
                "C": "January 24th, 2025",
                "D": "February 1st, 2025"
            },
            "question_id": 6,
            "question_text": "By what date will designation alignment emails be sent to all team members?",
            "source_slide_id": 100
        },
        {
            "correct_answer": "C",
            "options": {
                "A": "September",
                "B": "December",
                "C": "March",
                "D": "June"
            },
            "question_id": 7,
            "question_text": "When are annual performance reviews conducted?",
            "source_slide_id": 100
        },
        {
            "correct_answer": "C",
            "options": {
                "A": "L5",
                "B": "L7",
                "C": "L9",
                "D": "L10"
            },
            "question_id": 8,
            "question_text": "What is the highest level in the proposed career progression framework?",
            "source_slide_id": 100
        },
        {
            "correct_answer": "B",
            "options": {
                "A": "To announce company layoffs.",
                "B": "To define and build a robust 'Structured Path for Growth'.",
                "C": "To reduce employee benefits.",
                "D": "To introduce a new company logo."
            },
            "question_id": 9,
            "question_text": "What is the overall objective of the presentation?",
            "source_slide_id": 100
        },
        {
            "correct_answer": "D",
            "options": {
                "A": "January 24th, 2025",
                "B": "January 28th, 2025",
                "C": "February 1st, 2025",
                "D": "January 22nd, 2025"
            },
            "question_id": 10,
            "question_text": "When will the new pod structure be released?",
            "source_slide_id": 100
        }
    ],
    "quiz_id": 2,
    "title": "Quiz for Presentation 21"
}

export default function TestPage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizData.questions.length - 1;

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
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
    quizData.questions.forEach(question => {
      if (answers[question.question_id] === question.correct_answer) {
        correct++;
      }
    });
    return (correct / quizData.questions.length) * 100;
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
      }, 1500); // Short delay to show success message before redirect
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
        <div className="max-w-2xl w-full bg-white rounded-2xl overflow-hidden mt-[-100px]">
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
                className={`px-6 py-3 rounded-full font-medium text-white ${
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
                  className="px-6 py-3 rounded-full font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
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
                Question {currentQuestionIndex + 1} of {quizData.questions.length}
              </span>
            </div>
            
            <h2 className="text-lg font-medium mb-4">{currentQuestion.question_text}</h2>
            
            <div className="space-y-3">
              {Object.entries(currentQuestion.options).map(([option, text]) => (
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
              className={`px-4 py-2 rounded-full ${
                currentQuestionIndex === 0 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>
            
            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={!answers[currentQuestion.question_id]}
                className={`px-6 py-2 rounded-full font-medium ${
                  !answers[currentQuestion.question_id]
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                Submit Test
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!answers[currentQuestion.question_id]}
                className={`px-6 py-2 rounded-full font-medium ${
                  !answers[currentQuestion.question_id]
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
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
