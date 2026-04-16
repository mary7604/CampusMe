import axiosInstance from './axiosInstance';

const attendanceApi = {
  generate: (courseId, subject) =>
  axiosInstance.post(`/attendance/generate/${courseId}`, { subject }),

  scan: (code) =>
    axiosInstance.post('/attendance/scan', { code }),

  getHistory: () =>
    axiosInstance.get('/attendance/history'),

  seed: () =>
    axiosInstance.post('/attendance/seed'),

  getSession: (qrCode) =>
  axiosInstance.get(`/attendance/session/${qrCode}`),
};

export default attendanceApi;

