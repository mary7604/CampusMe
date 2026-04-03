import axiosInstance from './axiosInstance';

const gradesApi = {
  getGrades: (studentId) =>
    axiosInstance.get(`/grades/${studentId}`),

  getMyGrades: () =>
    axiosInstance.get('/grades/me'),

  addGrade: (data) =>
    axiosInstance.post('/grades', data),

  updateGrade: (id, data) =>
    axiosInstance.patch(`/grades/${id}`, data),

  deleteGrade: (id) =>
    axiosInstance.delete(`/grades/${id}`),
};

export default gradesApi;