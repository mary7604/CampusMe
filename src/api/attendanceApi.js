import axiosInstance from './axiosInstance';

const attendanceApi = {
  // POST /attendance/scan
  scanQRCode: (code) =>
    axiosInstance.post('/attendance/scan', { code }),

  // GET /attendance/:studentId
  getHistory: (studentId) =>
    axiosInstance.get(`/attendance/${studentId}`),
};

export default attendanceApi;
