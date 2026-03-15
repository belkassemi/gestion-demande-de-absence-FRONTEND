import { createSlice } from '@reduxjs/toolkit';

const TOKEN_KEY = 'absence_token';
const USER_KEY  = 'absence_user';

const initialState = {
  token: localStorage.getItem(TOKEN_KEY) || null,
  user: JSON.parse(localStorage.getItem(USER_KEY) || 'null'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      state.token = payload.token;
      state.user  = payload.user;
      localStorage.setItem(TOKEN_KEY, payload.token);
      localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
    },
    clearCredentials: (state) => {
      state.token = null;
      state.user  = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser  = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectUserRole     = (state) => state.auth.user?.role;
