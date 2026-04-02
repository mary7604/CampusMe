import axiosInstance from './axiosInstance';

const usersApi = {
  // GET /users/students
  getStudents: () => axiosInstance.get('/users/students'),
};

export default usersApi;

