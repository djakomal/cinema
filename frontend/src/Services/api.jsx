import axios from 'axios';

// Utiliser les variables d'environnement
const API_URL = process.env.REACT_APP_API_URL || 'https://cinema-x483.onrender.com';

// Créer une instance axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config.url.includes('/api/auth/login')) {
      // Token expiré ou invalide (hors login)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (credentials) => api.post('/api/auth/login', credentials);
export const register = (userData) => api.post('/api/auth/register', userData);
export const getMe = () => api.get('/api/auth/me');

// Actors
export const getActors = () => api.get('/api/actors');
export const getActor = (id) => api.get(`/api/actors/${id}`);
export const createActor = (formData) => api.post('/api/actors', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateActor = (id, data) => {
  // Détecte si c'est FormData ou JSON
  const isFormData = data instanceof FormData;
  return api.put(`/api/actors/${id}`, data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
  });
};
export const deleteActor = (id) => api.delete(`/api/actors/${id}`);

// Videos
export const getVideos = () => api.get('/api/videos');
export const getVideo = (id) => api.get(`/api/videos/${id}`);
export const createVideo = (formData) => api.post('/api/videos', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateVideo = (id, data) => {
  const isFormData = data instanceof FormData;
  return api.put(`/api/videos/${id}`, data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
  });
};
export const deleteVideo = (id) => api.delete(`/api/videos/${id}`);

// Photoc
export const getPhotocards = () => api.get('/api/photo');
export const getPhotocard = (id) => api.get(`/api/photo/${id}`);
export const createPhotocard = (formData) => api.post('/api/photo', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updatePhotocard = (id, data) => {
  const isFormData = data instanceof FormData;
  return api.put(`/api/photo/${id}`, data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
  });
};
export const deletePhotocard = (id) => api.delete(`/api/photo/${id}`);

export default api;
