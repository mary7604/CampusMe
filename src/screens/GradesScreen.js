import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import colors from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import { gradesStyles } from '../styles/GradesStyles';

const GRADES = {
  s1: [
    { id: 1, subject: "Algorithmique",    note: 15.5, coef: 3, prof: "Dr. Amine" },
    { id: 2, subject: "Mathématiques",    note: 12.0, coef: 2, prof: "Dr. Nadia" },
    { id: 3, subject: "Base de données",  note: 16.0, coef: 3, prof: "Dr. Sara"  },
    { id: 4, subject: "Réseaux",          note: 13.5, coef: 2, prof: "Dr. Youssef"},
    { id: 5, subject: "Anglais Tech",     note: 17.0, coef: 1, prof: "Mme. Leila"},
    { id: 6, subject: "Systèmes d'exp.",  note: 11.0, coef: 2, prof: "Dr. Amine" },
  ],
  s2: [
    { id: 7, subject: "React Native",     note: 18.0, coef: 3, prof: "Dr. Karim" },
    { id: 8, subject: "NestJS Backend",   note: 16.5, coef: 3, prof: "Dr. Karim" },
    { id: 9, subject: "Projet Mobile",    note: 17.5, coef: 4, prof: "Dr. Karim" },
    { id: 10, subject: "Sécurité Info",   note: 14.0, coef: 2, prof: "Dr. Sara"  },
  ],
};

function getMoyenne(grades) {
  const total = grades.reduce((sum, g) => sum + g.note * g.coef, 0);
  const coefs = grades.reduce((sum, g) => sum + g.coef, 0);
  return (total / coefs).toFixed(2);
}

function getColor(note) {
  if (note >= 16) return colors.success;
  if (note >= 12) return colors.primary;
  if (note >= 10) return colors.secondary;
  return colors.error;
}

function getStatus(note) {
  if (note >= 16) return { text: "Excellent ⭐", color: colors.success };
  if (note >= 12) return { text: "Bien ✅",      color: colors.primary };
  if (note >= 10) return { text: "Passable",     color: colors.secondary };
  return           { text: "Insuffisant ⚠️",    color: colors.error };
}

export default function GradesScreen() {
  const [semester, setSemester] = useState('s1');
  const grades = GRADES[semester];
  const moyenne = getMoyenne(grades);
  const meilleure = Math.max(...grades.map(g => g.note));
  const admis = grades.filter(g => g.note >= 10).length;

  return (
    <View style={globalStyles.container}>

      {/* HEADER */}
      <View style={globalStyles.header}>
        <Text style={globalStyles.headerTitle}>Mes Notes</Text>
        <Text style={globalStyles.headerSubtitle}>Année universitaire 2025 — 2026</Text>
      </View>

      {/* RÉSUMÉ */}
      <View style={gradesStyles.summaryRow}>
        <View style={[gradesStyles.summaryBox, { backgroundColor: colors.dark }]}>
          <Text style={gradesStyles.summaryValue}>{moyenne}</Text>
          <Text style={gradesStyles.summaryLabel}>Moyenne</Text>
        </View>
        <View style={[gradesStyles.summaryBox, { backgroundColor: colors.primary }]}>
          <Text style={gradesStyles.summaryValue}>{meilleure}</Text>
          <Text style={gradesStyles.summaryLabel}>Meilleure note</Text>
        </View>
        <View style={[gradesStyles.summaryBox, { backgroundColor: colors.secondary }]}>
          <Text style={gradesStyles.summaryValue}>{admis}/{grades.length}</Text>
          <Text style={gradesStyles.summaryLabel}>Admis</Text>
        </View>
      </View>

      {/* TABS SEMESTRE */}
      <View style={gradesStyles.semesterRow}>
        {['s1', 's2'].map((s) => (
          <TouchableOpacity
            key={s}
            style={[gradesStyles.semesterBtn, semester === s && gradesStyles.semesterBtnActive]}
            onPress={() => setSemester(s)}
          >
            <Text style={[gradesStyles.semesterText, semester === s && gradesStyles.semesterTextActive]}>
              {s === 's1' ? 'Semestre 1' : 'Semestre 2'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LISTE NOTES */}
      <ScrollView style={gradesStyles.content} showsVerticalScrollIndicator={false}>
        {grades.map((grade) => {
          const status = getStatus(grade.note);
          const progress = (grade.note / 20) * 100;
          return (
            <View key={grade.id} style={gradesStyles.gradeCard}>

              {/* Entête matière + note */}
              <View style={gradesStyles.gradeHeader}>
                <Text style={gradesStyles.gradeSubject}>{grade.subject}</Text>
                <View style={[gradesStyles.gradeBadge, { backgroundColor: getColor(grade.note) }]}>
                  <Text style={gradesStyles.gradeBadgeText}>{grade.note}/20</Text>
                </View>
              </View>

              {/* Barre de progression */}
              <View style={gradesStyles.progressBg}>
                <View style={[gradesStyles.progressFill, {
                  width: `${progress}%`,
                  backgroundColor: getColor(grade.note),
                }]} />
              </View>

              {/* Détails */}
              <View style={gradesStyles.gradeRow}>
                <Text style={gradesStyles.gradeDetail}> {grade.prof}  •  Coef. {grade.coef}</Text>
                <Text style={[gradesStyles.gradeStatus, { color: status.color }]}>{status.text}</Text>
              </View>

            </View>
          );
        })}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}
