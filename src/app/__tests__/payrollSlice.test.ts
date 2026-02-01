import payrollReducer, { addPayrollRecord, updatePayrollRecord, deletePayrollRecord } from '../store/payrollSlice';

describe('payrollSlice', () => {
  const initialState = {
    records: [],
    selectedRecord: null,
    loading: false,
    filter: {},
  };

  it('should handle addPayrollRecord', () => {
    const newRecord = { id: 'pay-001', employeeId: 'emp-001', month: 'February', year: 2026, basicSalary: 800, allowances: 200, deductions: 0, netSalary: 1000, status: 'pending' as const, createdAt: '2026-02-01T00:00:00Z', updatedAt: '2026-02-01T00:00:00Z' };
    const state = payrollReducer(initialState, addPayrollRecord(newRecord));
    expect(state.records).toContainEqual(newRecord);
  });

  it('should handle updatePayrollRecord', () => {
    const startState = { ...initialState, records: [{ id: 'pay-001', employeeId: 'emp-001', month: 'February', year: 2026, basicSalary: 800, allowances: 200, deductions: 0, netSalary: 1000, status: 'pending' as const, createdAt: '2026-02-01T00:00:00Z', updatedAt: '2026-02-01T00:00:00Z' }] };
    const updated = { ...startState.records[0], netSalary: 1200 };
    const state = payrollReducer(startState, updatePayrollRecord(updated));
    expect(state.records[0].netSalary).toBe(1200);
  });

  it('should handle deletePayrollRecord', () => {
    const startState2 = { ...initialState, records: [{ id: 'pay-001', employeeId: 'emp-001', month: 'February', year: 2026, basicSalary: 800, allowances: 200, deductions: 0, netSalary: 1000, status: 'pending' as const, createdAt: '2026-02-01T00:00:00Z', updatedAt: '2026-02-01T00:00:00Z' }] };
    const state = payrollReducer(startState2, deletePayrollRecord('pay-001'));
    expect(state.records.length).toBe(0);
  });
});
