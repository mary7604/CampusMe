import axiosInstance from './axiosInstance';

const attendanceApi = {
  generate: (courseId) =>
    axiosInstance.post(`/attendance/generate/${courseId}`),

  scan: (code) =>
    axiosInstance.post('/attendance/scan', { code }),

  getHistory: () =>
    axiosInstance.get('/attendance/history'),

  seed: () =>
    axiosInstance.post('/attendance/seed'),
};

export default attendanceApi;

