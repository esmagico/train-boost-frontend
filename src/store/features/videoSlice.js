import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentVideoIndex: 0,
  currentSlide: 1,
  isQuestionMode: false,
  questionPanelPptSlide: 1,
  question: "",
  isPlaying: false,
  currentPlayingAudioId: null,
  currentVideoTime: 0,
  isVideoPlaying: false,
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setCurrentVideoIndex: (state, action) => {
      state.currentVideoIndex = action.payload;
    },
    setCurrentSlide: (state, action) => {
      state.currentSlide = action.payload;
    },
    setIsQuestionMode: (state, action) => {
      state.isQuestionMode = action.payload;
    },
    setQuestionPanelPptSlide: (state, action) => {
      state.questionPanelPptSlide = action.payload;
    },
    setQuestion: (state, action) => {
      state.question = action.payload;
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload.playing;
      state.currentPlayingAudioId = action.payload.audioId || null;
    },
    setCurrentVideoTime: (state, action) => {
      state.currentVideoTime = action.payload;
    },
    setIsVideoPlaying: (state, action) => {
      state.isVideoPlaying = action.payload;
    },
  },
});

export const {
  setCurrentVideoIndex,
  setCurrentSlide,
  setIsQuestionMode,
  setQuestionPanelPptSlide,
  setQuestion,
  setIsPlaying,
  setCurrentVideoTime,
  setIsVideoPlaying,
} = videoSlice.actions;
export default videoSlice.reducer;
