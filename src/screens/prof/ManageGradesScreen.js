import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator, StyleSheet
} from 'react-native';
import gradesApi from '../../api/gradesApi';
import usersApi from '../../api/usersApi';

export default function ManageGradesScreen({ navigation }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    load();
    return unsub;
  }, []);

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

  if (loading) return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color="#0D47A1" />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        Sélectionnez un étudiant pour voir ou modifier ses notes.
      </Text>
      <FlatList
        data={students}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>Aucun étudiant trouvé.</Text>
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
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('StudentList')}
      >
        <Text style={styles.buttonText}>Saisir une note</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F9' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  subtitle: {
    fontSize: 13, color: '#666', paddingHorizontal: 16,
    paddingTop: 12, paddingBottom: 4,
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 8,
    padding: 14, marginBottom: 10, elevation: 1,
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
  arrow: { fontSize: 22, color: '#0D47A1' },
  emptyText: { color: '#888', fontSize: 15 },
  button: {
    backgroundColor: '#0D47A1', margin: 16,
    padding: 16, borderRadius: 8, alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});