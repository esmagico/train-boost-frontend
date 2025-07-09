import React, { useRef, useState, useEffect } from "react";

const VideoPanel = ({
  videoUrl = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  title = "Training Video",
  currentTime = 0,
  duration = 0,
  autoPlay = true,
  showControls = true,
  transcript = [
    { time: 0.01, text: "Welcome to today's training session.",img: "https://images.unsplash.com/photo-1571025707260-46884124bdee?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHB0fGVufDB8fDB8fHww" },
    { time: 100, text: "We'll be covering three main topics.", img: "https://media.istockphoto.com/id/1448628255/photo/presentation-business-people-and-meeting-with-woman-speaker-screen-with-ppt-of-revenue-stats.webp?a=1&b=1&s=612x612&w=0&k=20&c=wJRr2rqKEEKXd5x1r2ahgeGlXKWazXTcRvVKivsEkPA=" },
    { time: 150, text: "First, let's look at the market trends." },
    { time: 200, text: "As you can see on this chart..." },
    { time: 250, text: "The second topic is about our new product." },
    { time: 300, text: "Here are the key features we've added." },
    { time: 310, text: "Finally, we'll discuss implementation." },
    { time: 390, text: "Any questions so far?" },
  ],
  onTimeUpdate = () => {},
  className = "",
}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentVideoTime, setCurrentVideoTime] = useState(currentTime);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch((error) => {
        console.error("Error playing video:", error);
        setIsPlaying(false);
      });
    } else {
      video.pause();
    }
  }, [isPlaying]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentVideoTime(time);
      onTimeUpdate(time);
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleSeek = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentVideoTime(time);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const getCurrentTranscript = () => {
    // Find the most recent transcript entry based on current time
    let currentTranscript = "";
    for (let i = transcript.length - 1; i >= 0; i--) {
      if (currentVideoTime >= transcript[i].time) {
        currentTranscript = transcript[i].text;
        break;
      }
    }
    return currentTranscript;
  };

  return (
    <div className={`flex flex-col w-[30%] h-[calc(100vh-120px)] ${className}`}>
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-cover"
            onClick={togglePlayPause}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            autoPlay={autoPlay}
            muted={isMuted}
            controls={false}
          />

          {/* Video Overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            onClick={togglePlayPause}
          >
            {!isPlaying && (
              <button className="p-4 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            )}
          </div>

          {/* Custom Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            {/* Progress Bar */}
            <div
              className="w-full h-1.5 bg-gray-600 rounded-full mb-3 cursor-pointer"
              onClick={(e) => {
                const rect = e.target.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                handleSeek(pos * (duration || videoRef.current?.duration || 0));
              }}
            >
              <div
                className="h-full bg-blue-500 rounded-full relative"
                style={{
                  width: `${
                    (currentVideoTime /
                      (duration || videoRef.current?.duration || 1)) *
                    100
                  }%`,
                }}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="flex items-center justify-between text-white text-sm">
              <div className="flex items-center space-x-3">
                <button
                  onClick={togglePlayPause}
                  className="hover:opacity-80 transition-opacity"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2zm6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                <div className="flex items-center">
                  <button
                    onClick={toggleMute}
                    className="mr-1 hover:opacity-80"
                  >
                    {isMuted || volume === 0 ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 4L2.99 5.27 7 9.27v2.46l-2.5 1.9v2.12l4 4 1.5-1.5L5 16.5 3.5 18l4.5 4.5v-5.18l-2.5-1.9v-2.12l2.5-1.9V9.27L9 7.27V12h2v-1.73l2.49 2.49c-.01-.05-.02-.1-.02-.16 0-.55.23-1.05.59-1.41L14 8.73V12h2v-2.5l1.5-1.5V13h.13l4.11 4.11 1.27-1.27L4.27 4z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                      </svg>
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 accent-white"
                  />
                </div>

                <div className="text-xs text-gray-300">
                  {formatTime(currentVideoTime)} /{" "}
                  {formatTime(duration || videoRef.current?.duration || 0)}
                </div>
              </div>

              <button className="hover:opacity-80">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 3c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1s1-.45 1-1v-1c0-.55-.45-1-1-1zm0 15c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1s1-.45 1-1v-1c0-.55-.45-1-1-1zm10-9h-1c-.55 0-1 .45-1 1s.45 1 1 1h1c.55 0 1-.45 1-1s-.45-1-1-1zM4 12c0-.55-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1h1c.55 0 1-.45 1-1zm15.5 5.5c.28-.28.28-.72 0-1l-.71-.71c-.28-.28-.72-.28-1 0s-.28.72 0 1l.71.71c.28.28.72.28 1 0zM17.71 7.71c.28.28.72.28 1 0 .28-.28.28-.72 0-1l-.71-.71c-.28-.28-.72-.28-1 0s-.28.72 0 1l.71.71zM5.5 17.5c.28.28.72.28 1 0l.71-.71c.28-.28.28-.72 0-1s-.72-.28-1 0l-.71.71c-.28.28-.28.72 0 1zm.71-11.31c.28.28.28.72 0 1s-.72.28-1 0l-.71-.71c-.28-.28-.28-.72 0-1s.72-.28 1 0l.71.71z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <h3 className="mt-3 font-medium">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{getCurrentTranscript()}</p>
      </div>

      {/* Transcript Section */}
      <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 flex-1 h-[calc(100vh-520px)]">
        <h3 className="font-medium mb-3">Transcript</h3>
        <div className="space-y-3 text-sm max-h-[calc(100%-60px)] overflow-y-auto">
          {transcript.map((item, index) => (
            <p
              key={index}
              className={`p-2 rounded cursor-pointer transition-colors ${
                currentVideoTime >= item.time
                  ? "bg-blue-50 border-l-4 border-blue-500 font-[500]"
                  : "hover:bg-gray-50 border-l-4 border-transparent font-normal"
              }`}
              onClick={() => handleSeek(item.time)}
            >
              {formatTime(item.time)} - {item.text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPanel;
