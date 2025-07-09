import React, { useState, useRef, useEffect } from "react";

const dummyVideos = [
  {
    slide:1,
    trainer_video: [
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    ],
    thumb:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
    title: "Big Buck Bunny",
  },
  {
    slide:2,
    trainer_video: [
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    ],
    thumb:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    title: "Elephant Dream",
  },
  {
    slide:3,
    trainer_video: [
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    ],
    thumb:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg",
    title: "Sintel",
  },
  {
    slide:4,
    trainer_video: [
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    ],
    thumb:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg",
    title: "For Bigger Blazes",
  },
  {
    slide:5,
    trainer_video: [
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    ],
    thumb:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg",
    title: "For Bigger Escape",
  },
]

const VideoPanel = ({videos=dummyVideos}) => {
  

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);

  // Handle video end
  const handleVideoEnd = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex((prev) => prev + 1);
    }
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
    setCurrentVideoIndex(index);
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
    <div className="flex flex-col w-[30%] h-full">
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
          {/* {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                className="p-3 bg-black/50 rounded-full text-white"
                onClick={togglePlayPause}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          )} */}
          {/* <div className="absolute bottom-10 left-0 right-0 h-1 bg-gray-600/50 mx-2 cursor-pointer" onClick={handleProgressBarClick}>
            <div 
              className="h-full bg-red-500" 
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm flex justify-between items-center">
            <span>{videos[currentVideoIndex]?.title}</span>
            <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
          </div> */}
        </div>
      </div>

      <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 flex-1">
        <h3 className="font-medium mb-3">
          Video Playlist ({videos.length} videos)
        </h3>
        <div className="space-y-3 text-sm max-h-[calc(100vh-520px)] overflow-y-auto">
          {videos.map((video, index) => (
            <div
              key={index}
              className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                currentVideoIndex === index
                  ? "bg-blue-50 border-l-4 border-blue-500"
                  : "hover:bg-gray-50 border-l-4 border-transparent"
              }`}
              onClick={() => handleTranscriptClick(index)}
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
