import { createSlice } from '@reduxjs/toolkit';
import { loginThunk, logoutThunk } from '../thunks/authThunk';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Action synchrone pour restaurer la session
    restoreSession: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erreur de connexion';
      })
    // Logout
      .addCase(logoutThunk.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { restoreSession } = authSlice.actions;
export default authSlice.reducer;
