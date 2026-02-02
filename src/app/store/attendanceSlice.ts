// Attendance Slice for Redux Store

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { AttendanceRecord } from '@/app/types';
import { attendanceService } from '@/app/services/attendanceService';

interface AttendanceState {
  records: AttendanceRecord[];
  selectedRecord: AttendanceRecord | null;
  loading: boolean;
  error: string | null;
  total: number;
  employeeId?: string;
  dateRange?: { startDate: string; endDate: string };
}

const initialState: AttendanceState = {
  records: [],
  selectedRecord: null,
  loading: false,
  error: null,
  total: 0,
};

// Async Thunks

export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAttendance',
  async (
    params: { employeeId?: string; startDate?: string; endDate?: string } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await attendanceService.getAll();
      let filtered = response.data || response.records || [];
      
      if (params.employeeId) {
        filtered = filtered.filter((r: any) => r.employeeId === params.employeeId);
      }
      if (params.startDate && params.endDate) {
        filtered = filtered.filter((r: any) => {
          const date = new Date(r.date);
          return date >= new Date(params.startDate!) && date <= new Date(params.endDate!);
        });
      }
      
      return { data: filtered, total: filtered.length };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch attendance'
      );
    }
  }
);

export const createAttendanceRecord = createAsyncThunk(
  'attendance/createAttendanceRecord',
  async (data: Omit<AttendanceRecord, '_id'>, { rejectWithValue }) => {
    try {
      const response = await attendanceService.create(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create attendance record'
      );
    }
  }
);

export const updateAttendanceRecord = createAsyncThunk(
  'attendance/updateAttendanceRecord',
  async (
    { id, data }: { id: string; data: Partial<AttendanceRecord> },
    { rejectWithValue }
  ) => {
    try {
      const response = await attendanceService.update(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update attendance record'
      );
    }
  }
);

export const deleteAttendanceRecord = createAsyncThunk(
  'attendance/deleteAttendanceRecord',
  async (id: string, { rejectWithValue }) => {
    try {
      await attendanceService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete attendance record'
      );
    }
  }
);

// Slice

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setSelectedRecord: (state, action: PayloadAction<AttendanceRecord | null>) => {
      state.selectedRecord = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Attendance
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.data || [];
        state.total = action.payload.total || state.records.length;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Attendance Record
    builder
      .addCase(createAttendanceRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAttendanceRecord.fulfilled, (state, action) => {
        state.loading = false;
        const newRecord = action.payload.data || action.payload;
        state.records.unshift(newRecord);
        state.total++;
      })
      .addCase(createAttendanceRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Attendance Record
    builder
      .addCase(updateAttendanceRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAttendanceRecord.fulfilled, (state, action) => {
        state.loading = false;
        const updatedRecord = action.payload.data || action.payload;
        const index = state.records.findIndex(
          (rec) => rec._id === updatedRecord._id
        );
        if (index !== -1) {
          state.records[index] = updatedRecord;
        }
      })
      .addCase(updateAttendanceRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Attendance Record
    builder
      .addCase(deleteAttendanceRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAttendanceRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.records = state.records.filter(
          (rec) => rec._id !== action.payload
        );
        state.total--;
      })
      .addCase(deleteAttendanceRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedRecord, clearError } = attendanceSlice.actions;

export default attendanceSlice.reducer;
