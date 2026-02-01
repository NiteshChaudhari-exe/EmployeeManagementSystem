

import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/authSlice';
import { useAuth } from '../hooks/useAuth';

// Use .tsx for JSX

describe('useAuth hook', () => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: { user: null, token: null, isAuthenticated: false } },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  it('should return default values', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  // Add more tests as you implement real auth logic
});


describe('useAuth hook', () => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: { user: null, token: null, isAuthenticated: false } },
  });

  it('should return default values', () => {
    const wrapper = ({ children }: any) => (
      <Provider store={store}>{children}</Provider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  // Add more tests as you implement real auth logic
});
