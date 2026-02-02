import apiClient from './api';

export const leaveService = {
  getAll: async (page = 1, limit = 10) => {
    const response = await apiClient.get('/leaves', {
      params: { page, limit },
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/leaves/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post('/leaves', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await apiClient.put(`/leaves/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/leaves/${id}`);
    return response.data;
  },

  getByEmployee: async (employeeId: string) => {
    const response = await apiClient.get(`/leaves/employee/${employeeId}`);
    return response.data;
  },

  approve: async (id: string) => {
    const response = await apiClient.put(`/leaves/${id}/approve`);
    return response.data;
  },

  reject: async (id: string) => {
    const response = await apiClient.put(`/leaves/${id}/reject`);
    return response.data;
  },
};

export default leaveService;
