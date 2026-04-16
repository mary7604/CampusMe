import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView
} from 'react-native';
import colors from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import { loginStyles } from '../styles/LoginStyles';
import useAuth from '../hooks/useAuth'; // ← hook Redux

export default function LoginScreen({ navigation }) {
  const {
    email, setEmail,
    password, setPassword,
    loading, error,
    handleLogin,
  } = useAuth();

  const [role, setRole] = useState('student');

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={loginStyles.header}>
          <Text style={loginStyles.logo}>🎓</Text>
          <Text style={loginStyles.appName}>CampusMe</Text>
          <Text style={loginStyles.tagline}>Votre campus, dans votre poche</Text>
        </View>

        <View style={loginStyles.form}>
          <Text style={loginStyles.title}>Connexion</Text>
          <Text style={loginStyles.subtitle}>Connectez-vous à votre espace {role === 'student' ? 'étudiant' : 'professeur'}</Text>

          {/* Affiche l'erreur Redux */}
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
              placeholder="Mot de passe"
              placeholderTextColor={colors.light}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={loginStyles.forgotContainer} onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={loginStyles.forgotText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          {/* Bouton connecté au thunk Redux */}
          <TouchableOpacity
            style={[globalStyles.primaryButton, loading && loginStyles.disabled]}
            onPress={() => handleLogin(navigation)}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={colors.white} />
              : <Text style={globalStyles.primaryButtonText}>Se connecter</Text>
            }
          </TouchableOpacity>

          <View style={loginStyles.separator}>
            <View style={loginStyles.separatorLine} />
            <Text style={loginStyles.separatorText}>ou</Text>
            <View style={loginStyles.separatorLine} />
          </View>

          <TouchableOpacity
            style={loginStyles.registerContainer}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={loginStyles.registerText}>
              Pas encore de compte ?{'  '}
              <Text style={loginStyles.registerLink}>S'inscrire</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
