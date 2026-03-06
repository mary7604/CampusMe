import { StyleSheet } from 'react-native';

export const colors = {
  dark:      '#0D47A1',
  primary:   '#1565C0',
  secondary: '#1E88E5',
  accent:    '#42A5F5',
  light:     '#90CAF9',
  card:      '#F0F6FF',
  white:     '#FFFFFF',
  gray:      '#78909C',
};

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  // HEADER
  header: {
    backgroundColor: colors.dark,
    paddingTop: 80,
    paddingBottom: 50,
    paddingHorizontal: 28,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: colors.dark,
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.white,
    letterSpacing: 0.5,
  },
  date: {
    fontSize: 13,
    color: colors.light,
    marginTop: 6,
    fontStyle: 'italic',
  },
  avatarRing: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: colors.white,
    fontSize: 22,
    fontWeight: 'bold',
  },

  // PROCHAIN COURS
  nextCard: {
    backgroundColor: colors.primary,
    borderRadius: 22,
    padding: 22,
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 30,
    shadowColor: colors.dark,
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  nextCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  nextCardLabel: {
    color: colors.light,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  badge: {
    backgroundColor: colors.accent,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  nextSubject: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  pill: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  pillText: {
    color: colors.light,
    fontSize: 12,
    fontWeight: '500',
  },
  navBtn: {
    backgroundColor: colors.white,
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.dark,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  navBtnText: {
    color: colors.dark,
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  // SECTIONS
  section: {
    paddingHorizontal: 28,
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 14,
    letterSpacing: 0.2,
  },

  // STATS
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: colors.gray,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // ACCÈS RAPIDE
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickCard: {
    width: '47%',
    borderRadius: 14,
    padding: 18,
    minHeight: 80,
    justifyContent: 'flex-end',
    elevation: 4,
  },
  quickDark: {
    backgroundColor: colors.dark,
    shadowColor: colors.dark,
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  quickLight: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  quickLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    lineHeight: 18,
    letterSpacing: 0.2,
  },

  // ANNONCES
  announcementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  dotBox: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.dark,
  },
  announcementContent: {
    flex: 1,
    paddingLeft: 4,
  },
  announcementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 3,
  },
  announcementMeta: {
    fontSize: 12,
    color: colors.gray,
  },
  arrow: {
    fontSize: 26,
    color: colors.light,
    fontWeight: '300',
  },
});