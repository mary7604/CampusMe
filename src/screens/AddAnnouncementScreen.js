import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import colors from '../styles/colors';
import announcementsApi from '../api/announcementsApi';
import useAuth from '../hooks/useAuth';

export default function AddAnnouncementScreen({ navigation }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'professeur') {
      Alert.alert('Accès refusé', 'Seul les professeurs peuvent publier des annonces.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }
  }, [user, navigation]);

  const handlePost = async () => {
    if (!title || !content) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }
    if (user && user.role !== 'professeur') {
      Alert.alert("Erreur", "Seul un professeur peut publier une annonce.");
      return;
    }

    try {
      setLoading(true);
      const profName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || (user?.email ? user.email.split('@')[0] : 'Professeur');
      await announcementsApi.create({ title, content, profName });
      Alert.alert("Succès", "L'annonce a été publiée avec succès !");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Erreur", "Une erreur s'est produite lors de la publication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={globalStyles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
        
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 20 }}>
          <Text style={{ color: colors.primary, fontSize: 16 }}>← Retour</Text>
        </TouchableOpacity>

        <Text style={[globalStyles.sectionTitle, { fontSize: 28, marginBottom: 8 }]}>Nouvelle Annonce</Text>
        <Text style={{ color: colors.gray, marginBottom: 30 }}>Publiez une annonce visible par tous les étudiants.</Text>

        <View style={[globalStyles.inputContainer, { marginBottom: 20 }]}>
          <Text style={globalStyles.inputIcon}>📌</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Titre de l'annonce"
            placeholderTextColor={colors.gray}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={[globalStyles.inputContainer, { height: 120, alignItems: 'flex-start', paddingTop: 10, marginBottom: 30 }]}>
          <Text style={[globalStyles.inputIcon, { marginTop: 4 }]}>📝</Text>
          <TextInput
            style={[globalStyles.input, { height: '100%', textAlignVertical: 'top' }]}
            placeholder="Contenu de l'annonce..."
            placeholderTextColor={colors.gray}
            multiline
            numberOfLines={4}
            value={content}
            onChangeText={setContent}
          />
        </View>

        <TouchableOpacity 
          style={[globalStyles.primaryButton, loading && { opacity: 0.7 }]} 
          onPress={handlePost}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={globalStyles.primaryButtonText}>Publier l'annonce</Text>}
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
