// Updated AnswerSection.jsx
import { setIsPlaying } from "@/store/features/videoSlice";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AnswerSection = ({ answer, audioLink = "", loading }) => {
  const { currentPlayingAudioId } = useSelector((state) => state.video);
  const audioRef = useRef(null);
  const dispatch = useDispatch();
  const audioId = useRef(`audio-${Math.random().toString(36).substr(2, 9)}`);
  const isPlaying = currentPlayingAudioId === audioId.current;

  useEffect(() => {
    if (audioRef.current) {
      const handlePlay = () => {
        // Pause any other playing audio
        document.querySelectorAll('audio').forEach(audio => {
          if (audio !== audioRef.current && !audio.paused) {
            audio.pause();
          }
        });
        dispatch(setIsPlaying({ playing: true, audioId: audioId.current }));
      };
      const handlePause = () => dispatch(setIsPlaying({ playing: false, audioId: null }));
      const handleEnd = () => dispatch(setIsPlaying({ playing: false, audioId: null }));

      audioRef.current.addEventListener("play", handlePlay);
      audioRef.current.addEventListener("pause", handlePause);
      audioRef.current.addEventListener("ended", handleEnd);

      // Auto-play when audio loads
      const playAudio = async () => {
        try {
          await audioRef.current.play();
        } catch (error) {
          console.log("Error playing audio:", error);
        }
      };

      playAudio();

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("play", handlePlay);
          audioRef.current.removeEventListener("pause", handlePause);
          audioRef.current.removeEventListener("ended", handleEnd);
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, [audioLink]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Pause any other playing audio before playing this one
        document.querySelectorAll('audio').forEach(audio => {
          if (audio !== audioRef.current && !audio.paused) {
            audio.pause();
          }
        });
        audioRef.current.play();
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {audioLink ? (
        <div className="flex items-center space-x-2 mb-1">
          <button
            onClick={toggleAudio}
            className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <span className="text-blue-600">⏸️</span>
            ) : (
              <span className="text-blue-600">▶️</span>
            )}
          </button>
          {isPlaying && (
            <div className="inline-block w-6 h-6 bg-blue-600 rounded-full animate-[pulse_1.5s_infinite]"></div>
          )}
          <span className="text-sm text-gray-500">
            {isPlaying ? "Playing answer..." : "Listen to answer"}
          </span>
          <audio
            ref={audioRef}
            src={audioLink}
            className="hidden"
            preload="none"
          />
        </div>
      ) : null}
      <div className="text-gray-700">{answer}</div>
    </div>
  );
};

export default AnswerSection;
