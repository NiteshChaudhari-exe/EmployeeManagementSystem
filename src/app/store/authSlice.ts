// Authentication Slice for Redux Store

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '@/app/types';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

// Load auth state from localStorage
const loadAuthFromStorage = (): AuthState => {
  try {
    const storedAuth = localStorage.getItem('ems_auth');
    if (storedAuth) {
      return JSON.parse(storedAuth);
    }
  } catch (error) {
    console.error('Failed to load auth from storage:', error);
  }
  return initialState;
};

// Save auth state to localStorage
const saveAuthToStorage = (state: AuthState) => {
  try {
    localStorage.setItem('ems_auth', JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save auth to storage:', error);
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadAuthFromStorage(),
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      saveAuthToStorage(state);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('ems_auth');
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      saveAuthToStorage(state);
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
