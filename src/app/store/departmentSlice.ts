// Department Slice for Redux Store

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Department } from '@/app/types';
import { departmentService } from '@/app/services/departmentService';

interface DepartmentState {
  departments: Department[];
  selectedDepartment: Department | null;
  loading: boolean;
  error: string | null;
  total: number;
}

const initialState: DepartmentState = {
  departments: [],
  selectedDepartment: null,
  loading: false,
  error: null,
  total: 0,
};

// Async Thunks

export const fetchDepartments = createAsyncThunk(
  'departments/fetchDepartments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await departmentService.getAll();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch departments'
      );
    }
  }
);

export const createDepartment = createAsyncThunk(
  'departments/createDepartment',
  async (data: Omit<Department, '_id'>, { rejectWithValue }) => {
    try {
      const response = await departmentService.create(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create department'
      );
    }
  }
);

export const updateDepartment = createAsyncThunk(
  'departments/updateDepartment',
  async (
    { id, data }: { id: string; data: Partial<Department> },
    { rejectWithValue }
  ) => {
    try {
      const response = await departmentService.update(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update department'
      );
    }
  }
);

export const deleteDepartment = createAsyncThunk(
  'departments/deleteDepartment',
  async (id: string, { rejectWithValue }) => {
    try {
      await departmentService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete department'
      );
    }
  }
);

// Slice

const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    setSelectedDepartment: (state, action: PayloadAction<Department | null>) => {
      state.selectedDepartment = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Departments
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload.data || action.payload.departments || [];
        state.total = state.departments.length;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Department
    builder
      .addCase(createDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.loading = false;
        const newDept = action.payload.data || action.payload;
        state.departments.unshift(newDept);
        state.total++;
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Department
    builder
      .addCase(updateDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.loading = false;
        const updatedDept = action.payload.data || action.payload;
        const index = state.departments.findIndex(
          (dept) => dept._id === updatedDept._id
        );
        if (index !== -1) {
          state.departments[index] = updatedDept;
        }
        if (
          state.selectedDepartment &&
          state.selectedDepartment._id === updatedDept._id
        ) {
          state.selectedDepartment = updatedDept;
        }
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Department
    builder
      .addCase(deleteDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = state.departments.filter(
          (dept) => dept._id !== action.payload
        );
        state.total--;
        if (
          state.selectedDepartment &&
          state.selectedDepartment._id === action.payload
        ) {
          state.selectedDepartment = null;
        }
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedDepartment, clearError } = departmentSlice.actions;

export default departmentSlice.reducer;
