// Redux Store Configuration

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import employeeReducer from './employeeSlice';
import attendanceReducer from './attendanceSlice';
import leaveReducer from './leaveSlice';
import payrollReducer from './payrollSlice';
import departmentReducer from './departmentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
    attendance: attendanceReducer,
    leaves: leaveReducer,
    payroll: payrollReducer,
    departments: departmentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
