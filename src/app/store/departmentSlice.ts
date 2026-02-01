// Department Management Slice

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Department } from '@/app/types';
import { mockDepartments } from '@/app/data/mockData';

interface DepartmentState {
  departments: Department[];
  selectedDepartment: Department | null;
  loading: boolean;
}

const initialState: DepartmentState = {
  departments: mockDepartments,
  selectedDepartment: null,
  loading: false,
};

const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    addDepartment: (state, action: PayloadAction<Department>) => {
      state.departments.push(action.payload);
    },
    updateDepartment: (state, action: PayloadAction<Department>) => {
      const index = state.departments.findIndex((dept) => dept.id === action.payload.id);
      if (index !== -1) {
        state.departments[index] = action.payload;
      }
    },
    deleteDepartment: (state, action: PayloadAction<string>) => {
      state.departments = state.departments.filter((dept) => dept.id !== action.payload);
    },
    selectDepartment: (state, action: PayloadAction<Department | null>) => {
      state.selectedDepartment = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    updateDepartmentHeadCount: (state, action: PayloadAction<{ departmentId: string; count: number }>) => {
      const dept = state.departments.find((d) => d.id === action.payload.departmentId);
      if (dept) {
        dept.employeeCount = action.payload.count;
      }
    },
  },
});

export const { 
  addDepartment, 
  updateDepartment, 
  deleteDepartment, 
  selectDepartment, 
  setLoading,
  updateDepartmentHeadCount,
} = departmentSlice.actions;
export default departmentSlice.reducer;
