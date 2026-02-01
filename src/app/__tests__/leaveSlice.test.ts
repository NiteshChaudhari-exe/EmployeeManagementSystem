import leaveReducer, { addLeaveRequest, updateLeaveRequest, deleteLeaveRequest } from '../store/leaveSlice';

describe('leaveSlice', () => {
  const initialState = {
    requests: [],
    balances: [],
    selectedRequest: null,
    loading: false,
    filter: {},
  };

  it('should handle addLeaveRequest', () => {
    const newRequest = { id: 'leave-001', employeeId: 'emp-001', leaveType: 'sick' as const, startDate: '2026-02-01', endDate: '2026-02-02', days: 2, reason: 'Flu', status: 'pending' as const, appliedDate: '2026-01-31T00:00:00Z', createdAt: '2026-02-01T00:00:00Z', updatedAt: '2026-02-01T00:00:00Z' };
    const state = leaveReducer(initialState, addLeaveRequest(newRequest));
    expect(state.requests).toContainEqual(newRequest);
  });

  it('should handle updateLeaveRequest', () => {
    const startState = { ...initialState, requests: [{ id: 'leave-001', employeeId: 'emp-001', leaveType: 'sick' as const, startDate: '2026-02-01', endDate: '2026-02-02', days: 2, reason: 'Flu', status: 'pending' as const, appliedDate: '2026-01-31T00:00:00Z', createdAt: '2026-02-01T00:00:00Z', updatedAt: '2026-02-01T00:00:00Z' }] };
    const updated = { ...startState.requests[0], startDate: '2026-02-03' };
    const state = leaveReducer(startState, updateLeaveRequest(updated));
    expect(state.requests[0].startDate).toBe('2026-02-03');
  });

  it('should handle deleteLeaveRequest', () => {
    const startState2 = { ...initialState, requests: [{ id: 'leave-001', employeeId: 'emp-001', leaveType: 'sick' as const, startDate: '2026-02-01', endDate: '2026-02-02', days: 2, reason: 'Flu', status: 'pending' as const, appliedDate: '2026-01-31T00:00:00Z', createdAt: '2026-02-01T00:00:00Z', updatedAt: '2026-02-01T00:00:00Z' }] };
    const state = leaveReducer(startState2, deleteLeaveRequest('leave-001'));
    expect(state.requests.length).toBe(0);
  });
});
