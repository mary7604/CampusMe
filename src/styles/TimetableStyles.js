import { StyleSheet } from 'react-native';
import colors from './colors';

export const timetableStyles = StyleSheet.create({

  // JOURS
  daysRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.white,
  },
  dayBtn: {
    flex: 1, alignItems: 'center',
    paddingVertical: 10, borderRadius: 14,
    marginHorizontal: 3,
  },
  dayBtnActive: { backgroundColor: colors.dark },
  dayName: { fontSize: 11, color: colors.gray, fontWeight: '600' },
  dayNameActive: { color: colors.white },
  dayNum: { fontSize: 17, fontWeight: 'bold', color: colors.dark, marginTop: 2 },
  dayNumActive: { color: colors.white },

  // COURS
  coursesList: { paddingHorizontal: 20, paddingTop: 8 },
  timeLabel: {
    fontSize: 12, color: colors.gray,
    marginBottom: 6, marginTop: 10, fontWeight: '600',
  },
  courseCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16, marginBottom: 12,
    borderWidth: 1, borderColor: colors.light,
    overflow: 'hidden', elevation: 2,
  },
  courseStripe: { width: 6 },
  courseContent: { flex: 1, padding: 14 },
  courseSubject: {
    fontSize: 16, fontWeight: 'bold', color: colors.dark, marginBottom: 6,
  },
  courseRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  courseDetail: { fontSize: 12, color: colors.gray, marginLeft: 5 },
  courseMapBtn: {
    justifyContent: 'center', paddingHorizontal: 14,
    backgroundColor: colors.card,
  },
  courseMapIcon: { fontSize: 22 },

  // VIDE
  emptyContainer: {
    alignItems: 'center', paddingVertical: 50,
  },
  emptyIcon: { fontSize: 50, marginBottom: 14 },
  emptyText: { fontSize: 16, color: colors.gray, fontWeight: '600' },
  emptySubText: { fontSize: 13, color: colors.light, marginTop: 6 },
});
