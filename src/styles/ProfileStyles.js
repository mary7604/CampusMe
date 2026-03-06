import { StyleSheet } from 'react-native';
import colors from './colors';

export const profileStyles = StyleSheet.create({

  // HEADER
  header: {
    backgroundColor: colors.dark,
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 35,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    elevation: 10,
  },
  avatarCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: colors.accent,
    marginBottom: 14,
  },
  avatarEmoji: { fontSize: 44 },
  studentName: {
    fontSize: 22, fontWeight: 'bold',
    color: colors.white, marginBottom: 4,
  },
  studentEmail: { fontSize: 13, color: colors.light },
  badgeRow: {
    flexDirection: 'row', marginTop: 12, gap: 8,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
  },
  badgeText: { color: colors.white, fontSize: 12, fontWeight: '600' },

  // STATS RAPIDES
  statsRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginHorizontal: 20, marginTop: 20, marginBottom: 10,
  },
  statBox: {
    flex: 1, backgroundColor: colors.card,
    borderRadius: 16, padding: 14, alignItems: 'center',
    marginHorizontal: 5, borderWidth: 1, borderColor: colors.light,
    elevation: 2,
  },
  statValue: { fontSize: 22, fontWeight: 'bold', color: colors.dark },
  statLabel: { fontSize: 11, color: colors.gray, marginTop: 4 },

  // INFOS
  content: { paddingHorizontal: 20, paddingTop: 10 },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 16, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: colors.light, elevation: 2,
  },
  infoRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: colors.light,
  },
  infoRowLast: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
  },
  infoIcon: { fontSize: 20, width: 36 },
  infoLabel: { flex: 1, fontSize: 14, color: colors.gray },
  infoValue: { fontSize: 14, fontWeight: '600', color: colors.dark },

  // MENU
  menuCard: {
    backgroundColor: colors.card,
    borderRadius: 16, marginBottom: 14,
    borderWidth: 1, borderColor: colors.light, elevation: 2,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, borderBottomWidth: 1, borderBottomColor: colors.light,
  },
  menuItemLast: {
    flexDirection: 'row', alignItems: 'center', padding: 16,
  },
  menuIcon: { fontSize: 22, width: 40 },
  menuLabel: { flex: 1, fontSize: 15, color: colors.dark, fontWeight: '500' },
  menuArrow: { fontSize: 22, color: colors.primary },

  // LOGOUT
  logoutBtn: {
    backgroundColor: '#FFF0F0',
    borderRadius: 14, height: 54,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 30, borderWidth: 1.5, borderColor: colors.error,
  },
  logoutText: { color: colors.error, fontSize: 16, fontWeight: 'bold' },
});
