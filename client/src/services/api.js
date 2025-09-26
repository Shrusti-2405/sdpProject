import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('Making API request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API response:', response.data);
    return response;
  },
  (error) => {
    console.error('API error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Equipment API
export const equipmentAPI = {
  getAllEquipment: () => api.get('/equipment'),
  getEquipmentById: (id) => api.get(`/equipment/${id}`),
  createEquipment: (equipment) => api.post('/equipment', equipment),
  updateEquipment: (id, equipment) => api.put(`/equipment/${id}`, equipment),
  deleteEquipment: (id) => api.delete(`/equipment/${id}`),
  updateEquipmentStatus: (id, status) => api.put(`/equipment/${id}/status`, { status }),
  searchEquipment: (query) => api.get(`/equipment/search?q=${query}`),
  getEquipmentByCategory: (category) => api.get(`/equipment/category/${category}`),
  getEquipmentByStatus: (status) => api.get(`/equipment/status/${status}`),
  getEquipmentByDepartment: (department) => api.get(`/equipment/department/${department}`),
  getMaintenanceDueEquipment: () => api.get('/equipment/maintenance-due'),
  getCriticalEquipment: () => api.get('/equipment/critical'),
  getDashboardStats: () => api.get('/equipment/stats')
};

// Maintenance API
export const maintenanceAPI = {
  getAllMaintenance: () => api.get('/maintenance'),
  getMaintenanceById: (id) => api.get(`/maintenance/${id}`),
  createMaintenance: (maintenance) => api.post('/maintenance', maintenance),
  updateMaintenance: (id, maintenance) => api.put(`/maintenance/${id}`, maintenance),
  deleteMaintenance: (id) => api.delete(`/maintenance/${id}`),
  completeMaintenance: (id, data) => api.put(`/maintenance/${id}/complete`, data),
  getMaintenanceByEquipment: (equipmentId) => api.get(`/maintenance/equipment/${equipmentId}`),
  getMaintenanceByTechnician: (technicianId) => api.get(`/maintenance/technician/${technicianId}`),
  getOverdueMaintenance: () => api.get('/maintenance/overdue'),
  getUpcomingMaintenance: (days = 7) => api.get(`/maintenance/upcoming?days=${days}`),
  scheduleRecurringMaintenance: (data) => api.post('/maintenance/recurring', data),
  getMaintenanceStats: () => api.get('/maintenance/stats')
};

// Chatbot API
export const chatbotAPI = {
  chatWithBot: (message, equipmentId = null, maintenanceId = null) => 
    api.post('/chatbot/chat', { message, equipmentId, maintenanceId }),
  getMaintenanceSuggestions: (data) => api.post('/chatbot/suggestions', data),
  getTroubleshootingGuide: (data) => api.post('/chatbot/troubleshooting', data),
  getMaintenanceScheduleRecommendations: (data) => api.post('/chatbot/schedule-recommendations', data),
  getSafetyProtocols: (data) => api.post('/chatbot/safety-protocols', data)
};

export default api;