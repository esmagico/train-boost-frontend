import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentQuestion: null,
  isQuestionPanelOpen: false,
  questions: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setCurrentQuestion: (state, action) => {
      state.currentQuestion = action.payload;
    },
    toggleQuestionPanel: (state) => {
      state.isQuestionPanelOpen = !state.isQuestionPanelOpen;
    },
    setQuestions: (state, action) => {
      state.questions = action.payload;
    },
    addQuestion: (state, action) => {
      state.questions.unshift(action.payload);
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCurrentQuestion,
  toggleQuestionPanel,
  setQuestions,
  addQuestion,
  setStatus,
  setError,
} = questionsSlice.actions;

export const selectCurrentQuestion = (state) => state.questions.currentQuestion;
export const selectIsQuestionPanelOpen = (state) => state.questions.isQuestionPanelOpen;
export const selectAllQuestions = (state) => state.questions.questions;
export const selectQuestionsStatus = (state) => state.questions.status;
export const selectQuestionsError = (state) => state.questions.error;

export default questionsSlice.reducer;
