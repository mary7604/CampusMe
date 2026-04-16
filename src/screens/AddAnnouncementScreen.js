
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert,
  ActivityIndicator, ScrollView, StyleSheet
} from 'react-native';
import announcementsApi from '../api/announcementsApi';
import useAuth from '../hooks/useAuth';


const FILIERES = ['all', 'Genie Informatique', 'Genie Civil', 'Genie Electrique'];
const GROUPES  = ['all', 'Groupe A', 'Groupe B', 'Groupe C', 'Groupe D'];

export default function AddAnnouncementScreen({ navigation, route }) {
  const { user } = useAuth();
  const editing = route.params?.announcement;

  const [title, setTitle]             = useState(editing?.title || '');
  const [content, setContent]         = useState(editing?.content || '');
  const [targetFiliere, setFiliere]   = useState(editing?.targetFiliere || 'all');
  const [targetGroup, setGroup]       = useState(editing?.targetGroup || 'all');
  const [loading, setLoading]         = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Erreur', 'Le titre et le contenu sont obligatoires.');
      return;
    }
    const profName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
    const payload = { title, content, profName, targetGroup, targetFiliere };

    try {
      setLoading(true);
      if (editing) {
        await announcementsApi.update(editing.id, payload);
        Alert.alert('Succes', 'Annonce modifiee.');
      } else {
        await announcementsApi.create(payload);
        Alert.alert('Succes', 'Annonce publiee.');
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erreur', e.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>

      <Text style={styles.label}>Titre</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex : Examen reporté"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Contenu</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Détails de l'annonce..."
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={5}
        textAlignVertical="top"
      />

      <Text style={styles.label}>Filière cible</Text>
      <View style={styles.optionsRow}>
        {FILIERES.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.option, targetFiliere === f && styles.optionActive]}
            onPress={() => setFiliere(f)}
          >
            <Text style={[styles.optionText, targetFiliere === f && styles.optionTextActive]}>
              {f === 'all' ? 'Toutes' : f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Groupe cible</Text>
      <View style={styles.optionsRow}>
        {GROUPES.map(g => (
          <TouchableOpacity
            key={g}
            style={[styles.option, targetGroup === g && styles.optionActive]}
            onPress={() => setGroup(g)}
          >
            <Text style={[styles.optionText, targetGroup === g && styles.optionTextActive]}>
              {g === 'all' ? 'Tous' : g}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>{editing ? 'Modifier' : 'Publier'}</Text>
        }
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F9' },
  label: { fontSize: 13, fontWeight: '700', color: '#444', marginBottom: 6, marginTop: 16, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: '#fff', borderRadius: 8, padding: 14,
    fontSize: 15, color: '#1a1a2e', borderWidth: 1, borderColor: '#E0E0E0',
  },
  textarea: { minHeight: 120 },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option: {
    paddingVertical: 8, paddingHorizontal: 14,
    borderRadius: 6, borderWidth: 1, borderColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  optionActive: { backgroundColor: '#0D47A1', borderColor: '#0D47A1' },
  optionText: { fontSize: 13, color: '#555' },
  optionTextActive: { color: '#fff', fontWeight: '600' },
  button: {
    backgroundColor: '#0D47A1', padding: 16,
    borderRadius: 8, alignItems: 'center', marginTop: 32,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
