import authReducer, { login, logout } from '../store/authSlice';

describe('authSlice', () => {
  const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
  };

  it('should handle login', () => {
    const user = { id: '1', email: 'admin@company.com', name: 'Admin', role: 'admin' as const };
    const token = 'test-token';
    const state = authReducer(initialState, login({ user, token }));
    expect(state.user).toEqual(user);
    expect(state.token).toBe(token);
    expect(state.isAuthenticated).toBe(true);
  });

  it('should handle logout', () => {
    const startState = { ...initialState, user: { id: '1', email: 'admin@company.com', name: 'Admin', role: 'admin' as const }, isAuthenticated: true };
    const state = authReducer(startState, logout());
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
