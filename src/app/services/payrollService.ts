import apiClient from './api';

export const payrollService = {
  getAll: async (page = 1, limit = 10) => {
    const response = await apiClient.get('/payroll', {
      params: { page, limit },
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/payroll/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post('/payroll', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await apiClient.put(`/payroll/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/payroll/${id}`);
    return response.data;
  },

  generate: async (month: number, year: number) => {
    const response = await apiClient.post('/payroll/generate', { month, year });
    return response.data;
  },
};

export default payrollService;
