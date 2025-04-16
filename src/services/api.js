import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Handle FormData vs JSON
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']; // Let axios set the correct content type
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
  logout: () => api.post('/logout'),
  updateProfile: (userData) => {
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
      if (userData[key] !== null) {
        formData.append(key, userData[key]);
      }
    });
    return api.put('/user', formData);
  },
  getProfile: () => api.get('/user'),
};

// Tournament services
export const tournamentService = {
  // Tournament CRUD operations
  getAll: () => api.get('/tournaments'),
  getById: (id) => api.get(`/tournaments/${id}`),
  create: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null) {
        if (key === 'image' && data[key] instanceof File) {
          formData.append('image', data[key]);
        } else {
          formData.append(key, data[key]);
        }
      }
    });
    return api.post('/tournaments', formData);
  },
  update: (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null) {
        if (key === 'image' && data[key] instanceof File) {
          formData.append('image', data[key]);
        } else {
          formData.append(key, data[key]);
        }
      }
    });
    return api.put(`/tournaments/${id}`, formData);
  },
  delete: (id) => api.delete(`/tournaments/${id}`),

  // Tournament players operations
  addPlayer: (tournamentId) => 
    api.post(`/tournoi/${tournamentId}/add-player`),
  getPlayers: (tournamentId) => 
    api.get(`/tournoi/${tournamentId}/players`),
  removePlayers: (tournamentId) => 
    api.delete(`/tournoi/${tournamentId}/remove-player`),
};

// Match services
export const matchService = {
  getAll: () => api.get('/matches'),
  getDetails: (id) => api.get(`/matches/${id}`), // Changed from POST to GET
  create: (data) => api.post('/matches', data),
  update: (id, data) => api.put(`/matches/${id}`, data),
  delete: (id) => api.delete(`/matches/${id}`),
};

// Helper function to handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const message = error.response.data.message || error.response.data.error;
    return {
      status: error.response.status,
      message: message || 'An error occurred',
    };
  } else if (error.request) {
    // Request made but no response
    return {
      status: 0,
      message: 'No response from server',
    };
  } else {
    // Request setup error
    return {
      status: 0,
      message: 'Error setting up request',
    };
  }
};

// Debug information
if (process.env.NODE_ENV === 'development') {
  console.log('API Configuration:', {
    baseURL: API_URL,
    currentTime: new Date().toISOString(),
    currentUser: localStorage.getItem('username') || 'bouchta65'
  });
}

export default api;