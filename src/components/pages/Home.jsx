"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// AI-themed icons
const AIIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
  </svg>
);

const PlayIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5.14v14.72L19 12L8 5.14z" />
  </svg>
);

const CheckIcon = ({ color = "currentColor" }) => (
  <svg className="w-4 h-4" fill={color} viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
      clipRule="evenodd"
    />
  </svg>
);

const BrainIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M21.33 12.91c.09-.69.07-1.4-.07-2.08c.17-.73.17-1.5-.02-2.24c-.2-.78-.53-1.5-.95-2.16c-.44-.68-.97-1.28-1.58-1.77c-.63-.5-1.32-.89-2.07-1.15c-.76-.27-1.55-.4-2.35-.4c-.8 0-1.59.13-2.35.4c-.75.26-1.44.65-2.07 1.15c-.61.49-1.14 1.09-1.58 1.77c-.42.66-.75 1.38-.95 2.16c-.19.74-.19 1.51-.02 2.24c-.14.68-.16 1.39-.07 2.08c.1.7.32 1.37.65 1.98c.33.61.75 1.16 1.25 1.63c.51.48 1.09.87 1.71 1.17c.63.3 1.3.45 1.98.45c.68 0 1.35-.15 1.98-.45c.62-.3 1.2-.69 1.71-1.17c.5-.47.92-1.02 1.25-1.63c.33-.61.55-1.28.65-1.98z" />
  </svg>
);

// Dummy data - in a real app, this would come from an API
const dummyPresentations = [
  {
    presentation_id: 1,
    title: "Market Trends 2025",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60",
    isCompleted: false,
  },
  {
    presentation_id: 2,
    title: "AI in Healthcare",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=60",
    isCompleted: false,
  },
  {
    presentation_id: 3,
    title: "Renewable Energy Innovations",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&auto=format&fit=crop&q=60",
    isCompleted: true,
  },
  {
    presentation_id: 4,
    title: "Global Economic Outlook",
    image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&auto=format&fit=crop&q=60",
    isCompleted: false,
  },
  {
    presentation_id: 5,
    title: "Cybersecurity Threats 2025",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60",
    isCompleted: true,
  },
  {
    presentation_id: 6,
    title: "Sustainable Architecture",
    image: "https://images.unsplash.com/photo-1431576901776-e539bd916ba2?w=800&auto=format&fit=crop&q=60",
    isCompleted: true,
  },
  {
    presentation_id: 7,
    title: "Blockchain Applications",
    image: "https://images.unsplash.com/photo-1644143379190-08a5f055de1d?w=800&auto=format&fit=crop&q=60",
    isCompleted: false,
  },
  {
    presentation_id: 8,
    title: "Space Exploration Advances",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&auto=format&fit=crop&q=60",
    isCompleted: true,
  },
  {
    presentation_id: 9,
    title: "E-commerce Strategies",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop&q=60",
    isCompleted: false,
  },
  {
    presentation_id: 10,
    title: "Smart Cities of the Future",
    image: "https://images.unsplash.com/photo-1493489188222-08b45e38a62a?w=800&auto=format&fit=crop&q=60",
    isCompleted: true,
  },
];

