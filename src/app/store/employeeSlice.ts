// Employee Management Slice

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Employee } from '@/app/types';
import { mockEmployees } from '@/app/data/mockData';

interface EmployeeState {
  employees: Employee[];
  selectedEmployee: Employee | null;
  loading: boolean;
}

const initialState: EmployeeState = {
  employees: mockEmployees,
  selectedEmployee: null,
  loading: false,
};

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    addEmployee: (state, action: PayloadAction<Employee>) => {
      state.employees.push(action.payload);
    },
    updateEmployee: (state, action: PayloadAction<Employee>) => {
      const index = state.employees.findIndex((emp) => emp.id === action.payload.id);
      if (index !== -1) {
        state.employees[index] = action.payload;
      }
    },
    deleteEmployee: (state, action: PayloadAction<string>) => {
      state.employees = state.employees.filter((emp) => emp.id !== action.payload);
    },
    selectEmployee: (state, action: PayloadAction<Employee | null>) => {
      state.selectedEmployee = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { addEmployee, updateEmployee, deleteEmployee, selectEmployee, setLoading } = employeeSlice.actions;
export default employeeSlice.reducer;
