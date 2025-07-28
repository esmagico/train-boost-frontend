import {
  setCurrentSlide,
  setCurrentVideoIndex,
  setCurrentVideoTime,
  setIsVideoPlaying,
} from "@/store/features/videoSlice";
import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useGetAllVideoQuery } from "@/store/api/questionsApi";
import QuestionPanel from "./QuestionPanel";

// Skeleton Loader Component
const VideoSkeleton = ({ width = "30%" }) => (
  <div className="flex flex-col h-full flex-shrink-0" style={{ width }}>
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

const VideoPanel = forwardRef(
  (
    {
      videos = [],
      loading = true,
      onVideoStateChange,
      onPauseVideo,
      onPauseAnswerAudio,
      width = "30%",
    },
    ref
  ) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasInitialized, setHasInitialized] = useState(false);
    const [lastVideoSrc, setLastVideoSrc] = useState("");
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);
    const videoRef = useRef(null);
    const activeVideoRef = useRef(null);
    const preloadVideoRef = useRef(null); // For preloading next video
    const router = useRouter();
    const dispatch = useDispatch();
    const { currentVideoIndex } = useSelector((state) => state.video);
    const [showRedirectPopup, setShowRedirectPopup] = useState(false);
    const [countdown, setCountdown] = useState(10);
    const [preloadedVideoIndex, setPreloadedVideoIndex] = useState(-1);

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
        router.push("/test");
      }

      return () => clearInterval(timer);
    }, [showRedirectPopup, countdown, router]);

    // Initialize video on first load
    useEffect(() => {
      if (videoRef.current && videos?.length > 0 && !hasInitialized) {
        console.log("Initializing video player...");

        // Update slide when video initializes
        if (videos?.[currentVideoIndex]?.slide) {
          dispatch(setCurrentSlide(videos[currentVideoIndex].slide));
        }

        setHasInitialized(true);
      }
    }, [videos, currentVideoIndex, dispatch, hasInitialized]);

    // Handle pause video from external source (like question panel)
    const pauseVideo = () => {
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
        setIsPlaying(false);
        dispatch(setIsVideoPlaying(false));

        // Notify parent about pause state change
        if (onVideoStateChange) {
          onVideoStateChange({
            currentTime,
            isPlaying: false,
            currentVideoIndex,
            duration,
          });
        }
      }
    };

    // Expose pauseVideo method to parent component
    useImperativeHandle(ref, () => ({
      pauseVideo,
    }));

    // Handle video index changes (only when actually changing)
    useEffect(() => {
      if (videoRef.current && hasInitialized && videos?.length > 0) {
        const currentVideo = videos[currentVideoIndex];
        const newSrc = currentVideo?.trainer_video;

        // Only reload if the source is actually different
        if (newSrc && newSrc !== lastVideoSrc) {
          setLastVideoSrc(newSrc);
          console.log(`Switching to video ${currentVideoIndex}...`);

          // Check if we have a preloaded video for this index
          if (
            preloadedVideoIndex === currentVideoIndex &&
            preloadVideoRef.current &&
            preloadVideoRef.current.readyState >= 2
          ) {
            console.log(`Using preloaded video for index ${currentVideoIndex}`);

            try {
              // Copy the preloaded video source to main video
              videoRef.current.src = preloadVideoRef.current.src;
              videoRef.current.load();

              // Clean up the preloaded video
              preloadVideoRef.current.src = "";
              setPreloadedVideoIndex(-1);
            } catch (error) {
              console.error(
                "Error using preloaded video, falling back to normal load:",
                error
              );
              videoRef.current.load();
              setPreloadedVideoIndex(-1);
            }
          } else {
            // Load video normally if not preloaded or preload failed
            videoRef.current.load();
            if (preloadedVideoIndex === currentVideoIndex) {
              setPreloadedVideoIndex(-1); // Reset if preload was attempted but failed
            }
          }

          // Update slide when video changes
          if (currentVideo?.slide) {
            dispatch(setCurrentSlide(currentVideo.slide));
          }

          // Notify parent about video index change
          if (onVideoStateChange) {
            onVideoStateChange({
              currentTime: 0,
              isPlaying: autoPlayEnabled,
              currentVideoIndex,
              duration: 0,
            });
          }

          if (autoPlayEnabled) {
            // Pause any playing answer audio when video starts
            if (onPauseAnswerAudio) {
              onPauseAnswerAudio();
            }

            videoRef.current.play().catch((error) => {
              console.log("Error playing video:", error);
            });
          }
        }
      }
    }, [
      currentVideoIndex,
      videos,
      dispatch,
      preloadedVideoIndex,
      hasInitialized,
      autoPlayEnabled,
    ]);

    // Add effect to scroll active video into view
    useEffect(() => {
      if (activeVideoRef.current) {
        activeVideoRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, [currentVideoIndex]);

    // Preload next video when current video is near completion
    useEffect(() => {
      const preloadThreshold = 10; // Start preloading 10 seconds before video ends

      if (duration > 0 && currentTime > 0) {
        const timeRemaining = duration - currentTime;
        const nextVideoIndex = currentVideoIndex + 1;

        // Check if we should preload the next video
        if (
          timeRemaining <= preloadThreshold &&
          nextVideoIndex < videos.length &&
          preloadedVideoIndex !== nextVideoIndex &&
          videos[nextVideoIndex]?.trainer_video
        ) {
          console.log(`Preloading video ${nextVideoIndex}...`);

          // Create preload video element if it doesn't exist
          if (!preloadVideoRef.current) {
            preloadVideoRef.current = document.createElement("video");
            preloadVideoRef.current.preload = "auto";
            preloadVideoRef.current.style.display = "none";
            document.body.appendChild(preloadVideoRef.current);
          }

          // Set source and start preloading
          preloadVideoRef.current.src = videos[nextVideoIndex].trainer_video;
          preloadVideoRef.current.onerror = (e) => {
            console.error(`Failed to preload video ${nextVideoIndex}:`, e);
            setPreloadedVideoIndex(-1);
          };
          preloadVideoRef.current.oncanplaythrough = () => {
            console.log(`Video ${nextVideoIndex} preloaded successfully`);
          };
          preloadVideoRef.current.load();
          setPreloadedVideoIndex(nextVideoIndex);

          // Optional: Preload poster/thumbnail
          if (videos[nextVideoIndex]?.thumbnail) {
            const img = new Image();
            img.src = videos[nextVideoIndex].thumbnail;
          }
        }
      }
    }, [currentTime, duration, currentVideoIndex, videos, preloadedVideoIndex]);

    // Cleanup preload video element on unmount
    useEffect(() => {
      return () => {
        if (preloadVideoRef.current) {
          document.body.removeChild(preloadVideoRef.current);
          preloadVideoRef.current = null;
        }
      };
    }, []);

    // Show skeleton while loading
    if (loading || !videos) {
      return <VideoSkeleton width={width} />;
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
          // Pause any playing answer audio when video starts
          if (onPauseAnswerAudio) {
            onPauseAnswerAudio();
          }

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
      const clickPosition =
        e.clientX - progressBar.getBoundingClientRect().left;
      const progressBarWidth = progressBar.clientWidth;
      const seekTime = (clickPosition / progressBarWidth) * duration;

      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    };

    return (
      <div
        className="flex flex-col h-full relative flex-shrink-0 pl-4"
        style={{ width }}
      >
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
                  onClick={() => router.push("/test")}
                  className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Go to Test Now
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="p-1 bg-white rounded-xl border border-gray-200">
          <div className="relative w-full pt-[56.25%] bg-black rounded-lg overflow-hidden">
            {" "}
            {/* 16:9 Aspect Ratio */}
            <video
              key={`trainer-video-${currentVideoIndex}`}
              ref={videoRef}
              src={videos?.[currentVideoIndex]?.trainer_video}
              className="absolute top-0 left-0 w-full h-full object-cover"
              onEnded={handleVideoEnd}
              onTimeUpdate={(e) => {
                const time = e.target.currentTime;
                setCurrentTime(time);
                dispatch(setCurrentVideoTime(time));
                // Pass video state to parent for PPT synchronization
                if (onVideoStateChange) {
                  onVideoStateChange({
                    currentTime: time,
                    isPlaying: !e.target.paused,
                    currentVideoIndex,
                    duration: e.target.duration || duration,
                  });
                }
              }}
              onLoadedMetadata={(e) => {
                const newDuration = e.target.duration;
                setDuration(newDuration);
                // Notify parent about duration
                if (onVideoStateChange) {
                  onVideoStateChange({
                    currentTime,
                    isPlaying,
                    currentVideoIndex,
                    duration: newDuration,
                  });
                }
              }}
              onPlay={() => {
                setIsPlaying(true);
                dispatch(setIsVideoPlaying(true));

                // Pause any playing answer audio when video starts
                if (onPauseAnswerAudio) {
                  onPauseAnswerAudio();
                }

                // Notify parent about play state change
                if (onVideoStateChange) {
                  onVideoStateChange({
                    currentTime,
                    isPlaying: true,
                    currentVideoIndex,
                    duration,
                  });
                }
              }}
              onPause={() => {
                setIsPlaying(false);
                dispatch(setIsVideoPlaying(false));
                // Notify parent about pause state change
                if (onVideoStateChange) {
                  onVideoStateChange({
                    currentTime,
                    isPlaying: false,
                    currentVideoIndex,
                    duration,
                  });
                }
              }}
              onLoadStart={() => {
                console.log("Trainer video loading started...");
              }}
              onCanPlay={() => {
                console.log("Trainer video can play");
              }}
              onClick={togglePlayPause}
              poster={videos?.[currentVideoIndex]?.thumbnail}
              autoPlay={autoPlayEnabled}
              controls={true}
              controlsList="nodownload"
            />
            {/* Preloading indicator */}
            {/* {preloadedVideoIndex === currentVideoIndex + 1 && (
            <div className="absolute top-4 right-4 bg-green-600 bg-opacity-80 text-white px-2 py-1 rounded-md text-xs flex items-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1"></div>
              Next video ready
            </div>
          )} */}
          </div>
          {/* Time display below video */}
          <div className=" px-1 flex justify-between mt-2 text-sm text-gray-600">
            <span>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <span>
              {currentVideoIndex + 1}/{videos?.length}
            </span>
          </div>
        </div>
        <QuestionPanel onPauseVideo={pauseVideo} />
      </div>
    );
  }
);

VideoPanel.displayName = "VideoPanel";

export default VideoPanel;
