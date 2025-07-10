import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const questionsApi = createApi({
  reducerPath: 'questionsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/',
    prepareHeaders: (headers) => {
      // Add any auth headers here if needed
      // headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Question'],
  endpoints: (builder) => ({
    // Submit a new question
    submitQuestion: builder.mutation({
      query: (questionData) => ({
        url: 'questions',
        method: 'POST',
        body: questionData,
      }),
      invalidatesTags: ['Question'],
    }),
    
    // Get all questions
    // getQuestions: builder.query({
    //   query: () => 'questions',
    //   providesTags: (result = [], error, arg) => [
    //     'Question',
    //     ...result.map(({ id }) => ({ type: 'Question', id })),
    //   ],
    // }),
    
    // // Get a single question by ID
    // getQuestionById: builder.query({
    //   query: (id) => `questions/${id}`,
    //   providesTags: (result, error, id) => [{ type: 'Question', id }],
    // }),
  }),
});

export const {
  useSubmitQuestionMutation,
  // useGetQuestionsQuery,
  // useGetQuestionByIdQuery,
} = questionsApi;
