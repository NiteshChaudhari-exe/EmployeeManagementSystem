import apiClient from './api';

export const attendanceService = {
  getAll: async (page = 1, limit = 10) => {
    const response = await apiClient.get('/attendance', {
      params: { page, limit },
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/attendance/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post('/attendance', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await apiClient.put(`/attendance/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/attendance/${id}`);
    return response.data;
  },

  getByEmployee: async (employeeId: string) => {
    const response = await apiClient.get(`/attendance/employee/${employeeId}`);
    return response.data;
  },
};

export default attendanceService;
