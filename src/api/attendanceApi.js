import axiosInstance from './axiosInstance';

const attendanceApi = {
  // POST /attendance/generate/:courseId — prof génère le QR
  generate: (courseId) =>
    axiosInstance.post(`/attendance/generate/${courseId}`),

  // POST /attendance/scan — étudiant scanne
  scan: (code) =>
    axiosInstance.post('/attendance/scan', { code }),

  // GET /attendance/history — historique de l'étudiant connecté
  getHistory: () =>
    axiosInstance.get('/attendance/history'),
};

export default attendanceApi;