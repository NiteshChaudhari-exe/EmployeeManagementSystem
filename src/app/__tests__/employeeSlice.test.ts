import employeeReducer, { addEmployee, updateEmployee, deleteEmployee } from '../store/employeeSlice';

describe('employeeSlice', () => {
  const initialState = {
    employees: [],
    selectedEmployee: null,
    loading: false,
  };

  it('should handle addEmployee', () => {
    const newEmployee = {
      id: 'emp-001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      phone: '+1-234-567-8900',
      dateOfBirth: '1990-05-15',
      address: '123 Main St',
      employeeId: 'EMP001',
      departmentId: 'dept-001',
      designation: 'Engineer',
      joinDate: '2020-01-15',
      basicSalary: 75000,
      allowances: 15000,
      status: 'active' as const,
      createdAt: '2020-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
    };
    const state = employeeReducer(initialState, addEmployee(newEmployee));
    expect(state.employees).toContainEqual(newEmployee);
  });

  it('should handle updateEmployee', () => {
    const startState = { ...initialState, employees: [{
      id: 'emp-001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      phone: '+1-234-567-8900',
      dateOfBirth: '1990-05-15',
      address: '123 Main St',
      employeeId: 'EMP001',
      departmentId: 'dept-001',
      designation: 'Engineer',
      joinDate: '2020-01-15',
      basicSalary: 75000,
      allowances: 15000,
      status: 'active' as const,
      createdAt: '2020-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
    }] };
    const updated = { ...startState.employees[0], firstName: 'Jane' };
    const state = employeeReducer(startState, updateEmployee(updated));
    expect(state.employees[0].firstName).toBe('Jane');
  });

  it('should handle deleteEmployee', () => {
    const startState2 = { ...initialState, employees: [{
      id: 'emp-001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      phone: '+1-234-567-8900',
      dateOfBirth: '1990-05-15',
      address: '123 Main St',
      employeeId: 'EMP001',
      departmentId: 'dept-001',
      designation: 'Engineer',
      joinDate: '2020-01-15',
      basicSalary: 75000,
      allowances: 15000,
      status: 'active' as const,
      createdAt: '2020-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
    }] };
    const state = employeeReducer(startState2, deleteEmployee('emp-001'));
    expect(state.employees.length).toBe(0);
  });
});
