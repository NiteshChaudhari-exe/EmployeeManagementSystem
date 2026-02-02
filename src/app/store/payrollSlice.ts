// Payroll Slice for Redux Store

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { PayrollRecord } from '@/app/types';
import { payrollService } from '@/app/services/payrollService';

interface PayrollState {
  records: PayrollRecord[];
  selectedRecord: PayrollRecord | null;
  loading: boolean;
  error: string | null;
  total: number;
}

const initialState: PayrollState = {
  records: [],
  selectedRecord: null,
  loading: false,
  error: null,
  total: 0,
};

// Async Thunks

export const fetchPayrollRecords = createAsyncThunk(
  'payroll/fetchPayrollRecords',
  async (_, { rejectWithValue }) => {
    try {
      const response = await payrollService.getAll();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch payroll records'
      );
    }
  }
);

export const createPayrollRecord = createAsyncThunk(
  'payroll/createPayrollRecord',
  async (data: Omit<PayrollRecord, '_id'>, { rejectWithValue }) => {
    try {
      const response = await payrollService.create(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create payroll record'
      );
    }
  }
);

export const generatePayroll = createAsyncThunk(
  'payroll/generatePayroll',
  async (
    { month, year }: { month: number; year: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await payrollService.generate({ month, year });
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to generate payroll'
      );
    }
  }
);

export const updatePayrollRecord = createAsyncThunk(
  'payroll/updatePayrollRecord',
  async (
    { id, data }: { id: string; data: Partial<PayrollRecord> },
    { rejectWithValue }
  ) => {
    try {
      const response = await payrollService.update(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update payroll record'
      );
    }
  }
);

export const deletePayrollRecord = createAsyncThunk(
  'payroll/deletePayrollRecord',
  async (id: string, { rejectWithValue }) => {
    try {
      await payrollService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete payroll record'
      );
    }
  }
);

// Slice

const payrollSlice = createSlice({
  name: 'payroll',
  initialState,
  reducers: {
    setSelectedRecord: (state, action: PayloadAction<PayrollRecord | null>) => {
      state.selectedRecord = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Payroll Records
    builder
      .addCase(fetchPayrollRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayrollRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.data || action.payload.records || [];
        state.total = state.records.length;
      })
      .addCase(fetchPayrollRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Payroll Record
    builder
      .addCase(createPayrollRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayrollRecord.fulfilled, (state, action) => {
        state.loading = false;
        const newRecord = action.payload.data || action.payload;
        state.records.unshift(newRecord);
        state.total++;
      })
      .addCase(createPayrollRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Generate Payroll
    builder
      .addCase(generatePayroll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generatePayroll.fulfilled, (state, action) => {
        state.loading = false;
        const generated = action.payload.data || action.payload;
        state.records = Array.isArray(generated) ? generated : [generated];
        state.total = state.records.length;
      })
      .addCase(generatePayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Payroll Record
    builder
      .addCase(updatePayrollRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePayrollRecord.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.data || action.payload;
        const index = state.records.findIndex((rec) => rec._id === updated._id);
        if (index !== -1) {
          state.records[index] = updated;
        }
      })
      .addCase(updatePayrollRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Payroll Record
    builder
      .addCase(deletePayrollRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePayrollRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.records = state.records.filter(
          (rec) => rec._id !== action.payload
        );
        state.total--;
      })
      .addCase(deletePayrollRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedRecord, clearError } = payrollSlice.actions;

export default payrollSlice.reducer;
