// Employee Slice for Redux Store

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Employee } from '@/app/types';
import { employeeService } from '@/app/services/employeeService';

interface EmployeeState {
  employees: Employee[];
  selectedEmployee: Employee | null;
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  search: string;
}

const initialState: EmployeeState = {
  employees: [],
  selectedEmployee: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
  search: '',
};

// Async Thunks

export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (
    params: { page?: number; limit?: number; search?: string } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await employeeService.getAll(
        params.page || 1,
        params.limit || 10,
        params.search || ''
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch employees'
      );
    }
  }
);

export const fetchEmployeeById = createAsyncThunk(
  'employees/fetchEmployeeById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await employeeService.getById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch employee'
      );
    }
  }
);

export const createEmployee = createAsyncThunk(
  'employees/createEmployee',
  async (data: Omit<Employee, '_id'>, { rejectWithValue }) => {
    try {
      const response = await employeeService.create(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create employee'
      );
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/updateEmployee',
  async (
    { id, data }: { id: string; data: Partial<Employee> },
    { rejectWithValue }
  ) => {
    try {
      const response = await employeeService.update(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update employee'
      );
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/deleteEmployee',
  async (id: string, { rejectWithValue }) => {
    try {
      await employeeService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete employee'
      );
    }
  }
);

// Slice

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setSelectedEmployee: (state, action: PayloadAction<Employee | null>) => {
      state.selectedEmployee = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1; // Reset to first page on new search
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Employees
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.data || action.payload.employees || [];
        state.total = action.payload.total || state.employees.length;
        state.page = action.payload.page || 1;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Employee By ID
    builder
      .addCase(fetchEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEmployee = action.payload.data || action.payload;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Employee
    builder
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        const newEmployee = action.payload.data || action.payload;
        state.employees.unshift(newEmployee);
        state.total++;
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Employee
    builder
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        const updatedEmployee = action.payload.data || action.payload;
        const index = state.employees.findIndex(
          (emp) => emp._id === updatedEmployee._id
        );
        if (index !== -1) {
          state.employees[index] = updatedEmployee;
        }
        if (
          state.selectedEmployee &&
          state.selectedEmployee._id === updatedEmployee._id
        ) {
          state.selectedEmployee = updatedEmployee;
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Employee
    builder
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = state.employees.filter(
          (emp) => emp._id !== action.payload
        );
        state.total--;
        if (
          state.selectedEmployee &&
          state.selectedEmployee._id === action.payload
        ) {
          state.selectedEmployee = null;
        }
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedEmployee, setSearch, setPage, clearError } =
  employeeSlice.actions;

export default employeeSlice.reducer;
