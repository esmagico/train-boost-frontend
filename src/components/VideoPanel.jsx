import {
  setCurrentSlide,
  setCurrentVideoIndex,
} from "@/store/features/videoSlice";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/navigation';

const dummyVideos = [
  {
    slide: 1,
    trainer_video: [
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    ],
    thumb:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
    title: "Big Buck Bunny",
  },
  {
    slide: 2,
    trainer_video: [
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    ],
    thumb:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    title: "Elephant Dream",
  },
  {
    slide: 3,
    trainer_video: [
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    ],
    thumb:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg",
    title: "Sintel",
  },
  {
    slide: 4,
    trainer_video: [
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    ],
    thumb:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg",
    title: "For Bigger Blazes",
  },
  {
    slide: 5,
    trainer_video: [
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    ],
    thumb:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg",
    title: "For Bigger Escape",
  },
];

const VideoPanel = ({ videos = dummyVideos }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentVideoIndex } = useSelector((state) => state.video);
  const [showRedirectPopup, setShowRedirectPopup] = useState(false);
  const [countdown, setCountdown] = useState(10);

  // Handle video end
  const handleVideoEnd = () => {
    if (currentVideoIndex < videos.length - 1) {
      dispatch(setCurrentVideoIndex(currentVideoIndex + 1));
      dispatch(setCurrentSlide(videos[currentVideoIndex + 1].slide));
    } else {
      // All videos finished, show redirect popup
      setShowRedirectPopup(true);
    }
  };

  // Handle countdown and redirect
  useEffect(() => {
    if (!showRedirectPopup) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/test');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showRedirectPopup, router]);

  // Close popup handler
  const handleClosePopup = () => {
    setShowRedirectPopup(false);
    setCountdown(10);
  };

  // Play the current video when index changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      if (isPlaying) {
        videoRef.current.play().catch((error) => {
          console.error("Error playing video:", error);
        });
      }
    }
  }, [currentVideoIndex]);

  // Format time in MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Handle transcript item click
  const handleTranscriptClick = (index) => {
    dispatch(setCurrentVideoIndex(index));
    setIsPlaying(true);
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((error) => {
          console.error("Error playing video:", error);
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
                className="cursor-pointer px-4 py-2 rounded-full text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200"
              >
                Close
              </button>
              <button
                onClick={() => router.push('/test')}
                className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
              >
                Go to Test Now
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <div className="relative w-full pt-[56.25%] bg-black rounded-lg overflow-hidden">
          {" "}
          {/* 16:9 Aspect Ratio */}
          <video
            ref={videoRef}
            src={videos[currentVideoIndex]?.trainer_video[0]}
            className="absolute top-0 left-0 w-full h-full object-cover"
            onEnded={handleVideoEnd}
            onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.target.duration)}
            onClick={togglePlayPause}
            poster={videos[currentVideoIndex]?.thumb}
            autoPlay={true}
            controls={true}
          />
        </div>
      </div>

      <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 flex-1">
        <h3 className="font-medium mb-3">
          Video Playlist ({videos.length} videos)
        </h3>
        <div className="space-y-3 text-sm max-h-[calc(100vh-497px)] overflow-y-auto">
          {videos.map((video, index) => (
            <div
              key={index}
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
                src={video.thumb}
                alt="Thumbnail"
                className="w-16 h-12 object-cover rounded mr-3"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{video.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPanel;
