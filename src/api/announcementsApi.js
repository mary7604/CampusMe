import axiosInstance from './axiosInstance';

const announcementsApi = {
  // GET /announcements
  getAll: () => axiosInstance.get('/announcements'),

  // POST /announcements
  create: (data) => axiosInstance.post('/announcements', data),
};

export default announcementsApi;
