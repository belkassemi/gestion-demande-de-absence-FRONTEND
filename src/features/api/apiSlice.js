import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: [
    'AbsenceRequest',
    'AbsenceType',
    'User',
    'Department',
    'Approval',
    'Profile',
    'ChefRequests',
    'RhRequests',
    'DirecteurRequests',
    'Stats',
  ],
  endpoints: () => ({}),
});
