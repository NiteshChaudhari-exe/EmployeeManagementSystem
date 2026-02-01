// Payroll Management Slice

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { PayrollRecord } from '@/app/types';
import { mockPayrollRecords } from '@/app/data/mockData';

interface PayrollState {
  records: PayrollRecord[];
  selectedRecord: PayrollRecord | null;
  loading: boolean;
  filter: {
    employeeId?: string;
    status?: string;
    month?: string;
    year?: number;
  };
}

const initialState: PayrollState = {
  records: mockPayrollRecords,
  selectedRecord: null,
  loading: false,
  filter: {},
};

const payrollSlice = createSlice({
  name: 'payroll',
  initialState,
  reducers: {
    addPayrollRecord: (state, action: PayloadAction<PayrollRecord>) => {
      state.records.push(action.payload);
    },
    updatePayrollRecord: (state, action: PayloadAction<PayrollRecord>) => {
      const index = state.records.findIndex((rec) => rec.id === action.payload.id);
      if (index !== -1) {
        state.records[index] = action.payload;
      }
    },
    markPayrollAsPaid: (state, action: PayloadAction<{ recordId: string; paidDate: string }>) => {
      const record = state.records.find((rec) => rec.id === action.payload.recordId);
      if (record) {
        record.status = 'paid';
        record.paidDate = action.payload.paidDate;
      }
    },
    deletePayrollRecord: (state, action: PayloadAction<string>) => {
      state.records = state.records.filter((rec) => rec.id !== action.payload);
    },
    selectRecord: (state, action: PayloadAction<PayrollRecord | null>) => {
      state.selectedRecord = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setFilter: (state, action: PayloadAction<Partial<PayrollState['filter']>>) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    bulkGeneratePayroll: (state, action: PayloadAction<PayrollRecord[]>) => {
      const filteredRecords = state.records.filter(
        (rec) => !(action.payload.some((newRec) => newRec.employeeId === rec.employeeId && newRec.month === rec.month && newRec.year === rec.year))
      );
      state.records = [...filteredRecords, ...action.payload];
    },
  },
});

export const { 
  addPayrollRecord, 
  updatePayrollRecord, 
  markPayrollAsPaid, 
  deletePayrollRecord, 
  selectRecord, 
  setLoading, 
  setFilter,
  bulkGeneratePayroll,
} = payrollSlice.actions;
export default payrollSlice.reducer;
