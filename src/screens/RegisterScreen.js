import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator, 
  ScrollView, Alert
} from 'react-native';
import colors from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import { loginStyles } from '../styles/LoginStyles';
import useAuth from '../hooks/useAuth';

const FILIERES = ['ILISI', 'GET', 'GMI', 'GPE', 'GE', 'BCG', 'MIP'];
const NIVEAUX = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];
const GROUPES = ['Groupe A', 'Groupe B', 'Groupe C', 'Groupe D'];
const DEPARTEMENTS = [
  'Mathématiques et Informatique',
  'Physique',
  'Chimie',
  'Biologie',
  'Génie Électrique',
  'Génie Mécanique',
  'Langues et Communication',
];

const SelectField = ({ icon, value, options, onSelect, placeholder }) => {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <TouchableOpacity
        style={globalStyles.inputContainer}
        onPress={() => setOpen(!open)}
      >
        <Text style={globalStyles.inputIcon}>{icon}</Text>
        <Text style={[globalStyles.input, !value && { color: colors.light }]}>
          {value || placeholder}
        </Text>
        <Text style={{ color: colors.light, paddingRight: 10 }}>
          {open ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>
      {open && (
        <View style={{
          backgroundColor: '#fff',
          borderRadius: 10,
          borderWidth: 1,
          borderColor: '#E0E0E0',
          marginBottom: 10,
          elevation: 3,
        }}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={{
                padding: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#F5F5F5',
                backgroundColor: value === opt ? '#E3F2FD' : '#fff',
              }}
              onPress={() => { onSelect(opt); setOpen(false); }}
            >
              <Text style={{
                color: value === opt ? colors.primary : colors.dark,
                fontWeight: value === opt ? '600' : '400',
              }}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default function RegisterScreen({ navigation }) {
  const { loading, error, handleRegister } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');

  // Étudiant
  const [filiere, setFiliere] = useState('');
  const [niveau, setNiveau] = useState('');
  const [group, setGroup] = useState('');

  // Professeur
  const [departement, setDepartement] = useState('');

  const validateForm = () => {
    if (!firstName.trim()) return 'Le prénom est requis';
    if (!lastName.trim()) return 'Le nom est requis';
    if (!email.trim()) return "L'email est requis";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email invalide';
    if (!password) return 'Le mot de passe est requis';
    if (password.length < 6) return 'Mot de passe trop court (min 6 caractères)';
    if (role === 'student') {
      if (!filiere) return 'La filière est requise';
      if (!niveau) return 'Le niveau est requis';
      if (!group) return 'Le groupe est requis';
    }
    if (role === 'professeur') {
      if (!departement) return 'Le département est requis';
    }
    return null;
  };

  const onRegister = () => {
    const errorMsg = validateForm();
    if (errorMsg) {
      Alert.alert('Erreur de validation', errorMsg);
      return;
    }
    const data = {
      firstName, lastName, email, password, role,
      ...(role === 'student' && { filiere, niveau, group }),
      ...(role === 'professeur' && { departement }),
    };
    handleRegister(data, navigation);
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
          <Text style={loginStyles.subtitle}>
            Créez votre espace {role === 'student' ? 'étudiant' : 'professeur'}
          </Text>

          {error && (
            <View style={{ backgroundColor: '#FFEBEE', borderRadius: 10, padding: 12, marginBottom: 15 }}>
              <Text style={{ color: colors.error, fontSize: 13 }}>⚠️ {error}</Text>
            </View>
          )}

          {/* Toggle rôle */}
          <View style={loginStyles.roleToggleContainer}>
            <TouchableOpacity
              style={[loginStyles.roleToggleButton, role === 'student' && loginStyles.roleToggleButtonActive]}
              onPress={() => setRole('student')}
            >
              <Text style={[loginStyles.roleToggleText, role === 'student' && loginStyles.roleToggleTextActive]}>
                Étudiant
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[loginStyles.roleToggleButton, role === 'professeur' && loginStyles.roleToggleButtonActive]}
              onPress={() => setRole('professeur')}
            >
              <Text style={[loginStyles.roleToggleText, role === 'professeur' && loginStyles.roleToggleTextActive]}>
                Professeur
              </Text>
            </TouchableOpacity>
          </View>

          {/* Prénom */}
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

          {/* Nom */}
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

          {/* Email */}
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

          {/* Mot de passe */}
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

          {/* Champs étudiant */}
          {role === 'student' && (
            <>
              <SelectField
                icon="🎓"
                value={filiere}
                options={FILIERES}
                onSelect={setFiliere}
                placeholder="Filière"
              />
              <SelectField
                icon="📅"
                value={niveau}
                options={NIVEAUX}
                onSelect={setNiveau}
                placeholder="Niveau (S1, S2...)"
              />
              <SelectField
                icon="👥"
                value={group}
                options={GROUPES}
                onSelect={setGroup}
                placeholder="Groupe"
              />
            </>
          )}

          {/* Champs professeur */}
          {role === 'professeur' && (
            <SelectField
              icon="🏫"
              value={departement}
              options={DEPARTEMENTS}
              onSelect={setDepartement}
              placeholder="Département"
            />
          )}

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