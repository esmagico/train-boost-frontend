import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Get environment variables with fallbacks
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://cf.be.trainboost.esmagico.com/api";

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
      query: (presentationId) => `presentations/presentations/${presentationId}/quiz`,
      providesTags: ['Question'],
    }),

    getAllVideo: builder.query({
      query: (presentationId) => `presentations/presentations/${presentationId}/slides`,
      providesTags: ['Question'],
    }),
    
    // Submit a new question
    submitQuestion: builder.mutation({
      query: ({ presentationId, ...questionData }) => ({
        url: `qa/${presentationId}`,
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
  useGetAllVideoQuery,
} = questionsApi;
