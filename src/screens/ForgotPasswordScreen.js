import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import colors from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import { loginStyles } from '../styles/LoginStyles';
import axiosInstance from '../api/axiosInstance';
// import { useTranslation } from 'react-i18next';

export default function ForgotPasswordScreen({ navigation }) {
  // const { t } = useTranslation(); 
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre email');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post('/auth/reset-password', { email, newPassword });
      Alert.alert(
        'Succès',
        'Mot de passe modifié avec succès !',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (e) {
      Alert.alert('Erreur', 'Email introuvable dans notre système.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={loginStyles.header}>
          <Text style={loginStyles.logo}></Text>
          <Text style={loginStyles.appName}>CampusMe</Text>
          <Text style={loginStyles.tagline}>Réinitialisation du mot de passe</Text>
        </View>

        <View style={loginStyles.form}>
          <Text style={loginStyles.title}>Nouveau mot de passe</Text>
          <Text style={loginStyles.subtitle}>
            Entrez votre email et choisissez un nouveau mot de passe
          </Text>

          <View style={globalStyles.inputContainer}>
            <Text style={globalStyles.inputIcon}></Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Email universitaire"
              placeholderTextColor={colors.light}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={globalStyles.inputContainer}>
            <Text style={globalStyles.inputIcon}></Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Nouveau mot de passe"
              placeholderTextColor={colors.light}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
          </View>

          <View style={globalStyles.inputContainer}>
            <Text style={globalStyles.inputIcon}></Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Confirmer le mot de passe"
              placeholderTextColor={colors.light}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[globalStyles.primaryButton, loading && loginStyles.disabled]}
            onPress={handleReset}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={colors.white} />
              : <Text style={globalStyles.primaryButtonText}>Réinitialiser</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity
            style={loginStyles.registerContainer}
            onPress={() => navigation.goBack()}
          >
            <Text style={loginStyles.registerText}>
              <Text style={loginStyles.registerLink}>← Retour à la connexion</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}