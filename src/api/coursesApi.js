import axiosInstance from './axiosInstance';

const coursesApi = {
  // GET /courses/week/:group
  getWeekCourses: (group) =>
    axiosInstance.get(`/courses/week/${group}`),

  // GET /courses/today/:group
  getTodayCourses: (group) =>
    axiosInstance.get(`/courses/today/${group}`),
};

export default coursesApi;
