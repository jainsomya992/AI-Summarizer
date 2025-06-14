import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const articleApi = createApi({
  reducerPath: 'articleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://article-extractor-and-summarizer.p.rapidapi.com/',
    prepareHeaders: (headers) => {
      headers.set('X-RapidAPI-Key', '02f6340c30msh1df5363a327e0b5p17a0c3jsned3338cad07c');
      headers.set('X-RapidAPI-Host', 'article-extractor-and-summarizer.p.rapidapi.com')
      return headers
    }
  }),
  endpoints: (builder) => ({
    getSummary: builder.query({
      query: (params) => {
        const lengthMap = {
          short: 1,
          medium: 3,
          long: 5,
        };

        const lengthValue = lengthMap[params.lengthMode] || 3;

        return `/summarize?url=${encodeURIComponent(params.articleUrl)}&length=${lengthValue}&lang=${params.language}&engine=2`;

      },
    }),
  }),
})

export const { useLazyGetSummaryQuery } = articleApi;
