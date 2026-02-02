// Leave Slice for Redux Store

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { LeaveRequest, LeaveBalance } from '@/app/types';
import { leaveService } from '@/app/services/leaveService';

interface LeaveState {
  requests: LeaveRequest[];
  balances: LeaveBalance[];
  selectedRequest: LeaveRequest | null;
  loading: boolean;
  error: string | null;
  total: number;
}

const initialState: LeaveState = {
  requests: [],
  balances: [],
  selectedRequest: null,
  loading: false,
  error: null,
  total: 0,
};

// Async Thunks

export const fetchLeaveRequests = createAsyncThunk(
  'leaves/fetchLeaveRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await leaveService.getAll();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch leave requests'
      );
    }
  }
);

export const createLeaveRequest = createAsyncThunk(
  'leaves/createLeaveRequest',
  async (data: Omit<LeaveRequest, '_id'>, { rejectWithValue }) => {
    try {
      const response = await leaveService.create(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create leave request'
      );
    }
  }
);

export const updateLeaveRequest = createAsyncThunk(
  'leaves/updateLeaveRequest',
  async (
    { id, data }: { id: string; data: Partial<LeaveRequest> },
    { rejectWithValue }
  ) => {
    try {
      const response = await leaveService.update(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update leave request'
      );
    }
  }
);

export const approveLeaveRequest = createAsyncThunk(
  'leaves/approveLeaveRequest',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await leaveService.approve(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to approve leave request'
      );
    }
  }
);

export const rejectLeaveRequest = createAsyncThunk(
  'leaves/rejectLeaveRequest',
  async (
    { id, reason }: { id: string; reason: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await leaveService.reject(id, reason);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to reject leave request'
      );
    }
  }
);

export const deleteLeaveRequest = createAsyncThunk(
  'leaves/deleteLeaveRequest',
  async (id: string, { rejectWithValue }) => {
    try {
      await leaveService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete leave request'
      );
    }
  }
);

// Slice

const leaveSlice = createSlice({
  name: 'leaves',
  initialState,
  reducers: {
    setSelectedRequest: (state, action: PayloadAction<LeaveRequest | null>) => {
      state.selectedRequest = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Leave Requests
    builder
      .addCase(fetchLeaveRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload.data || action.payload.requests || [];
        state.total = state.requests.length;
      })
      .addCase(fetchLeaveRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Leave Request
    builder
      .addCase(createLeaveRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLeaveRequest.fulfilled, (state, action) => {
        state.loading = false;
        const newRequest = action.payload.data || action.payload;
        state.requests.unshift(newRequest);
        state.total++;
      })
      .addCase(createLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Leave Request
    builder
      .addCase(updateLeaveRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLeaveRequest.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.data || action.payload;
        const index = state.requests.findIndex((req) => req._id === updated._id);
        if (index !== -1) {
          state.requests[index] = updated;
        }
      })
      .addCase(updateLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Approve Leave Request
    builder
      .addCase(approveLeaveRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveLeaveRequest.fulfilled, (state, action) => {
        state.loading = false;
        const approved = action.payload.data || action.payload;
        const index = state.requests.findIndex((req) => req._id === approved._id);
        if (index !== -1) {
          state.requests[index] = approved;
        }
      })
      .addCase(approveLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Reject Leave Request
    builder
      .addCase(rejectLeaveRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectLeaveRequest.fulfilled, (state, action) => {
        state.loading = false;
        const rejected = action.payload.data || action.payload;
        const index = state.requests.findIndex((req) => req._id === rejected._id);
        if (index !== -1) {
          state.requests[index] = rejected;
        }
      })
      .addCase(rejectLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Leave Request
    builder
      .addCase(deleteLeaveRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLeaveRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = state.requests.filter(
          (req) => req._id !== action.payload
        );
        state.total--;
      })
      .addCase(deleteLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedRequest, clearError } = leaveSlice.actions;

export default leaveSlice.reducer;
