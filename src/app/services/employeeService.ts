import apiClient from './api';

export const employeeService = {
  getAll: async (page = 1, limit = 10, search = '') => {
    const response = await apiClient.get('/employees', {
      params: { page, limit, search },
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/employees/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post('/employees', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await apiClient.put(`/employees/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/employees/${id}`);
    return response.data;
  },

  search: async (query: string) => {
    const response = await apiClient.get(`/employees/search`, {
      params: { q: query },
    });
    return response.data;
  },
};

export default employeeService;
