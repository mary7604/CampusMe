import axiosInstance from './axiosInstance';

const gradesApi = {
  // GET /grades/:studentId
  getGrades: (studentId) =>
    axiosInstance.get(`/grades/${studentId}`),

  // GET /grades/:studentId/average
  getAverage: (studentId) =>
    axiosInstance.get(`/grades/${studentId}/average`),

  // POST /grades
  addGrade: (data) =>
    axiosInstance.post('/grades', data),
};

export default gradesApi;
