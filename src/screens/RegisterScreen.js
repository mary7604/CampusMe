import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView, Alert
} from 'react-native';
import colors from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import { loginStyles } from '../styles/LoginStyles';
import useAuth from '../hooks/useAuth';

export default function RegisterScreen({ navigation }) {
  const { loading, error, handleRegister } = useAuth();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');

  const validateForm = () => {
    if (!firstName.trim()) return 'Le prénom est requis';
    if (!lastName.trim()) return 'Le nom est requis';
    if (!email.trim()) return `L'email est requis`;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return 'Email invalide';
    if (!password) return 'Le mot de passe est requis';
    if (password.length < 6) return 'Mot de passe trop court (min 6 caractères)';
    return null;
  };

  const onRegister = () => {
    const errorMsg = validateForm();
    if (errorMsg) {
      // Set local error (useAuth error or local state, but use local for instant)
      Alert.alert('Erreur de validation', errorMsg);
      return;
    }
    handleRegister({ firstName, lastName, email, password, role }, navigation);
  };

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={loginStyles.header}>
          <Text style={loginStyles.logo}>📝</Text>
          <Text style={loginStyles.appName}>CampusMe</Text>
          <Text style={loginStyles.tagline}>Rejoignez votre campus</Text>
        </View>

        <View style={loginStyles.form}>
          <Text style={loginStyles.title}>Inscription</Text>
          <Text style={loginStyles.subtitle}>Créez votre espace {role === 'student' ? 'étudiant' : 'professeur'}</Text>

          {error && (
            <View style={{ backgroundColor: '#FFEBEE', borderRadius: 10, padding: 12, marginBottom: 15 }}>
              <Text style={{ color: colors.error, fontSize: 13 }}>⚠️ {error}</Text>
            </View>
          )}

          <View style={loginStyles.roleToggleContainer}>
            <TouchableOpacity
              style={[loginStyles.roleToggleButton, role === 'student' && loginStyles.roleToggleButtonActive]}
              onPress={() => setRole('student')}
            >
              <Text style={[loginStyles.roleToggleText, role === 'student' && loginStyles.roleToggleTextActive]}>Étudiant</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[loginStyles.roleToggleButton, role === 'professeur' && loginStyles.roleToggleButtonActive]}
              onPress={() => setRole('professeur')}
            >
              <Text style={[loginStyles.roleToggleText, role === 'professeur' && loginStyles.roleToggleTextActive]}>Professeur</Text>
            </TouchableOpacity>
          </View>

          <View style={globalStyles.inputContainer}>
            <Text style={globalStyles.inputIcon}>🧑</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Prénom"
              placeholderTextColor={colors.light}
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
          
          <View style={globalStyles.inputContainer}>
            <Text style={globalStyles.inputIcon}>🧑</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Nom"
              placeholderTextColor={colors.light}
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <View style={globalStyles.inputContainer}>
            <Text style={globalStyles.inputIcon}>📧</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Email universitaire"
              placeholderTextColor={colors.light}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={globalStyles.inputContainer}>
            <Text style={globalStyles.inputIcon}>🔒</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Mot de passe"
              placeholderTextColor={colors.light}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[globalStyles.primaryButton, loading && loginStyles.disabled]}
            onPress={onRegister}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={colors.white} />
              : <Text style={globalStyles.primaryButtonText}>Créer mon compte</Text>
            }
          </TouchableOpacity>

          <View style={loginStyles.separator}>
            <View style={loginStyles.separatorLine} />
            <Text style={loginStyles.separatorText}>ou</Text>
            <View style={loginStyles.separatorLine} />
          </View>

          <TouchableOpacity
            style={loginStyles.registerContainer}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={loginStyles.registerText}>
              Déjà un compte ?{'  '}
              <Text style={loginStyles.registerLink}>Se connecter</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