const PresentationCard = ({ presentation, onClick, index, showBadge }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Fallback image URL with AI/tech theme
  const fallbackImage =
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop&crop=center";

  // Priority loading for first 6 cards
  const isPriority = index < 6;

  return (
    <div
      className="group relative bg-white rounded-xl border border-[#f1f2f4] hover:border-blue-200 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative w-full h-48 bg-[#f1f2f4] overflow-hidden">
        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#f1f2f4] via-gray-200 to-[#f1f2f4] animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          </div>
        )}

        <Image
          src={imageError ? fallbackImage : presentation.image}
          alt={presentation.title}
          fill
          priority={isPriority}
          className={`object-cover group-hover:scale-105 transition-all duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onError={() => setImageError(true)}
          onLoad={() => setImageLoaded(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading={isPriority ? "eager" : "lazy"}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Completion Badge */}
        {presentation.isCompleted && (
          <div className="absolute top-3 right-3 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}

        {/* AI Badge */}
        {showBadge && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center gap-1 shadow-lg">
            <AIIcon />
            <span className="text-white text-xs font-semibold">AI</span>
          </div>
        )}

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <PlayIcon />
          </div>
        </div>

        {/* Progress bar for completed courses */}
        {presentation.isCompleted && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3
            className="font-semibold text-gray-900 text-base leading-tight group-hover:text-blue-600 transition-colors overflow-hidden flex-1 mr-2"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {presentation.title}
          </h3>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BrainIcon />
            <span>AI Training</span>
          </div>

          <div className="flex items-center gap-2">
            {presentation.isCompleted ? (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                <CheckIcon />
                Completed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full hover:bg-blue-200 transition-colors">
                <ClockIcon />
                Start Learning
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Home = ({ showStats, showFilterTab }) => {
  const router = useRouter();
  const [presentations, setPresentations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Simulate API call
    const loadPresentations = async () => {
      try {
        // In a real app, you would fetch from your API here
        // const response = await fetch('/api/presentations');
        // const data = await response.json();

        // For now, use dummy data
        await new Promise((resolve) => setTimeout(resolve, 1200)); // Simulate loading
        setPresentations(dummyPresentations);
      } catch (error) {
        console.error("Error loading presentations:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPresentations();
  }, []);

  const handlePresentationClick = (presentationId) => {
    router.push(`/lectures/${presentationId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-80 mb-3 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded-lg w-96 animate-pulse"></div>
          </div>

          {/* Stats Skeleton */}
          {showStats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-sm animate-pulse"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm animate-pulse overflow-hidden"
              >
                <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                <div className="p-5">
                  <div className="h-5 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const completedCount = presentations.filter((p) => p.isCompleted).length;
  const totalCount = presentations.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <BrainIcon />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                AI-Powered Training Hub
              </h1>
              <p className="text-gray-600 text-lg">
                Master new skills with intelligent, adaptive learning
                experiences
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {showStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Progress Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Learning Progress
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {completedCount}/{totalCount}
                  </p>
                  <p className="text-sm text-gray-500">courses completed</p>
                </div>
                <div className="w-16 h-16 relative">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 36 36"
                  >
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="3"
                      strokeDasharray={`${progressPercentage}, 100`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-900">
                      {progressPercentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights Card */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">
                    AI Insights
                  </p>
                  <p className="text-2xl font-bold">Smart</p>
                  <p className="text-blue-100 text-sm">personalized learning</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <AIIcon />
                </div>
              </div>
            </div>

            {/* Achievement Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Achievements
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {completedCount}
                  </p>
                  <p className="text-sm text-gray-500">certificates earned</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <CheckIcon color="white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Available Courses
            </h2>
            {showFilterTab && (
              <div className="flex bg-white/80 backdrop-blur-sm rounded-2xl p-1 shadow-lg border border-gray-200">
                {[
                  { key: "all", label: "All Courses" },
                  { key: "in-progress", label: "In Progress" },
                  { key: "completed", label: "Completed" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={`cursor-pointer px-6 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
                      filter === tab.key
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Course Grid */}
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {presentations
              .filter(
                (p) =>
                  filter === "all" ||
                  (filter === "completed" && p.isCompleted) ||
                  (filter === "in-progress" && !p.isCompleted)
              )
              .map((presentation, index) => (
                <PresentationCard
                  key={presentation.presentation_id}
                  // showBadge={true}
                  presentation={presentation}
                  index={index}
                  onClick={() =>
                    handlePresentationClick(presentation.presentation_id)
                  }
                />
              ))}
          </div>
        </div>

        {/* Empty State */}
        {presentations.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BrainIcon />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No courses available
            </h3>
            <p className="text-gray-600">
              New AI-powered training content is coming soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
