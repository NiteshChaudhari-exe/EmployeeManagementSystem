export const ROLES = {
  ADMIN: 'admin',
  HR_MANAGER: 'hr_manager',
  EMPLOYEE: 'employee',
};

export const API_ROUTES = {
  AUTH: '/api/auth',
  EMPLOYEES: '/api/employees',
  DEPARTMENTS: '/api/departments',
  ATTENDANCE: '/api/attendance',
  LEAVES: '/api/leaves',
  PAYROLL: '/api/payroll',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};
