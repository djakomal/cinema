import axios from 'axios';

// Utiliser les variables d'environnement
const API_URL = process.env.REACT_APP_API_URL || 'https://cinema-qfbf.onrender.com/api';

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
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const getMe = () => api.get('/auth/me');

// Actors
export const getActors = () => api.get('/actors');
export const getActor = (id) => api.get(`/actors/${id}`);
export const createActor = (formData) => api.post('/actors', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateActor = (id, data) => {
  // Détecte si c'est FormData ou JSON
  const isFormData = data instanceof FormData;
  return api.put(`/actors/${id}`, data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
  });
};
export const deleteActor = (id) => api.delete(`/actors/${id}`);

// Videos
export const getVideos = () => api.get('/videos');
export const getVideo = (id) => api.get(`/videos/${id}`);
export const createVideo = (formData) => api.post('/videos', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateVideo = (id, data) => {
  const isFormData = data instanceof FormData;
  return api.put(`/videos/${id}`, data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
  });
};
export const deleteVideo = (id) => api.delete(`/videos/${id}`);

// Photoc
export const getPhotocards = () => api.get('/photo');
export const getPhotocard = (id) => api.get(`/photo/${id}`);
export const createPhotocard = (formData) => api.post('/photo', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updatePhotocard = (id, data) => {
  const isFormData = data instanceof FormData;
  return api.put(`/photo/${id}`, data, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
  });
};
export const deletePhotocard = (id) => api.delete(`/photo/${id}`);

export default api;