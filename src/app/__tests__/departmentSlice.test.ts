import departmentReducer, { addDepartment, updateDepartment, deleteDepartment } from '../store/departmentSlice';

describe('departmentSlice', () => {
  const initialState = {
    departments: [],
    selectedDepartment: null,
    loading: false,
  };

  it('should handle addDepartment', () => {
    const newDepartment = { id: 'dept-001', name: 'HR', description: 'Human Resources', employeeCount: 10, createdAt: '2020-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' };
    const state = departmentReducer(initialState, addDepartment(newDepartment));
    expect(state.departments).toContainEqual(newDepartment);
  });

  it('should handle updateDepartment', () => {
    const startState = { ...initialState, departments: [{ id: 'dept-001', name: 'HR', description: 'Human Resources', employeeCount: 10, createdAt: '2020-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }] };
    const updated = { ...startState.departments[0], name: 'Finance' };
    const state = departmentReducer(startState, updateDepartment(updated));
    expect(state.departments[0].name).toBe('Finance');
  });

  it('should handle deleteDepartment', () => {
    const startState2 = { ...initialState, departments: [{ id: 'dept-001', name: 'HR', description: 'Human Resources', employeeCount: 10, createdAt: '2020-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }] };
    const state = departmentReducer(startState2, deleteDepartment('dept-001'));
    expect(state.departments.length).toBe(0);
  });
});
