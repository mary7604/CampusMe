import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator, Alert, StyleSheet
} from 'react-native';
import announcementsApi from '../../api/announcementsApi';
import useAuth from '../../hooks/useAuth';

export default function ManageAnnouncementsScreen({ navigation }) {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    load();
    return unsub;
  }, []);

  const load = async () => {
    try {
      const res = await announcementsApi.getAll();
      const mine = (res.data || []).filter(a =>
        a.profName?.toLowerCase().includes((user?.firstName || '').toLowerCase())
      );
      setAnnouncements(mine);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Supprimer',
      'Confirmer la suppression de cette annonce ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer', style: 'destructive',
          onPress: async () => {
            try {
              await announcementsApi.remove(id);
              setAnnouncements(prev => prev.filter(a => a.id !== id));
            } catch (e) {
              Alert.alert('Erreur', 'Suppression impossible.');
            }
          }
        }
      ]
    );
  };

  if (loading) return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color="#0D47A1" />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={announcements}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>Aucune annonce publiee.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDate}>
                {new Date(item.createdAt).toLocaleDateString('fr-FR')}
              </Text>
            </View>
            <Text style={styles.cardContent}>{item.content}</Text>
            <Text style={styles.cardTarget}>
              {item.targetFiliere === 'all' ? 'Toutes filieres' : item.targetFiliere}
              {' — '}
              {item.targetGroup === 'all' ? 'Tous groupes' : item.targetGroup}
            </Text>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.btnEdit}
                onPress={() => navigation.navigate('AddAnnouncement', { announcement: item })}
              >
                <Text style={styles.btnEditText}>Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnDelete}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.btnDeleteText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AddAnnouncement')}
      >
        <Text style={styles.buttonText}>Nouvelle annonce</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F9' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#888', fontSize: 15 },
  card: {
    backgroundColor: '#fff', borderRadius: 8, padding: 16,
    marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#0D47A1', elevation: 1,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a2e', flex: 1 },
  cardDate: { fontSize: 12, color: '#888', marginLeft: 8 },
  cardContent: { fontSize: 14, color: '#444', lineHeight: 20, marginBottom: 6 },
  cardTarget: { fontSize: 12, color: '#0D47A1', marginBottom: 12 },
  actions: { flexDirection: 'row', gap: 10 },
  btnEdit: {
    flex: 1, paddingVertical: 8, borderRadius: 6,
    borderWidth: 1, borderColor: '#0D47A1', alignItems: 'center',
  },
  btnEditText: { color: '#0D47A1', fontWeight: '600', fontSize: 13 },
  btnDelete: {
    flex: 1, paddingVertical: 8, borderRadius: 6,
    backgroundColor: '#FDECEA', alignItems: 'center',
  },
  btnDeleteText: { color: '#C62828', fontWeight: '600', fontSize: 13 },
  button: {
    backgroundColor: '#0D47A1', margin: 16,
    padding: 16, borderRadius: 8, alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});