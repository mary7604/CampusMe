import { StyleSheet } from 'react-native';
import colors from './colors';

const font = {
  regular:  '400',
  semibold: '600',
  bold:     '700',
};

export const gradesStyles = StyleSheet.create({

  // RÉSUMÉ EN HAUT
  summaryRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginHorizontal: 16, marginTop: 20, marginBottom: 6,
  },
  summaryBox: {
    flex: 1, borderRadius: 16, padding: 14,
    alignItems: 'center', marginHorizontal: 4,
    elevation: 4, minHeight: 90,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: font.bold,
    color: colors.white,
    textAlign: 'center',
    width: '100%',                  // 👈 important pour adjustsFontSizeToFit
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: font.regular,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 6,
    textAlign: 'center',
  },

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
  semesterText: { fontSize: 14, fontWeight: font.semibold, color: colors.gray },
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
  gradeSubject: {
    fontSize: 15, fontWeight: font.bold,
    color: colors.dark, flex: 1, marginRight: 8, // 👈 flex pour éviter overflow
  },
  gradeBadge: {
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4,
  },
  gradeBadgeText: { fontSize: 16, fontWeight: font.bold, color: colors.white },

  // BARRE DE PROGRESSION
  progressBg: {
    height: 8, backgroundColor: colors.light,
    borderRadius: 10, marginBottom: 8,
  },
  progressFill: { height: 8, borderRadius: 10 },

  gradeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  gradeDetail: { fontSize: 12, fontWeight: font.regular, color: colors.gray },
  gradeStatus: { fontSize: 12, fontWeight: font.semibold },
});