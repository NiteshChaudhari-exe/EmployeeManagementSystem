import attendanceReducer, { addAttendanceRecord, updateAttendanceRecord, deleteAttendanceRecord } from '../store/attendanceSlice';

describe('attendanceSlice', () => {
  const initialState = {
    records: [],
    selectedRecord: null,
    loading: false,
    filter: {},
  };

  it('should handle addAttendanceRecord', () => {
    const newRecord = { id: 'att-001', employeeId: 'emp-001', date: '2026-02-01', status: 'present' as const, checkIn: '09:00', checkOut: '18:00', createdAt: '2026-02-01T09:00:00Z', updatedAt: '2026-02-01T18:00:00Z' };
    const state = attendanceReducer(initialState, addAttendanceRecord(newRecord));
    expect(state.records).toContainEqual(newRecord);
  });

  it('should handle updateAttendanceRecord', () => {
    const startState = { ...initialState, records: [{ id: 'att-001', employeeId: 'emp-001', date: '2026-02-01', status: 'present' as const, checkIn: '09:00', checkOut: '18:00', createdAt: '2026-02-01T09:00:00Z', updatedAt: '2026-02-01T18:00:00Z' }] };
    const updated = { ...startState.records[0], date: '2026-02-02' };
    const state = attendanceReducer(startState, updateAttendanceRecord(updated));
    expect(state.records[0].date).toBe('2026-02-02');
  });

  it('should handle deleteAttendanceRecord', () => {
    const startState2 = { ...initialState, records: [{ id: 'att-001', employeeId: 'emp-001', date: '2026-02-01', status: 'present' as const, checkIn: '09:00', checkOut: '18:00', createdAt: '2026-02-01T09:00:00Z', updatedAt: '2026-02-01T18:00:00Z' }] };
    const state = attendanceReducer(startState2, deleteAttendanceRecord('att-001'));
    expect(state.records.length).toBe(0);
  });
});
