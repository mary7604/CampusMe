import { StyleSheet } from 'react-native';
import colors from './colors';

const font = {
  regular:  '400',
  semibold: '600',
  bold:     '700',
};

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
    fontSize: 22, fontWeight: font.bold,
    color: colors.white, marginBottom: 4,
  },
  studentEmail: {
    fontSize: 13, fontWeight: font.regular,
    color: colors.light,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
    flexWrap: 'wrap',            // 👈 retour ligne auto
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    maxWidth: 180,               // 👈 largeur max pour texte long
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: font.semibold,
    textAlign: 'center',
  },

  // STATS RAPIDES
  statsRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginHorizontal: 16, marginTop: 20, marginBottom: 10,
  },
  statBox: {
    flex: 1, backgroundColor: colors.card,
    borderRadius: 16, padding: 12, alignItems: 'center',
    marginHorizontal: 4, borderWidth: 1, borderColor: colors.light,
    elevation: 2, minHeight: 80,
  },
  statValue: {
    fontSize: 18,
    fontWeight: font.bold,
    color: colors.dark,
    textAlign: 'center',
    width: '100%',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: font.regular,
    color: colors.gray,
    marginTop: 6,
    textAlign: 'center',
  },

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
  infoLabel: { flex: 1, fontSize: 14, fontWeight: font.regular, color: colors.gray },
  infoValue: {
    fontSize: 14, fontWeight: font.semibold,
    color: colors.dark, flexShrink: 1, textAlign: 'right',
  },

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
  menuLabel: { flex: 1, fontSize: 15, fontWeight: font.semibold, color: colors.dark },
  menuArrow: { fontSize: 22, fontWeight: font.regular, color: colors.primary },

  // LOGOUT
  logoutBtn: {
    backgroundColor: '#FFF0F0',
    borderRadius: 14, height: 54,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 30, borderWidth: 1.5, borderColor: colors.error,
  },
  logoutText: { color: colors.error, fontSize: 16, fontWeight: font.bold },
});