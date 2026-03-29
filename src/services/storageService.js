import * as SecureStore from 'expo-secure-store';

// Couche Persistance — stockage sécurisé du JWT
const storageService = {
  saveToken: (token) =>
    SecureStore.setItemAsync('access_token', token),

  getToken: () =>
    SecureStore.getItemAsync('access_token'),

  removeToken: () =>
    SecureStore.deleteItemAsync('access_token'),

  saveUser: (user) =>
    SecureStore.setItemAsync('user', JSON.stringify(user)),

  getUser: async () => {
    const data = await SecureStore.getItemAsync('user');
    return data ? JSON.parse(data) : null;
  },

  removeUser: () =>
    SecureStore.deleteItemAsync('user'),
};

// Export séparé pour axiosInstance
export const getToken = storageService.getToken;

export default storageService;
