import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/refresh-token`, {
          refreshToken
        });
        
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    return response.data;
  }
};

// Events API
export const eventsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/events', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },
  
  create: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },
  
  update: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },
  
  updateStatus: async (id, status) => {
    const response = await api.patch(`/events/${id}/status`, { status });
    return response.data;
  },
  
  markTentative: async (id) => {
    const response = await api.post(`/events/${id}/hold`);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },
  
  exportCSV: async () => {
    const response = await api.get('/events/export/csv', {
      responseType: 'blob'
    });
    return response.data;
  }
};

// Venues API
export const venuesAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/venues', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/venues/${id}`);
    return response.data;
  },
  
  create: async (venueData) => {
    const response = await api.post('/venues', venueData);
    return response.data;
  },
  
  update: async (id, venueData) => {
    const response = await api.patch(`/venues/${id}`, venueData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/venues/${id}`);
    return response.data;
  },
  
  getAvailability: async (id, startDate, endDate) => {
    const response = await api.get(`/venues/${id}/availability`, {
      params: { startDate, endDate }
    });
    return response.data;
  },
  
  getStats: async (id) => {
    const response = await api.get(`/venues/${id}/stats`);
    return response.data;
  }
};

// Users API
export const usersAPI = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  
  create: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  
  updateProfile: async (profileData) => {
    const response = await api.patch('/users/profile', profileData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};

// Registrations API
export const registrationsAPI = {
  getByEvent: async (eventId) => {
    const response = await api.get(`/registrations/event/${eventId}`);
    return response.data;
  },
  
  getMyRegistrations: async () => {
    const response = await api.get('/registrations/my-registrations');
    return response.data;
  },
  
  create: async (registrationData) => {
    const response = await api.post('/registrations', registrationData);
    return response.data;
  },
  
  update: async (id, registrationData) => {
    const response = await api.patch(`/registrations/${id}`, registrationData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/registrations/${id}`);
    return response.data;
  },
  
  getStats: async (eventId) => {
    const response = await api.get(`/registrations/stats/${eventId}`);
    return response.data;
  }
};

// Documents API
export const documentsAPI = {
  getByEvent: async (eventId) => {
    const response = await api.get(`/events/${eventId}/docs`);
    return response.data;
  },
  
  upload: async (eventId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`/events/${eventId}/docs`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  download: async (docId) => {
    const response = await api.get(`/docs/${docId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  },
  
  delete: async (docId) => {
    const response = await api.delete(`/docs/${docId}`);
    return response.data;
  }
};

// Invoices API
export const invoicesAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/invoices', { params });
    return response.data;
  },
  
  getByEvent: async (eventId) => {
    const response = await api.get(`/invoices/event/${eventId}`);
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
  },
  
  create: async (invoiceData) => {
    const response = await api.post('/invoices', invoiceData);
    return response.data;
  },
  
  pay: async (id, paymentData) => {
    const response = await api.post(`/invoices/${id}/pay`, paymentData);
    return response.data;
  },
  
  refund: async (id, refundData) => {
    const response = await api.post(`/invoices/refund/${id}`, refundData);
    return response.data;
  },
  
  getPayments: async (id) => {
    const response = await api.get(`/invoices/${id}/payments`);
    return response.data;
  },
  
  getRefunds: async (id) => {
    const response = await api.get(`/invoices/${id}/refunds`);
    return response.data;
  }
};

// Reports API
export const reportsAPI = {
  getOverview: async () => {
    const response = await api.get('/reports/overview');
    return response.data;
  },
  
  getByCollege: async () => {
    const response = await api.get('/reports/by-college');
    return response.data;
  },
  
  getByVenue: async () => {
    const response = await api.get('/reports/by-venue');
    return response.data;
  },
  
  getMonthlyTrends: async () => {
    const response = await api.get('/reports/monthly-trends');
    return response.data;
  },
  
  getRegistrations: async () => {
    const response = await api.get('/reports/registrations');
    return response.data;
  },
  
  getTopEvents: async () => {
    const response = await api.get('/reports/top-events');
    return response.data;
  },
  
  getUserActivity: async () => {
    const response = await api.get('/reports/user-activity');
    return response.data;
  },
  
  getVenueUtilization: async () => {
    const response = await api.get('/reports/venue-utilization');
    return response.data;
  },
  
  exportReport: async (type) => {
    const response = await api.get(`/reports/export/${type}`, {
      responseType: 'blob'
    });
    return response.data;
  }
};

// Migration API
export const migrationAPI = {
  upload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/migration/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  getLogs: async (params = {}) => {
    const response = await api.get('/migration/logs', { params });
    return response.data;
  },
  
  getLogById: async (id) => {
    const response = await api.get(`/migration/logs/${id}`);
    return response.data;
  },
  
  retry: async (id) => {
    const response = await api.post(`/migration/logs/${id}/retry`);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/migration/logs/${id}`);
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get('/migration/stats');
    return response.data;
  }
};

// Colleges API (simple endpoint)
export const collegesAPI = {
  getAll: async () => {
    const response = await api.get('/colleges');
    return response.data;
  }
};

export default api;
