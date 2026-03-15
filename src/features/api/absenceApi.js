import { apiSlice } from './apiSlice';

export const absenceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // ── Auth ─────────────────────────────────────────────────────────────────
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({ url: '/logout', method: 'POST' }),
    }),

    // ── Profile ──────────────────────────────────────────────────────────────
    getProfile: builder.query({
      query: () => '/profile',
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({ url: '/profile', method: 'PUT', body: data }),
      invalidatesTags: ['Profile'],
    }),
    changePassword: builder.mutation({
      query: (data) => ({ url: '/profile/change-password', method: 'POST', body: data }),
    }),

    // ── Absence Types ─────────────────────────────────────────────────────────
    getAbsenceTypes: builder.query({
      query: () => '/absence-types',
      providesTags: ['AbsenceType'],
    }),

    // ── Absence Requests (employee) ───────────────────────────────────────────
    getMyRequests: builder.query({
      query: (params = {}) => ({ url: '/absence-requests', params }),
      providesTags: ['AbsenceRequest'],
    }),
    getMyStats: builder.query({
      query: () => '/absence-requests/my-stats',
      providesTags: ['Stats'],
    }),
    getRequest: builder.query({
      query: (id) => `/absence-requests/${id}`,
      providesTags: (_res, _err, id) => [{ type: 'AbsenceRequest', id }],
    }),
    createRequest: builder.mutation({
      query: (data) => ({ url: '/absence-requests', method: 'POST', body: data }),
      invalidatesTags: ['AbsenceRequest', 'Stats'],
    }),
    updateRequest: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/absence-requests/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['AbsenceRequest', 'Stats'],
    }),
    cancelRequest: builder.mutation({
      query: (id) => ({ url: `/absence-requests/${id}/cancel`, method: 'POST' }),
      invalidatesTags: ['AbsenceRequest', 'Stats', 'ChefRequests'],
    }),

    // ── Chef ──────────────────────────────────────────────────────────────────
    getChefPendingRequests: builder.query({
      query: () => '/chef/pending-requests',
      providesTags: ['ChefRequests'],
    }),
    getChefRequest: builder.query({
      query: (id) => `/chef/requests/${id}`,
    }),
    reviewChefRequest: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/chef/requests/${id}/review`, method: 'POST', body: data }),
      invalidatesTags: ['ChefRequests', 'AbsenceRequest'],
    }),
    getTeamCalendar: builder.query({
      query: (params = {}) => ({ url: '/chef/team-calendar', params }),
      providesTags: ['ChefRequests'],
    }),
    getTeamHistory: builder.query({
      query: (params = {}) => ({ url: '/chef/team-history', params }),
    }),

    // ── RH ────────────────────────────────────────────────────────────────────
    getRhPendingRequests: builder.query({
      query: () => '/rh/pending-requests',
      providesTags: ['RhRequests'],
    }),
    reviewRhRequest: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/rh/requests/${id}/review`, method: 'POST', body: data }),
      invalidatesTags: ['RhRequests', 'AbsenceRequest'],
    }),
    getEmployeeBalances: builder.query({
      query: (params = {}) => ({ url: '/rh/employees/balances', params }),
      providesTags: ['Stats'],
    }),
    getRhStatistics: builder.query({
      query: (params = {}) => ({ url: '/rh/statistics', params }),
      providesTags: ['Stats'],
    }),
    getExportUrl: builder.query({
      query: (params = {}) => ({ url: '/rh/reports/export', params, responseHandler: 'blob' }),
    }),

    // ── Directeur ─────────────────────────────────────────────────────────────
    getDirecteurPendingRequests: builder.query({
      query: () => '/directeur/pending-requests',
      providesTags: ['DirecteurRequests'],
    }),
    reviewDirecteurRequest: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/directeur/requests/${id}/review`, method: 'POST', body: data }),
      invalidatesTags: ['DirecteurRequests', 'AbsenceRequest'],
    }),
    getDirecteurDashboard: builder.query({
      query: () => '/directeur/dashboard',
      providesTags: ['Stats'],
    }),
    getDirecteurStatistics: builder.query({
      query: (params = {}) => ({ url: '/directeur/statistics', params }),
      providesTags: ['Stats'],
    }),

    // ── Admin – Users ─────────────────────────────────────────────────────────
    getUsers: builder.query({
      query: (params = {}) => ({ url: '/admin/users', params }),
      providesTags: ['User'],
    }),
    createUser: builder.mutation({
      query: (data) => ({ url: '/admin/users', method: 'POST', body: data }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/admin/users/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({ url: `/admin/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['User'],
    }),

    // ── Admin – Departments ───────────────────────────────────────────────────
    getDepartments: builder.query({
      query: () => '/admin/departments',
      providesTags: ['Department'],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetAbsenceTypesQuery,
  useGetMyRequestsQuery,
  useGetMyStatsQuery,
  useGetRequestQuery,
  useCreateRequestMutation,
  useUpdateRequestMutation,
  useCancelRequestMutation,
  useGetChefPendingRequestsQuery,
  useGetChefRequestQuery,
  useReviewChefRequestMutation,
  useGetTeamCalendarQuery,
  useGetTeamHistoryQuery,
  useGetRhPendingRequestsQuery,
  useReviewRhRequestMutation,
  useGetEmployeeBalancesQuery,
  useGetRhStatisticsQuery,
  useGetExportUrlQuery,
  useGetDirecteurPendingRequestsQuery,
  useReviewDirecteurRequestMutation,
  useGetDirecteurDashboardQuery,
  useGetDirecteurStatisticsQuery,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetDepartmentsQuery,
} = absenceApi;
