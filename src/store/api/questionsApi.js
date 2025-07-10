import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Get environment variables with fallbacks
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ;
const PRESENTATION_ID = process.env.NEXT_PUBLIC_PRESENTATION_ID ;

console.log(API_BASE_URL, PRESENTATION_ID,"API_BASE_URL, PRESENTATION_ID")

export const questionsApi = createApi({
  reducerPath: 'questionsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      // Add any auth headers here if needed
      // headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Question'],
  endpoints: (builder) => ({
    // Get quiz data
    getQuiz: builder.query({
      query: () => `presentations/${PRESENTATION_ID}/quiz`,
      providesTags: ['Question'],
    }),
    
    // Submit a new question
    submitQuestion: builder.mutation({
      query: (questionData) => ({
        url: `qa/${questionData.quiz_id || PRESENTATION_ID}`,
        method: 'POST',
        body: questionData,
      }),
      invalidatesTags: ['Question'],
    }),
    
  
  }),
});

export const {
  useGetQuizQuery,
  useSubmitQuestionMutation,
} = questionsApi;
