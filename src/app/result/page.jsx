"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Result() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [score, setScore] = useState(null);

  useEffect(() => {
    const scoreParam = searchParams.get("score");
    if (scoreParam) {
      setScore(Number(scoreParam));
    }
  }, [searchParams]);

  const isPerfectScore = score === 100;

  const handleRetry = () => {
    router.push("/test");
  };

  if (score === null) return null;

  return (
    <div className="min-h-[calc(100vh-70px)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg overflow-hidden mt-[-120px]">
        <div className="p-8">
          {/* Score Circle */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={isPerfectScore ? "#059669" : "#3B82F6"}
                strokeWidth="3"
                strokeDasharray={`${score}, 100`}
                strokeLinecap="round"
              />
              <text
                x="18"
                y="20.35"
                className="score-text"
                textAnchor="middle"
                fill={isPerfectScore ? "#059669" : "#3B82F6"}
                style={{ fontSize: "8px", fontWeight: "bold" }}
              >
                {score}%
              </text>
            </svg>

            {/* Status Icon */}
            <div
              className={`absolute bottom-0 right-0 p-2 rounded-full ${
                isPerfectScore ? "bg-green-100" : "bg-blue-100"
              }`}
            >
              {isPerfectScore ? (
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-amber-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>
          </div>

          {/* Result Content */}
          <div className="text-center space-y-6">
            <h1
              className={`text-2xl font-bold ${
                isPerfectScore ? "text-green-600" : "text-blue-600"
              }`}
            >
              {isPerfectScore ? "Congratulations! 🎉" : "Almost There!"}
            </h1>

            <div className="space-y-2">
              <p className="text-gray-600">
                {isPerfectScore
                  ? "You've mastered the training with a perfect score! Your certificate awaits."
                  : "Keep going! Review and try again to achieve mastery."}
              </p>

              {!isPerfectScore && (
                <div className="inline-block bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mt-2">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-amber-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm font-medium text-amber-800">
                      You need 100% to pass this assessment
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
              <button
                onClick={() =>
                  router.push(isPerfectScore ? "/congratulations" : "/")
                }
                className={`cursor-pointer px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                  isPerfectScore
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isPerfectScore ? "View Certificate" : "Restart Training"}
              </button>

              {!isPerfectScore && (
                <button
                  onClick={handleRetry}
                  className="cursor-pointer px-4 py-2 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
