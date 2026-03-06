import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform,
  ActivityIndicator, ScrollView
} from 'react-native';
import colors from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import { loginStyles } from '../styles/LoginStyles';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
//fct flsh
  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    //conteneur ,ne pas cacher la zone de saisie 
    <KeyboardAvoidingView
      style={globalStyles.container}
      //ajouter ou reduit 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={loginStyles.header}>
          <Text style={loginStyles.logo}>🎓</Text>
          <Text style={loginStyles.appName}>CampusMe</Text>
          <Text style={loginStyles.tagline}>Votre campus, dans votre poche</Text>
        </View>

        {/* FORMULAIRE */}
        <View style={loginStyles.form}>
          <Text style={loginStyles.title}>Connexion</Text>
          <Text style={loginStyles.subtitle}>Connectez-vous à votre espace étudiant</Text>

          {/* Email */}
          <View style={globalStyles.inputContainer}>
            
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

          {/* Mot de passe */}
          <View style={globalStyles.inputContainer}>
            <TextInput
              style={globalStyles.input}
              placeholder="Mot de passe"
              placeholderTextColor={colors.light}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              
              <Text style={globalStyles.inputIcon}>
                {showPassword ? '☺' : '☻'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Mot de passe oublié */}
          <TouchableOpacity style={loginStyles.forgotContainer}>
            <Text style={loginStyles.forgotText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          {/* Bouton Connexion */}
          <TouchableOpacity
            style={[globalStyles.primaryButton, loading && loginStyles.disabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={colors.white} />
              : <Text style={globalStyles.primaryButtonText}>Se connecter</Text>
            }
          </TouchableOpacity>

          {/* Séparateur */}
          <View style={loginStyles.separator}>
            <View style={loginStyles.separatorLine} />
            <Text style={loginStyles.separatorText}>ou</Text>
            <View style={loginStyles.separatorLine} />
          </View>

          {/* Inscription */}
          <TouchableOpacity style={loginStyles.registerContainer}>
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