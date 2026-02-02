// TypeScript interfaces for Employee Management System

export type UserRole = 'admin' | 'hr_manager' | 'employee';

export type EmployeeStatus = 'active' | 'resigned' | 'terminated';

export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export type LeaveType = 'sick' | 'casual' | 'annual' | 'maternity' | 'paternity';

// User/Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  employeeId?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading?: boolean;
  error?: string | null;
}

// Employee Types
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  
  // Job Details
  employeeId: string;
  departmentId: string;
  designation: string;
  joinDate: string;
  
  // Salary
  basicSalary: number;
  allowances: number;
  
  // Status
  status: EmployeeStatus;
  
  // Documents (stored as mock URLs)
  documents?: {
    resume?: string;
    idProof?: string;
    photo?: string;
  };
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// Department Types
export interface Department {
  id: string;
  name: string;
  description: string;
  headId?: string;
  employeeCount: number;
  createdAt: string;
}

// Attendance Types
export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  workHours?: number;
  status: 'present' | 'absent' | 'half-day' | 'leave';
  notes?: string;
}

// Leave Types
export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
}

export interface LeaveBalance {
  employeeId: string;
  sick: number;
  casual: number;
  annual: number;
  maternity: number;
  paternity: number;
}

// Payroll Types
export interface PayrollRecord {
  id: string;
  employeeId: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  paidDate?: string;
  status: 'pending' | 'paid';
}

// Dashboard Stats
export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  totalDepartments: number;
  pendingLeaves: number;
  todayPresent: number;
  todayAbsent: number;
  monthlyPayroll: number;
}
