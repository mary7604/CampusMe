import { StyleSheet } from 'react-native';
import colors from './colors';

export const gradesStyles = StyleSheet.create({

  // RÉSUMÉ EN HAUT
  summaryRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginHorizontal: 20, marginTop: 20, marginBottom: 6,
  },
  summaryBox: {
    flex: 1, borderRadius: 16, padding: 16,
    alignItems: 'center', marginHorizontal: 5, elevation: 4,
  },
  summaryValue: { fontSize: 26, fontWeight: 'bold', color: colors.white },
  summaryLabel: { fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 4 },

  // SEMESTRE TABS
  semesterRow: {
    flexDirection: 'row', paddingHorizontal: 20,
    paddingVertical: 12,
  },
  semesterBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 12,
    alignItems: 'center', marginHorizontal: 4,
    backgroundColor: colors.card,
    borderWidth: 1.5, borderColor: colors.light,
  },
  semesterBtnActive: {
    backgroundColor: colors.dark,
    borderColor: colors.dark,
  },
  semesterText: { fontSize: 14, fontWeight: '600', color: colors.gray },
  semesterTextActive: { color: colors.white },

  // MATIÈRE CARD
  content: { paddingHorizontal: 20 },
  gradeCard: {
    backgroundColor: colors.card,
    borderRadius: 16, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: colors.light, elevation: 2,
  },
  gradeHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10,
  },
  gradeSubject: { fontSize: 15, fontWeight: 'bold', color: colors.dark },
  gradeBadge: {
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4,
  },
  gradeBadgeText: { fontSize: 16, fontWeight: 'bold', color: colors.white },

  // BARRE DE PROGRESSION
  progressBg: {
    height: 8, backgroundColor: colors.light,
    borderRadius: 10, marginBottom: 8,
  },
  progressFill: { height: 8, borderRadius: 10 },

  gradeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  gradeDetail: { fontSize: 12, color: colors.gray },
  gradeStatus: { fontSize: 12, fontWeight: '600' },
});
