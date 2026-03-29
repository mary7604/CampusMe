import axiosInstance from './axiosInstance';

const authApi = {
  // POST /auth/login
  login: (email, password) =>
    axiosInstance.post('/auth/login', { email, password }),

  // POST /auth/register
  register: (data) =>
    axiosInstance.post('/auth/register', data),

  // GET /auth/me
  getMe: () =>
    axiosInstance.get('/auth/me'),
};

export default authApi;
