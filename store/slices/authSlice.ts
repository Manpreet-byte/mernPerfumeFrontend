import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import type { AuthState, User } from '../types';

type AuthResponse = { user: User; token: string };

const getStoredToken = () => (typeof window === 'undefined' ? null : localStorage.getItem('aurelia-token'));

const initialState: AuthState = {
  user: null,
  token: getStoredToken(),
  loading: false,
  error: null,
};

export const login = createAsyncThunk<AuthResponse, Record<string, string>, { rejectValue: string }>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('aurelia-token', data.token);
    return data;
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.message || 'We could not sign you in. Please check your details.');
  }
});

export const register = createAsyncThunk<AuthResponse, Record<string, string>, { rejectValue: string }>('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('aurelia-token', data.token);
    return data;
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.message || 'This email may already be registered.');
  }
});

export const fetchCurrentUser = createAsyncThunk<User, void, { rejectValue: string }>('auth/currentUser', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/profile');
    return data.user;
  } catch (error) {
    return rejectWithValue('Unable to load the current user.');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      if (typeof window !== 'undefined') localStorage.removeItem('aurelia-token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Sign in failed.';
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Registration failed.';
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unable to load user.';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
