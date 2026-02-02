import apiClient from './api';

export const departmentService = {
  getAll: async (page = 1, limit = 10) => {
    const response = await apiClient.get('/departments', {
      params: { page, limit },
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/departments/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post('/departments', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await apiClient.put(`/departments/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/departments/${id}`);
    return response.data;
  },

  getEmployees: async (id: string) => {
    const response = await apiClient.get(`/departments/${id}/employees`);
    return response.data;
  },
};

export default departmentService;
