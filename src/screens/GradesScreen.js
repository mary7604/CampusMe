import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import colors from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import { gradesStyles } from '../styles/GradesStyles';
import useGrades from '../hooks/useGrades';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notificationService from '../services/notificationService';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { useTranslation } from 'react-i18next';

function getColor(note) {

  if (note >= 16) return colors.success;
  if (note >= 12) return colors.primary;
  if (note >= 10) return colors.secondary;
  return colors.error;
}

function getStatus(note) {
  if (note >= 16) return { text: 'Excellent', color: colors.success };
  if (note >= 12) return { text: 'Bien',      color: colors.primary };
  if (note >= 10) return { text: 'Passable',  color: colors.secondary };
  return           { text: 'Insuffisant',     color: colors.error };
}

export default function GradesScreen() {
  // const { t } = useTranslation(); 
  const { grades, average, loading, error } = useGrades();
  useEffect(() => {
  const checkNewGrades = async () => {
    if (grades.length === 0) return;
    const lastCount = await AsyncStorage.getItem('last_grades_count');
const lastNum = lastCount !== null ? parseInt(lastCount) : grades.length;
if (grades.length > lastNum) {
      notificationService.sendLocalNotification(
        'Nouvelle note disponible',
        `${grades.length - lastNum} nouvelle(s) note(s) ajoutée(s) par vos professeurs.`
      );
    }
    await AsyncStorage.setItem('last_grades_count', String(grades.length));
  };
  checkNewGrades();
}, [grades]);
  const [semester, setSemester] = useState('S1');

  const filtered = grades.filter(g =>
    g.semester?.toUpperCase() === semester.toUpperCase()
  );

  const meilleure = filtered.length > 0
    ? Math.max(...filtered.map(g => g.note))
    : 0;

  const admis = filtered.filter(g => g.note >= 10).length;

  const semesters = [...new Set(grades.map(g => g.semester))].sort();

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  if (error) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ color: colors.error, textAlign: 'center' }}>{error}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
    <View style={globalStyles.container}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.headerTitle}>Mes Notes</Text>
        <Text style={globalStyles.headerSubtitle}>Année universitaire 2025 — 2026</Text>
      </View>

      {/* RÉSUMÉ */}
      <View style={gradesStyles.summaryRow}>
        <View style={[gradesStyles.summaryBox, { backgroundColor: colors.dark }]}>
          <Text style={gradesStyles.summaryValue}>{average ?? '—'}</Text>
          <Text style={gradesStyles.summaryLabel}>Moyenne</Text>
        </View>
        <View style={[gradesStyles.summaryBox, { backgroundColor: colors.primary }]}>
          <Text style={gradesStyles.summaryValue}>{meilleure || '—'}</Text>
          <Text style={gradesStyles.summaryLabel}>Meilleure note</Text>
        </View>
        <View style={[gradesStyles.summaryBox, { backgroundColor: colors.secondary }]}>
          <Text style={gradesStyles.summaryValue}>{admis}/{filtered.length}</Text>
          <Text style={gradesStyles.summaryLabel}>Admis</Text>
        </View>
      </View>

      {/* TABS SEMESTRE — générés depuis les données réelles */}
      <View style={gradesStyles.semesterRow}>
        {(semesters.length > 0 ? semesters : ['S1', 'S2']).map((s) => (
          <TouchableOpacity
            key={s}
            style={[gradesStyles.semesterBtn, semester === s && gradesStyles.semesterBtnActive]}
            onPress={() => setSemester(s)}
          >
            <Text style={[gradesStyles.semesterText, semester === s && gradesStyles.semesterTextActive]}>
              Semestre {s.replace('S', '')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LISTE NOTES */}
      <ScrollView style={gradesStyles.content} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: colors.gray, fontSize: 15 }}>
              Aucune note pour ce semestre.
            </Text>
          </View>
        ) : (
          filtered.map((grade) => {
            const status   = getStatus(grade.note);
            const progress = (grade.note / 20) * 100;
            return (
              <View key={grade.id} style={gradesStyles.gradeCard}>
                <View style={gradesStyles.gradeHeader}>
                  <Text style={gradesStyles.gradeSubject}>{grade.subject}</Text>
                  <View style={[gradesStyles.gradeBadge, { backgroundColor: getColor(grade.note) }]}>
                    <Text style={gradesStyles.gradeBadgeText}>{grade.note}/20</Text>
                  </View>
                </View>
                <View style={gradesStyles.progressBg}>
                  <View style={[gradesStyles.progressFill, {
                    width: `${progress}%`,
                    backgroundColor: getColor(grade.note),
                  }]} />
                </View>
                <View style={gradesStyles.gradeRow}>
                  <Text style={gradesStyles.gradeDetail}>
                    {grade.professor || 'Professeur'}  •  Coef. {grade.coef}
                  </Text>
                  <Text style={[gradesStyles.gradeStatus, { color: status.color }]}>
                    {status.text}
                  </Text>
                </View>
              </View>
            );
          })
        )}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  </SafeAreaView>
  );
}