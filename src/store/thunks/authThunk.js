import { createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

// Thunk Login
export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authService.login(email, password);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Email ou mot de passe incorrect'
      );
    }
  }
);

// Thunk Logout
export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async () => {
    await authService.logout();
  }
);

// Thunk Register
export const registerThunk = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.register(userData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de l\'inscription'
      );
    }
  }
);
