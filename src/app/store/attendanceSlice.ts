// Attendance Management Slice

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AttendanceRecord } from '@/app/types';
import { mockAttendance } from '@/app/data/mockData';

interface AttendanceState {
  records: AttendanceRecord[];
  selectedRecord: AttendanceRecord | null;
  loading: boolean;
  filter: {
    employeeId?: string;
    dateRange?: {
      startDate: string;
      endDate: string;
    };
    status?: string;
  };
}

const initialState: AttendanceState = {
  records: mockAttendance,
  selectedRecord: null,
  loading: false,
  filter: {},
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    addAttendanceRecord: (state, action: PayloadAction<AttendanceRecord>) => {
      state.records.push(action.payload);
    },
    updateAttendanceRecord: (state, action: PayloadAction<AttendanceRecord>) => {
      const index = state.records.findIndex((rec) => rec.id === action.payload.id);
      if (index !== -1) {
        state.records[index] = action.payload;
      }
    },
    deleteAttendanceRecord: (state, action: PayloadAction<string>) => {
      state.records = state.records.filter((rec) => rec.id !== action.payload);
    },
    selectRecord: (state, action: PayloadAction<AttendanceRecord | null>) => {
      state.selectedRecord = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setFilter: (state, action: PayloadAction<Partial<AttendanceState['filter']>>) => {
      state.filter = { ...state.filter, ...action.payload };
    },
  },
});

export const { addAttendanceRecord, updateAttendanceRecord, deleteAttendanceRecord, selectRecord, setLoading, setFilter } = attendanceSlice.actions;
export default attendanceSlice.reducer;
