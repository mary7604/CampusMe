import axiosInstance from './axiosInstance';

const announcementsApi = {
  getAll: ()            => axiosInstance.get('/announcements'),
  getMy: ()             => axiosInstance.get('/announcements/my'),
  create: (data)        => axiosInstance.post('/announcements', data),
  update: (id, data)    => axiosInstance.patch(`/announcements/${id}`, data),
  remove: (id)          => axiosInstance.delete(`/announcements/${id}`),
};

export default announcementsApi;