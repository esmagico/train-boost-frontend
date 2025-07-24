import {
  setCurrentSlide,
  setCurrentVideoIndex,
  setCurrentVideoTime,
  setIsVideoPlaying,
} from "@/store/features/videoSlice";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/navigation';
import { useGetAllVideoQuery } from "@/store/api/questionsApi";

// Skeleton Loader Component
const VideoSkeleton = () => (
  <div className="flex flex-col w-[30%] h-full">
    {/* Video Player Skeleton */}
    <div className="p-4 bg-white rounded-xl border border-gray-200">
      <div className="relative w-full pt-[56.25%] bg-gray-100 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>
        </div>
      </div>
    </div>

    {/* Playlist Skeleton */}
    <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 flex-1">
      <div className="h-6 w-1/3 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center p-2">
            <div className="w-16 h-12 bg-gray-100 rounded mr-3 animate-pulse"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-100 rounded w-3/4 mb-1"></div>
              <div className="h-3 bg-gray-50 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const VideoPanel = ({videos=[], loading = true}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);
  const videoRef = useRef(null);
  const activeVideoRef = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentVideoIndex } = useSelector((state) => state.video);
  const [showRedirectPopup, setShowRedirectPopup] = useState(false);
  const [countdown, setCountdown] = useState(10);

  // Handle countdown and redirect
  useEffect(() => {
    if (!showRedirectPopup) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    if (countdown === 0) {
      router.push('/test');
    }

    return () => clearInterval(timer);
  }, [showRedirectPopup, countdown, router]);

  // Play the current video when index changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      if (isPlaying && autoPlayEnabled) {
        videoRef.current.play().catch((error) => {
          console.log("Error playing video:", error);
        });
      }
    }
  }, [currentVideoIndex, autoPlayEnabled]);

  // Add effect to scroll active video into view
  useEffect(() => {
    if (activeVideoRef.current) {
      activeVideoRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [currentVideoIndex]);

  // Show skeleton while loading
  if (loading || !videos) {
    return <VideoSkeleton />;
  }

  // Handle video end
  const handleVideoEnd = () => {
    if (currentVideoIndex < videos?.length - 1) {
      setAutoPlayEnabled(true); // Enable autoplay for next video
      dispatch(setCurrentVideoIndex(currentVideoIndex + 1));
      dispatch(setCurrentSlide(videos[currentVideoIndex + 1]?.slide));
    } else {
      setShowRedirectPopup(true);
      setAutoPlayEnabled(false);
    }
  };

  // Close popup handler
  const handleClosePopup = () => {
    setShowRedirectPopup(false);
    setCountdown(10);
  };

  // Format time in MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Handle transcript item click
  const handleTranscriptClick = (index) => {
    setAutoPlayEnabled(true);
    dispatch(setCurrentVideoIndex(index));
    setIsPlaying(false);
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((error) => {
          console.log("Error playing video:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressBarClick = (e) => {
    if (!videoRef.current) return;

    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.clientWidth;
    const seekTime = (clickPosition / progressBarWidth) * duration;

    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  return (
    <div className="flex flex-col w-[30%] h-full relative">
      {/* Redirect Popup */}
      {showRedirectPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Training Complete!</h3>
            <p className="mb-6">
              Redirecting to Test Page in {countdown} seconds...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${(10 - countdown) * 10}%` }}
              ></div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleClosePopup}
                className="cursor-pointer px-4 py-2 rounded-md text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200"
              >
                Close
              </button>
              <button
                onClick={() => router.push('/test')}
                className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Go to Test Now
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="p-4 pb-1 bg-white rounded-xl border border-gray-200">
        <div className="relative w-full pt-[56.25%] bg-black rounded-lg overflow-hidden">
          {" "}
          {/* 16:9 Aspect Ratio */}
          <video
            ref={videoRef}
            src={videos?.[currentVideoIndex]?.trainer_video}
            className="absolute top-0 left-0 w-full h-full object-cover"
            onEnded={handleVideoEnd}
            onTimeUpdate={(e) => {
              setCurrentTime(e.target.currentTime);
              dispatch(setCurrentVideoTime(e.target.currentTime));
            }}
            onLoadedMetadata={(e) => setDuration(e.target.duration)}
            onPlay={() => {
              setIsPlaying(true);
              dispatch(setIsVideoPlaying(true));
            }}
            onPause={() => {
              setIsPlaying(false);
              dispatch(setIsVideoPlaying(false));
            }}
            onClick={togglePlayPause}
            poster={videos?.[currentVideoIndex]?.thumbnail}
            autoPlay={autoPlayEnabled}
            controls={true}
            controlsList="nodownload"
          />
        </div>
        {/* Time display below video */}
        <div className="flex justify-start mt-2 text-sm text-gray-600">
          <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
        </div>
      </div>

      <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 flex-1">
        <h3 className="font-medium mb-3">
          Video Playlist ({videos?.length} videos)
        </h3>
        <div className="space-y-3 text-sm max-h-[calc(100vh-497px)] overflow-y-auto">
          {videos?.map((video, index) => (
            <div
              key={index}
              ref={currentVideoIndex === index ? activeVideoRef : null}
              className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                currentVideoIndex === index
                  ? "bg-blue-50 border-l-4 border-blue-500"
                  : "hover:bg-gray-50 border-l-4 border-transparent"
              }`}
              onClick={() => {
                handleTranscriptClick(index);
                dispatch(setCurrentSlide(video.slide));
              }}
            >
              <img
                src={video?.thumbnail}
                alt="Thumbnail"
                className="w-16 h-12 object-cover rounded mr-3"
              />
              <div className="flex-1 min-w-0 relative group">
                <p className="font-medium truncate" title={video?.title || `Video ${index + 1}`}>
                  {video?.title || `Video ${index + 1}`}
                </p>
                <div 
                  className={`absolute z-100 invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap ${
                    index === 0 
                      ? 'top-full mt-1' 
                      : 'bottom-full mb-2'
                  }`}
                >
                  {video?.title || `Video ${index + 1}`}
                  <div className={`absolute ${
                    index === 0 
                      ? 'bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-gray-800'
                      : 'top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-800'
                  }`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPanel;
