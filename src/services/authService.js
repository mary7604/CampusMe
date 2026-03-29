import authApi from '../api/authApi';
import storageService from './storageService';

// Couche API Auth — centralise la logique d'authentification
const authService = {
  login: async (email, password) => {
    const response = await authApi.login(email, password);
    const { access_token, user } = response.data;
    // Stockage sécurisé du token et des infos utilisateur
    await storageService.saveToken(access_token);
    await storageService.saveUser(user);
    return { access_token, user };
  },

  register: async (data) => {
    const response = await authApi.register(data);
    return response.data;
  },

  logout: async () => {
    await storageService.removeToken();
    await storageService.removeUser();
  },

  getCurrentUser: () => storageService.getUser(),
  getToken: () => storageService.getToken(),
};

export default authService;
