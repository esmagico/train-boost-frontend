import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentVideoIndex: 0,
  currentSlide: 1,
  isQuestionMode: false,
  questionPanelPptSlide: 1,
  question: "",
  isPlaying: false,
  currentPlayingAudioId: null,
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
  },
});

export const {
  setCurrentVideoIndex,
  setCurrentSlide,
  setIsQuestionMode,
  setQuestionPanelPptSlide,
  setQuestion,
  setIsPlaying,
} = videoSlice.actions;
export default videoSlice.reducer;
