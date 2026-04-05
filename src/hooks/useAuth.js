import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk, logoutThunk, registerThunk } from '../store/thunks/authThunk';
import notificationService from '../services/notificationService';
import axiosInstance from '../api/axiosInstance';

// Hook useAuth — sépare la logique UI de la logique métier
export default function useAuth() {
  const dispatch = useDispatch();
  const { isLoggedIn, user, loading, error } = useSelector(s => s.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
  const result = await dispatch(loginThunk({ email, password }));
  if (loginThunk.fulfilled.match(result)) {
    try {
      console.log('Récupération du push token...');
      const token = await notificationService.getPushToken();
      console.log('Push token:', token);
      if (token) {
        // Attendre un peu que le token JWT soit bien stocké
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = await axiosInstance.post('/users/push-token', { pushToken: token });
        console.log('Token sauvegardé !', response.data);
      }
    } catch (e) {
      console.log('Push token error:', e.response?.data || e.message || e);
    }
  }
};

  const handleLogout = async (navigation) => {
    await dispatch(logoutThunk());
    navigation.replace('Login');
  };

  const handleRegister = async (userData, navigation) => {
    const result = await dispatch(registerThunk(userData));
    if (registerThunk.fulfilled.match(result)) {
      navigation.replace('Login');
    }
  };

  return {
    email, setEmail,
    password, setPassword,
    isLoggedIn, user,
    loading, error,
    handleLogin,
    handleLogout,
    handleRegister,
  };
}
