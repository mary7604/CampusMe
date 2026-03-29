import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk, logoutThunk, registerThunk } from '../store/thunks/authThunk';

// Hook useAuth — sépare la logique UI de la logique métier
export default function useAuth() {
  const dispatch = useDispatch();
  const { isLoggedIn, user, loading, error } = useSelector(s => s.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (navigation) => {
    const result = await dispatch(loginThunk({ email, password }));
    if (loginThunk.fulfilled.match(result)) {
      navigation.replace('Main'); // Naviguer vers l'app principale
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
