// Leave Management Slice

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { LeaveRequest, LeaveBalance } from '@/app/types';
import { mockLeaveRequests, mockLeaveBalances } from '@/app/data/mockData';

interface LeaveState {
  requests: LeaveRequest[];
  balances: LeaveBalance[];
  selectedRequest: LeaveRequest | null;
  loading: boolean;
  filter: {
    employeeId?: string;
    status?: string;
    leaveType?: string;
  };
}

const initialState: LeaveState = {
  requests: mockLeaveRequests,
  balances: mockLeaveBalances,
  selectedRequest: null,
  loading: false,
  filter: {},
};

const leaveSlice = createSlice({
  name: 'leaves',
  initialState,
  reducers: {
    addLeaveRequest: (state, action: PayloadAction<LeaveRequest>) => {
      state.requests.push(action.payload);
    },
    updateLeaveRequest: (state, action: PayloadAction<LeaveRequest>) => {
      const index = state.requests.findIndex((req) => req.id === action.payload.id);
      if (index !== -1) {
        state.requests[index] = action.payload;
      }
    },
    approveLeaveRequest: (state, action: PayloadAction<{ requestId: string; approvedBy: string; approvedDate: string }>) => {
      const request = state.requests.find((req) => req.id === action.payload.requestId);
      if (request) {
        request.status = 'approved';
        request.approvedBy = action.payload.approvedBy;
        request.approvedDate = action.payload.approvedDate;
      }
    },
    rejectLeaveRequest: (state, action: PayloadAction<{ requestId: string; rejectionReason: string }>) => {
      const request = state.requests.find((req) => req.id === action.payload.requestId);
      if (request) {
        request.status = 'rejected';
        request.rejectionReason = action.payload.rejectionReason;
      }
    },
    deleteLeaveRequest: (state, action: PayloadAction<string>) => {
      state.requests = state.requests.filter((req) => req.id !== action.payload);
    },
    updateLeaveBalance: (state, action: PayloadAction<LeaveBalance>) => {
      const index = state.balances.findIndex((bal) => bal.employeeId === action.payload.employeeId);
      if (index !== -1) {
        state.balances[index] = action.payload;
      } else {
        state.balances.push(action.payload);
      }
    },
    selectRequest: (state, action: PayloadAction<LeaveRequest | null>) => {
      state.selectedRequest = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setFilter: (state, action: PayloadAction<Partial<LeaveState['filter']>>) => {
      state.filter = { ...state.filter, ...action.payload };
    },
  },
});

export const { 
  addLeaveRequest, 
  updateLeaveRequest, 
  approveLeaveRequest, 
  rejectLeaveRequest, 
  deleteLeaveRequest, 
  updateLeaveBalance, 
  selectRequest, 
  setLoading, 
  setFilter 
} = leaveSlice.actions;
export default leaveSlice.reducer;
