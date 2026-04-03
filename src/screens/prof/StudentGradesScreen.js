import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  ActivityIndicator, Alert, StyleSheet, Modal,
  TextInput, ScrollView
} from 'react-native';
import gradesApi from '../../api/gradesApi';

export default function StudentGradesScreen({ route, navigation }) {
  const { student } = route.params;
  const [grades, setGrades] = useState([]);
  const [average, setAverage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [subject, setSubject] = useState('');
  const [note, setNote] = useState('');
  const [coef, setCoef] = useState('1');
  const [semester, setSemester] = useState('S1');
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await gradesApi.getGrades(student.id);
      setGrades(res.data.grades || []);
      setAverage(res.data.average);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setSubject(''); setNote(''); setCoef('1'); setSemester('S1');
    setModalVisible(true);
  };

  const openEdit = (grade) => {
    setEditing(grade);
    setSubject(grade.subject);
    setNote(grade.note.toString());
    setCoef(grade.coef.toString());
    setSemester(grade.semester);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!subject || !note || !coef || !semester) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await gradesApi.updateGrade(editing.id, {
          subject, note: parseFloat(note),
          coef: parseFloat(coef), semester,
        });
      } else {
        await gradesApi.addGrade({
          studentId: student.id,
          subject, note: parseFloat(note),
          coef: parseFloat(coef), semester,
        });
      }
      setModalVisible(false);
      load();
    } catch (e) {
      Alert.alert('Erreur', e.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Supprimer', 'Confirmer la suppression de cette note ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer', style: 'destructive',
        onPress: async () => {
          try {
            await gradesApi.deleteGrade(id);
            load();
          } catch (e) {
            Alert.alert('Erreur', 'Suppression impossible.');
          }
        }
      }
    ]);
  };

  if (loading) return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color="#0D47A1" />
    </View>
  );

  return (
    <View style={styles.container}>

      {/* En-tete etudiant */}
      <View style={styles.studentHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {student.firstName.charAt(0)}{student.lastName.charAt(0)}
          </Text>
        </View>
        <View>
          <Text style={styles.studentName}>{student.firstName} {student.lastName}</Text>
          <Text style={styles.studentMeta}>{student.filiere} — {student.group}</Text>
        </View>
        {average !== null && (
          <View style={styles.avgBadge}>
            <Text style={styles.avgValue}>{average}</Text>
            <Text style={styles.avgLabel}>Moy.</Text>
          </View>
        )}
      </View>

      <FlatList
        data={grades}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>Aucune note saisie pour cet etudiant.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.gradeCard}>
            <View style={styles.gradeLeft}>
              <Text style={styles.gradeSubject}>{item.subject}</Text>
              <Text style={styles.gradeMeta}>
                Coef. {item.coef} — {item.semester}
              </Text>
            </View>
            <View style={styles.gradeRight}>
              <Text style={styles.gradeNote}>{item.note}/20</Text>
              <View style={styles.gradeActions}>
                <TouchableOpacity
                  style={styles.btnEdit}
                  onPress={() => openEdit(item)}
                >
                  <Text style={styles.btnEditText}>Modifier</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnDelete}
                  onPress={() => handleDelete(item.id)}
                >
                  <Text style={styles.btnDeleteText}>Supp.</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
        <Text style={styles.addBtnText}>Ajouter une note</Text>
      </TouchableOpacity>

      {/* Modal saisie / modification */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {editing ? 'Modifier la note' : 'Ajouter une note'}
            </Text>
            <ScrollView>
              <Text style={styles.label}>Matière</Text>
              <TextInput
                style={styles.input}
                value={subject}
                onChangeText={setSubject}
                placeholder="Ex : Bases de données"
              />
              <Text style={styles.label}>Note (/20)</Text>
              <TextInput
                style={styles.input}
                value={note}
                onChangeText={setNote}
                keyboardType="numeric"
                placeholder="Ex : 15.5"
              />
              <Text style={styles.label}>Coefficient</Text>
              <TextInput
                style={styles.input}
                value={coef}
                onChangeText={setCoef}
                keyboardType="numeric"
                placeholder="Ex : 2"
              />
              <Text style={styles.label}>Semestre</Text>
              <View style={styles.semRow}>
                {['S1', 'S2', 'S3', 'S4'].map(s => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.semBtn, semester === s && styles.semBtnActive]}
                    onPress={() => setSemester(s)}
                  >
                    <Text style={[styles.semBtnText, semester === s && styles.semBtnTextActive]}>
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSave, saving && { opacity: 0.7 }]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.modalSaveText}>Enregistrer</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F9' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#888', fontSize: 15 },

  studentHeader: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', padding: 16,
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
    gap: 12,
  },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#E8EEF7',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontWeight: '700', color: '#0D47A1', fontSize: 16 },
  studentName: { fontSize: 16, fontWeight: '700', color: '#1a1a2e' },
  studentMeta: { fontSize: 13, color: '#888', marginTop: 2 },
  avgBadge: {
    marginLeft: 'auto', backgroundColor: '#E8EEF7',
    borderRadius: 8, padding: 10, alignItems: 'center',
  },
  avgValue: { fontSize: 18, fontWeight: '700', color: '#0D47A1' },
  avgLabel: { fontSize: 11, color: '#888' },

  gradeCard: {
    backgroundColor: '#fff', borderRadius: 8, padding: 14,
    marginBottom: 10, flexDirection: 'row',
    alignItems: 'center', elevation: 1,
  },
  gradeLeft: { flex: 1 },
  gradeSubject: { fontSize: 15, fontWeight: '600', color: '#1a1a2e' },
  gradeMeta: { fontSize: 12, color: '#888', marginTop: 3 },
  gradeRight: { alignItems: 'flex-end', gap: 8 },
  gradeNote: { fontSize: 18, fontWeight: '700', color: '#0D47A1' },
  gradeActions: { flexDirection: 'row', gap: 6 },
  btnEdit: {
    paddingVertical: 4, paddingHorizontal: 10,
    borderRadius: 4, borderWidth: 1, borderColor: '#0D47A1',
  },
  btnEditText: { fontSize: 12, color: '#0D47A1', fontWeight: '600' },
  btnDelete: {
    paddingVertical: 4, paddingHorizontal: 10,
    borderRadius: 4, backgroundColor: '#FDECEA',
  },
  btnDeleteText: { fontSize: 12, color: '#C62828', fontWeight: '600' },

  addBtn: {
    backgroundColor: '#0D47A1', margin: 16,
    padding: 16, borderRadius: 8, alignItems: 'center',
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#fff', borderTopLeftRadius: 16,
    borderTopRightRadius: 16, padding: 24, maxHeight: '85%',
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a2e', marginBottom: 16 },
  label: {
    fontSize: 12, fontWeight: '700', color: '#666',
    textTransform: 'uppercase', letterSpacing: 0.5,
    marginBottom: 6, marginTop: 14,
  },
  input: {
    backgroundColor: '#F4F6F9', borderRadius: 8,
    padding: 12, fontSize: 15, color: '#1a1a2e',
    borderWidth: 1, borderColor: '#E0E0E0',
  },
  semRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  semBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 6,
    borderWidth: 1, borderColor: '#E0E0E0',
    alignItems: 'center', backgroundColor: '#fff',
  },
  semBtnActive: { backgroundColor: '#0D47A1', borderColor: '#0D47A1' },
  semBtnText: { fontSize: 14, color: '#555', fontWeight: '600' },
  semBtnTextActive: { color: '#fff' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  modalCancel: {
    flex: 1, padding: 14, borderRadius: 8,
    borderWidth: 1, borderColor: '#E0E0E0', alignItems: 'center',
  },
  modalCancelText: { color: '#555', fontWeight: '600' },
  modalSave: {
    flex: 1, padding: 14, borderRadius: 8,
    backgroundColor: '#0D47A1', alignItems: 'center',
  },
  modalSaveText: { color: '#fff', fontWeight: '700' },
});