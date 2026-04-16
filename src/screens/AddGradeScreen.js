import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import colors from '../styles/colors';
import gradesApi from '../api/gradesApi';
import useAuth from '../hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { useTranslation } from 'react-i18next';


export default function AddGradeScreen({ navigation }) {
  const { user } = useAuth();
  const route = useRoute();
  const selectedStudent = route.params?.student;
  // const { t } = useTranslation(); 
  const [studentId, setStudentId] = useState(selectedStudent?.id?.toString() || '');
  const [subject, setSubject] = useState('');
  const [note, setNote] = useState('');
  const [coef, setCoef] = useState('1');
  const [semester, setSemester] = useState('S1');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedStudent) {
      setStudentId(selectedStudent.id.toString());
    }
  }, [selectedStudent]);

  const handlePost = async () => {
    if (!studentId || !subject || !note || !coef || !semester) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    try {
      setLoading(true);
      await gradesApi.addGrade({
        studentId: parseInt(studentId, 10),
        subject,
        note: parseFloat(note),
        coef: parseFloat(coef),
        semester
      });
      Alert.alert("Succès", "La note a été ajoutée avec succès !");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Erreur", "L'ajout de la note a échoué. Vérifiez l'ID de l'étudiant.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <SafeAreaView style={{ flex: 1 }} edges={[]}>
    <KeyboardAvoidingView style={globalStyles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{ padding: 24}}>
        
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 20 }}>
          <Text style={{ color: colors.primary, fontSize: 16 }}>← Retour</Text>
        </TouchableOpacity>

        <Text style={[globalStyles.sectionTitle, { fontSize: 28, marginBottom: 8 }]}>Saisir une Note</Text>
        <Text style={{ color: colors.gray, marginBottom: 30 }}>Ajoutez une note au dossier d'un étudiant.</Text>

        {selectedStudent ? (
          <View style={[globalStyles.inputContainer, { backgroundColor: colors.success + '20' }]}>
            <Text style={[globalStyles.inputIcon, { color: colors.success }]}>✅</Text>
            <Text style={{ fontWeight: 'bold' }}>{selectedStudent.firstName} {selectedStudent.lastName}</Text>
            <Text style={{ fontSize: 12, color: colors.gray }}>ID: {selectedStudent.id}</Text>
          </View>
        ) : (
          <TouchableOpacity style={globalStyles.inputContainer} onPress={() => navigation.navigate('StudentList')}>
            <Text style={globalStyles.inputIcon}>👥</Text>
            <Text style={globalStyles.input}>Sélectionner un étudiant</Text>
          </TouchableOpacity>
        )}

        <View style={globalStyles.inputContainer}>
          <TextInput
            style={globalStyles.input}
            placeholder="Matière (ex: Base de données)"
            placeholderTextColor={colors.gray}
            value={subject}
            onChangeText={setSubject}
          />
        </View>

        <View style={globalStyles.inputContainer}>
          <TextInput
            style={globalStyles.input}
            placeholder="Note (/20)"
            placeholderTextColor={colors.gray}
            value={note}
            onChangeText={setNote}
            keyboardType="numeric"
          />
        </View>

        <View style={globalStyles.inputContainer}>
          <TextInput
            style={globalStyles.input}
            placeholder="Coefficient"
            placeholderTextColor={colors.gray}
            value={coef}
            onChangeText={setCoef}
            keyboardType="numeric"
          />
        </View>

        <View style={[globalStyles.inputContainer, { marginBottom: 30 }]}>
          <TextInput
            style={globalStyles.input}
            placeholder="Semestre (ex: S1, S2)"
            placeholderTextColor={colors.gray}
            value={semester}
            onChangeText={setSemester}
          />
        </View>

        <TouchableOpacity 
          style={[globalStyles.primaryButton, loading && { opacity: 0.7 }]} 
          onPress={handlePost}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={globalStyles.primaryButtonText}>Enregistrer la note</Text>}
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
  );
}
