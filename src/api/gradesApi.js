import axiosInstance from './axiosInstance';

const gradesApi = {
  // GET /grades/:studentId
  getGrades: (studentId) =>
    axiosInstance.get(`/grades/${studentId}`),

  // GET /grades/:studentId/average
  getAverage: (studentId) =>
    axiosInstance.get(`/grades/${studentId}/average`),
};

export default gradesApi;
