import { StyleSheet } from 'react-native';
import colors from './colors';

export const mapStyles = StyleSheet.create({

  container: { flex: 1, backgroundColor: colors.background },

  header: {
    backgroundColor: colors.dark,
    paddingTop: 55, paddingBottom: 20, paddingHorizontal: 22,
    borderBottomLeftRadius: 25, borderBottomRightRadius: 25,
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: colors.white },
  headerSub: { fontSize: 13, color: colors.light, marginTop: 4 },

  mapContainer: {
    height: 260, marginHorizontal: 16, marginTop: 14,
    borderRadius: 20, overflow: 'hidden', elevation: 8,
  },
  map: { flex: 1 },

  loadingContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.card,
  },
  loadingText: { color: colors.dark, marginTop: 12, fontSize: 14 },

  markerContainer: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.white,
    elevation: 5,
  },
  markerIcon: { fontSize: 18 },

  callout: { padding: 8, minWidth: 120 },
  calloutTitle: { fontWeight: 'bold', color: colors.dark, fontSize: 13 },
  calloutDistance: { color: colors.primary, fontSize: 12, marginTop: 2 },

  myLocationBtn: {
    position: 'absolute', bottom: 12, right: 12,
    backgroundColor: colors.white, width: 44, height: 44,
    borderRadius: 22, alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.dark, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },

  filtersContainer: { paddingHorizontal: 16, paddingVertical: 12, maxHeight: 60 },
  filterBtn: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: colors.card, marginRight: 8,
    borderWidth: 1.5, borderColor: colors.light,
  },
  filterBtnActive: { backgroundColor: colors.dark, borderColor: colors.dark },
  filterText: { color: colors.primary, fontSize: 14, fontWeight: '600' },
  filterTextActive: { color: colors.white },

  selectedCard: {
    marginHorizontal: 16, marginTop: 4, backgroundColor: colors.card,
    borderRadius: 18, padding: 16, borderWidth: 1.5, borderColor: colors.primary,
    elevation: 4,
  },
  selectedHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  selectedIcon: { fontSize: 32, marginRight: 12 },
  selectedInfo: { flex: 1 },
  selectedName: { fontSize: 17, fontWeight: 'bold', color: colors.dark },
  selectedDistance: { fontSize: 13, color: colors.secondary, marginTop: 3 },
  favoriteBtn: { fontSize: 28 },
  selectedActions: { flexDirection: 'row', gap: 10 },

  actionBtn: {
    flex: 1, backgroundColor: colors.dark, borderRadius: 12,
    paddingVertical: 12, alignItems: 'center',
  },
  actionBtnText: { color: colors.white, fontWeight: 'bold', fontSize: 14 },
  actionBtnOutline: {
    flex: 1, borderWidth: 1.5, borderColor: colors.dark, borderRadius: 12,
    paddingVertical: 12, alignItems: 'center',
  },
  actionBtnOutlineText: { color: colors.dark, fontWeight: 'bold', fontSize: 14 },

  placesList: { flex: 1, paddingHorizontal: 16, marginTop: 4 },
  placesTitle: { fontSize: 16, fontWeight: 'bold', color: colors.dark, marginBottom: 10 },
  placeCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card, borderRadius: 14, padding: 13, marginBottom: 10,
    borderWidth: 1, borderColor: colors.light, elevation: 2,
  },
  placeIconBox: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  placeInfo: { flex: 1 },
  placeName: { fontSize: 14, fontWeight: '600', color: colors.dark },
  placeDistance: { fontSize: 12, color: colors.secondary, marginTop: 2 },
});