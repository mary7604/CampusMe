import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator, StyleSheet, TextInput
} from 'react-native';
import usersApi from '../../api/usersApi';

const FILIERES = ['Toutes', 'Genie Informatique', 'Genie Civil', 'Genie Electrique'];
const GROUPES  = ['Tous', 'Groupe A', 'Groupe B', 'Groupe C', 'Groupe D'];

export default function ManageGradesScreen({ navigation }) {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedFiliere, setFiliere] = useState('Toutes');
  const [selectedGroupe, setGroupe] = useState('Tous');

  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    load();
    return unsub;
  }, []);

  useEffect(() => {
    applyFilters();
  }, [students, search, selectedFiliere, selectedGroupe]);

  const load = async () => {
    try {
      const res = await usersApi.getStudents();
      setStudents(res.data || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...students];
    if (selectedFiliere !== 'Toutes')
      result = result.filter(s => s.filiere === selectedFiliere);
    if (selectedGroupe !== 'Tous')
      result = result.filter(s => s.group === selectedGroupe);
    if (search.trim())
      result = result.filter(s =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
      );
    setFiltered(result);
  };

  if (loading) return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color="#0D47A1" />
    </View>
  );

  return (
    <View style={styles.container}>

      {/* Recherche */}
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un etudiant..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filtre filiere */}
      <Text style={styles.filterLabel}>Filière</Text>
      <FlatList
        horizontal
        data={FILIERES}
        keyExtractor={i => i}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8, marginBottom: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chip, selectedFiliere === item && styles.chipActive]}
            onPress={() => setFiliere(item)}
          >
            <Text style={[styles.chipText, selectedFiliere === item && styles.chipTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Filtre groupe */}
      <Text style={styles.filterLabel}>Groupe</Text>
      <FlatList
        horizontal
        data={GROUPES}
        keyExtractor={i => i}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8, marginBottom: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chip, selectedGroupe === item && styles.chipActive]}
            onPress={() => setGroupe(item)}
          >
            <Text style={[styles.chipText, selectedGroupe === item && styles.chipTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.resultCount}>{filtered.length} etudiant(s)</Text>

      {/* Liste etudiants */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>Aucun etudiant trouve.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('StudentGrades', { student: item })}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.firstName.charAt(0)}{item.lastName.charAt(0)}
              </Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
              <Text style={styles.meta}>{item.filiere} — {item.group}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F9' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#888', fontSize: 15 },

  searchBox: { padding: 16, paddingBottom: 8 },
  searchInput: {
    backgroundColor: '#fff', borderRadius: 8, padding: 12,
    fontSize: 15, borderWidth: 1, borderColor: '#E0E0E0',
  },
  filterLabel: {
    fontSize: 11, fontWeight: '700', color: '#888',
    textTransform: 'uppercase', letterSpacing: 0.5,
    paddingHorizontal: 16, marginBottom: 6, marginTop: 4,
  },
  chip: {
    paddingVertical: 6, paddingHorizontal: 14,
    borderRadius: 20, borderWidth: 1, borderColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  chipActive: { backgroundColor: '#0D47A1', borderColor: '#0D47A1' },
  chipText: { fontSize: 13, color: '#555' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  resultCount: {
    fontSize: 12, color: '#888', paddingHorizontal: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 8,
    padding: 14, marginBottom: 8, elevation: 1,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#E8EEF7',
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  avatarText: { fontWeight: '700', color: '#0D47A1', fontSize: 15 },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '600', color: '#1a1a2e' },
  meta: { fontSize: 13, color: '#888', marginTop: 2 },
  arrow: { fontSize: 22, color: '#ccc' },
});