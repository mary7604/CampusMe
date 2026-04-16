import { StyleSheet } from 'react-native';

export const colors = {
  dark:      '#0D47A1',
  primary:   '#1565C0',
  secondary: '#1E88E5',
  accent:    '#42A5F5',
  light:     '#90CAF9',
  card:      '#F7FAFF',
  white:     '#FFFFFF',
  gray:      '#78909C',
  border:    '#DCEEFF',
  text:      '#0A1929',
  textSoft:  '#4A6080',
};

const font = {
  regular:  '400',
  semibold: '600',
  bold:     '700',
};

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },

  // ─── HEADER ───────────────────────────────────────────────
  header: {
    backgroundColor: colors.dark,
    paddingTop: 28,
    paddingBottom: 36,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 8,
    shadowColor: '#0D47A1',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: font.bold,
    color: colors.white,
    letterSpacing: -0.3,
  },
  date: {
    fontSize: 13,
    fontWeight: font.regular,
    color: 'rgba(144, 202, 249, 0.85)',
    marginTop: 4,
  },
  avatarRing: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: colors.white,
    fontSize: 18,
    fontWeight: font.bold,
  },

  // ─── PROCHAIN COURS ────────────────────────────────────────
  nextCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 18,
    marginTop: -16,
    marginBottom: 20,
    elevation: 10,
    shadowColor: '#0D47A1',
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  nextCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  nextCardLabel: {
    color: 'rgba(144,202,249,0.9)',
    fontSize: 11,
    fontWeight: font.semibold,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  nextSubject: {
    color: colors.white,
    fontSize: 22,
    fontWeight: font.bold,
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  pill: {
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  pillText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: font.semibold,
  },
  navBtn: {
    backgroundColor: colors.white,
    borderRadius: 12,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  navBtnText: {
    color: colors.dark,
    fontSize: 14,
    fontWeight: font.bold,
    letterSpacing: 0.3,
  },

  // ─── SECTIONS ─────────────────────────────────────────────
  section: {
    paddingHorizontal: 18,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: font.bold,
    color: colors.text,
    marginBottom: 12,
    letterSpacing: -0.1,
  },

  // ─── STATS ────────────────────────────────────────────────
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#1565C0',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  statValue: {
    fontSize: 20,
    fontWeight: font.bold,
    color: colors.dark,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: font.semibold,
    color: colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  // ─── ACCÈS RAPIDE ─────────────────────────────────────────
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickCard: {
    width: '47.5%',
    borderRadius: 16,
    padding: 18,
    minHeight: 84,
    justifyContent: 'flex-end',
    elevation: 3,
  },
  quickDark: {
    backgroundColor: colors.dark,
    shadowColor: '#0D47A1',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  quickLight: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#1565C0',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  quickLabel: {
    fontSize: 13,
    fontWeight: font.bold,
    lineHeight: 19,
    letterSpacing: -0.1,
  },

  // ─── ANNONCES ─────────────────────────────────────────────
  // ─── SECTION ROW (titre + bouton inline) ──────────────────
sectionRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
},
seeAllBtnInline: {
  paddingVertical: 5,
  paddingHorizontal: 12,
  borderRadius: 20,
  borderWidth: 1.5,
  borderColor: colors.dark,
},
seeAllTextInline: {
  color: colors.dark,
  fontSize: 12,
  fontWeight: '700',
},

// ─── ANNONCES (mise à jour) ────────────────────────────────
announcementCard: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: colors.card,      // #F7FAFF au lieu de white
  borderRadius: 16,
  padding: 14,
  marginBottom: 10,
  borderWidth: 1,
  borderColor: colors.border,        // #DCEEFF
  elevation: 2,
  shadowColor: '#1565C0',
  shadowOpacity: 0.07,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 2 },
},
announcementDescription: {
  fontSize: 13,
  color: colors.textSoft,            // #4A6080
  marginBottom: 4,
},
announcementTitle: {
  fontSize: 14,
  fontWeight: '600',
  color: '#1565C0',      // ← bleu frais au lieu de colors.text
  marginBottom: 3,
  letterSpacing: -0.1,
},

announcementDescription: {
  fontSize: 13,
  color: colors.textSoft,
  marginBottom: 4,
},

announcementMeta: {
  fontSize: 11,
  fontWeight: '400',     // ← mince
  fontStyle: 'italic',   // ← italique
  color: colors.gray,
},
});
