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

    // ── Absence Requests (Employee) ───────────────────────────────────────────
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

    // ── Chef Service ──────────────────────────────────────────────────────────
    getChefPendingRequests: builder.query({
      query: () => '/chef-service/pending-requests',
      providesTags: ['ChefRequests'],
    }),
    getChefRequest: builder.query({
      query: (id) => `/chef-service/requests/${id}`,
      providesTags: (_res, _err, id) => [{ type: 'ChefRequests', id }],
    }),
    reviewChefRequest: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/chef-service/requests/${id}/review`, method: 'POST', body: data }),
      invalidatesTags: ['ChefRequests', 'AbsenceRequest'],
    }),
    getTeamCalendar: builder.query({
      query: (params = {}) => ({ url: '/chef-service/team-calendar', params }),
      providesTags: ['ChefRequests'],
    }),
    getTeamHistory: builder.query({
      query: (params = {}) => ({ url: '/chef-service/team-history', params }),
      providesTags: ['ChefRequests'],
    }),

    // ── Directeur ─────────────────────────────────────────────────────────────
    getDirecteurPendingRequests: builder.query({
      query: () => '/directeur/pending-requests',
      providesTags: ['DirecteurRequests'],
    }),
    getDirecteurRequest: builder.query({
      query: (id) => `/directeur/requests/${id}`,
      providesTags: (_res, _err, id) => [{ type: 'DirecteurRequests', id }],
    }),
    reviewDirecteurRequest: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/directeur/requests/${id}/review`, method: 'POST', body: data }),
      invalidatesTags: ['DirecteurRequests', 'AbsenceRequest', 'Stats'],
    }),
    getDirecteurCalendar: builder.query({
      query: (params = {}) => ({ url: '/directeur/calendar', params }),
      providesTags: ['DirecteurRequests'],
    }),
    getDirecteurDashboard: builder.query({
      query: () => '/directeur/dashboard',
      providesTags: ['Stats'],
    }),
    getDirecteurStatistics: builder.query({
      query: (params = {}) => ({ url: '/directeur/statistics', params }),
      providesTags: ['Stats'],
    }),
    getDirecteurExport: builder.query({
      query: (params = {}) => ({
        url: '/directeur/reports/export',
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // ── Admin – Users ─────────────────────────────────────────────────────────
    getUsers: builder.query({
      query: (params = {}) => ({ url: '/admin/users', params }),
      providesTags: ['User'],
    }),
    getUser: builder.query({
      query: (id) => `/admin/users/${id}`,
      providesTags: (_res, _err, id) => [{ type: 'User', id }],
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
      query: (params = {}) => ({ url: '/admin/departments', params }),
      providesTags: ['Department'],
    }),
    createDepartment: builder.mutation({
      query: (data) => ({ url: '/admin/departments', method: 'POST', body: data }),
      invalidatesTags: ['Department'],
    }),
    updateDepartment: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/admin/departments/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Department'],
    }),
    deleteDepartment: builder.mutation({
      query: (id) => ({ url: `/admin/departments/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Department'],
    }),

    // ── Admin – Services ──────────────────────────────────────────────────────
    getServices: builder.query({
      query: (params = {}) => ({ url: '/admin/services', params }),
      providesTags: ['Service'],
    }),
    createService: builder.mutation({
      query: (data) => ({ url: '/admin/services', method: 'POST', body: data }),
      invalidatesTags: ['Service'],
    }),
    updateService: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/admin/services/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Service'],
    }),
    deleteService: builder.mutation({
      query: (id) => ({ url: `/admin/services/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Service'],
    }),

    // ── Admin – Absence Types (Write) ─────────────────────────────────────────
    createAbsenceType: builder.mutation({
      query: (data) => ({ url: '/admin/absence-types', method: 'POST', body: data }),
      invalidatesTags: ['AbsenceType'],
    }),
    updateAbsenceType: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/admin/absence-types/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['AbsenceType'],
    }),
    deleteAbsenceType: builder.mutation({
      query: (id) => ({ url: `/admin/absence-types/${id}`, method: 'DELETE' }),
      invalidatesTags: ['AbsenceType'],
    }),

    // ── Admin – Dashboard & Global Data ──────────────────────────────────────
    getAdminCalendar: builder.query({
      query: (params = {}) => ({ url: '/admin/calendar', params }),
      providesTags: ['AbsenceRequest'],
    }),
    getAdminDashboard: builder.query({
      query: () => '/admin/dashboard',
      providesTags: ['Stats'],
    }),
    getAdminStatistics: builder.query({
      query: (params = {}) => ({ url: '/admin/statistics', params }),
      providesTags: ['Stats'],
    }),
    getAdminAllRequests: builder.query({
      query: (params = {}) => ({ url: '/admin/all-requests', params }),
      providesTags: ['AbsenceRequest'],
    }),
    getAdminAllUsersStats: builder.query({
      query: () => '/admin/all-users-stats',
      providesTags: ['Stats'],
    }),
    getAdminExport: builder.query({
      query: (params = {}) => ({
        url: '/admin/reports/export',
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // ── Admin – Audit Logs ────────────────────────────────────────────────────
    getAuditLogs: builder.query({
      query: (params = {}) => ({ url: '/admin/audit-logs', params }),
      providesTags: ['AuditLog'],
    }),

    // ── Notifications ─────────────────────────────────────────────────────────
    getNotifications: builder.query({
      query: () => '/notifications',
      providesTags: ['Notification'],
    }),
    markNotificationRead: builder.mutation({
      query: (id) => ({ url: `/notifications/${id}/read`, method: 'POST' }),
      invalidatesTags: ['Notification'],
    }),
    markAllNotificationsRead: builder.mutation({
      query: () => ({ url: '/notifications/read-all', method: 'POST' }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  // Auth
  useLoginMutation,
  useLogoutMutation,
  // Profile
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  // Absence Types
  useGetAbsenceTypesQuery,
  useCreateAbsenceTypeMutation,
  useUpdateAbsenceTypeMutation,
  useDeleteAbsenceTypeMutation,
  // Absence Requests (Employee)
  useGetMyRequestsQuery,
  useGetMyStatsQuery,
  useGetRequestQuery,
  useCreateRequestMutation,
  useUpdateRequestMutation,
  useCancelRequestMutation,
  // Chef Service
  useGetChefPendingRequestsQuery,
  useGetChefRequestQuery,
  useReviewChefRequestMutation,
  useGetTeamCalendarQuery,
  useGetTeamHistoryQuery,
  // Directeur
  useGetDirecteurCalendarQuery,
  useGetDirecteurPendingRequestsQuery,
  useGetDirecteurRequestQuery,
  useReviewDirecteurRequestMutation,
  useGetDirecteurDashboardQuery,
  useGetDirecteurStatisticsQuery,
  useGetDirecteurExportQuery,
  // Admin – Users
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  // Admin – Departments
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  // Admin – Services
  useGetServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  // Admin – Dashboard & Data
  useGetAdminCalendarQuery,
  useGetAdminDashboardQuery,
  useGetAdminStatisticsQuery,
  useGetAdminAllRequestsQuery,
  useGetAdminAllUsersStatsQuery,
  useGetAdminExportQuery,
  // Admin – Audit Logs
  useGetAuditLogsQuery,
  // Notifications
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = absenceApi;
