import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Get environment variables with fallbacks
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://cf.be.trainboost.esmagico.com/api";

export const questionsApi = createApi({
  reducerPath: 'questionsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json');
      headers.set('Authorization', 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJqNi11YVl0clpHUWE2LWlOS3FlNTJvTUhGUGlWRWdMSmdkOHhCX2ZxeFFBIn0.eyJleHAiOjE3NTU4NDQ0NTYsImlhdCI6MTc1NTg0NDE1NiwianRpIjoiZDE4YjdiMjctYjI5ZC00ZGZlLWEyZDAtNTdkOTE3MzQwODU5IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3JlYWxtcy9UcmFpbmJvb3N0IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjY4YzgxZGMyLTY0ZmMtNDY2Ni04ZTQyLTMxZTEyOWJhM2U5OCIsInR5cCI6IkJlYXJlciIsImF6cCI6Im1hZ2ljLWNsaWVudCIsInNlc3Npb25fc3RhdGUiOiI2MTk4NzVkYi1mOWUyLTQ0ZjEtODkzZi1jZjI1M2FjZTI5ODgiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIi8qIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLXRyYWluYm9vc3QiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsibWFnaWMtY2xpZW50Ijp7InJvbGVzIjpbImdycC1pc2Itc3R1ZGVudHMiLCJncnAtaXNiLWZhY3VsdHkiLCJvcmctaXNiIiwiYWRtaW4iXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsInNpZCI6IjYxOTg3NWRiLWY5ZTItNDRmMS04OTNmLWNmMjUzYWNlMjk4OCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiS3JpdGlzaCBTaHVrbGEiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJrcml0aXNoc2h1a2xhIiwiZ2l2ZW5fbmFtZSI6IktyaXRpc2giLCJmYW1pbHlfbmFtZSI6IlNodWtsYSIsImVtYWlsIjoia3JpdGlzaC5zaHVrbGFAZXNtYWdpY28uaW4ifQ.kH1zOUkBce2Y3Zs_54D2wpz4GA9C2sRg6STtPUBO21l8CCuwtTicJ2Wf6DlUAGwhSXSzbOXincULk2IhWbXjoOzEGUPBwLqK52U0v4-JoIht_gbBzdo_aBYF8RYi3UYpclpwpx28UHC3YrLiFxKdq9Uf7K-vQCBsZ1p2eUaG5pvgnBVlkvQt-rL8_jlVLuT9W-cQnqx-Bip1c-x26RWBhO-oKrXYp3_XT4--mPwBOMqvtUHoG0oWYIMhAkq1Itv9Z_y9eKFR7pSO5BVEd0X4DXO4LO4ScrshIY6sU5wHt7GBweDYsrMeIWji5Ucb5tPazcqJ1bDwhZB0oxMi6FhInQ');
      return headers;
    },
  }),
  tagTypes: ['Question'],
  endpoints: (builder) => ({
    // Get quiz data
    getQuiz: builder.query({
      query: (presentationId) => `presentations/${presentationId}/quiz`,
      providesTags: ['Question'],
    }),

    getAllVideo: builder.query({
      query: (presentationId) => `presentations/${presentationId}/slides`,
      providesTags: ['Question'],
    }),

    getPresentations: builder.query({
      query: () => 'presentations',
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
  useGetPresentationsQuery,
} = questionsApi;
