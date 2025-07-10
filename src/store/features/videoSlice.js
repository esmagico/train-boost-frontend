import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentVideoIndex: 0,
  currentSlide: 1,
  isQuestionMode: false,
  questionPanelPptSlide: 1,
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
  },
});

export const { setCurrentVideoIndex, setCurrentSlide, setIsQuestionMode, setQuestionPanelPptSlide } =
  videoSlice.actions;
export default videoSlice.reducer;
