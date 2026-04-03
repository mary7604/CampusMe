import axiosInstance from './axiosInstance';

const coursesApi = {
  getWeekCourses: () =>
    axiosInstance.get('/courses/week'),

  getTodayCourses: () =>
    axiosInstance.get('/courses/today'),

  seed: () =>
    axiosInstance.post('/courses/seed'),
};

export default coursesApi;