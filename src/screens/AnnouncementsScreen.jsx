import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StatusBar, ActivityIndicator, StyleSheet,
  RefreshControl, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import announcementsApi from '../api/announcementsApi';
import useAuth from '../hooks/useAuth';

// ─── palette (reprend les couleurs de HomeStyles) ───────────────────────────
const C = {
  dark:    '#0D47A1',   // était #1A1A2E
  primary: '#1565C0',   // était #4F8EF7
  white:   '#FFFFFF',
  gray:    '#78909C',   // était #8A8A9A
  card:    '#F7FAFF',   // était #F4F6FB
  border:  '#DCEEFF',   // était #E8ECF4
  unread:  '#EAF1FF',
  badge:   '#FF4D6D',
};

// ─── helpers ────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'read_announcements';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

// ─── AnnouncementsScreen ────────────────────────────────────────────────────
export default function AnnouncementsScreen({ navigation }) {
  const { user } = useAuth();

  const [announcements, setAnnouncements]   = useState([]);
  const [filtered,      setFiltered]        = useState([]);
  const [readIds,       setReadIds]         = useState(new Set());
  const [search,        setSearch]          = useState('');
  const [loading,       setLoading]         = useState(true);
  const [refreshing,    setRefreshing]      = useState(false);

  // ── load read IDs from storage ──────────────────────────────────────────
  const loadReadIds = async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  };

  const markAsRead = async (id) => {
    const next = new Set(readIds);
    next.add(id);
    setReadIds(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
  };

  // ── fetch ───────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    try {
      const [res, ids] = await Promise.all([
        announcementsApi.getMy().catch(() => ({ data: [] })),
        loadReadIds(),
      ]);
      const data = res.data || [];
      // newest first
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAnnouncements(data);
      setFiltered(data);
      setReadIds(ids);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── search filter ───────────────────────────────────────────────────────
  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      q
        ? announcements.filter(
            (a) =>
              a.title.toLowerCase().includes(q) ||
              a.content.toLowerCase().includes(q) ||
              (a.profName || '').toLowerCase().includes(q)
          )
        : announcements
    );
  }, [search, announcements]);

  // ── unread count badge ──────────────────────────────────────────────────
  const unreadCount = announcements.filter((a) => !readIds.has(a.id)).length;

  // ── render item ─────────────────────────────────────────────────────────
  const renderItem = ({ item }) => {
    const isUnread = !readIds.has(item.id);
    return (
      <TouchableOpacity
        style={[styles.card, isUnread && styles.cardUnread]}
        activeOpacity={0.75}
        onPress={() => {
          markAsRead(item.id);
          navigation.navigate('AnnouncementDetail', { announcement: item });
        }}
      >
        {/* unread dot */}
        {isUnread && <View style={styles.unreadDot} />}

        <View style={styles.cardBody}>
          <View style={styles.cardTop}>
            <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
          </View>
          <Text style={styles.cardPreview} numberOfLines={2}>{item.content}</Text>
          <View style={styles.cardFooter}>
            <View style={styles.profBadge}>
              <Text style={styles.profInitial}>
                {(item.profName || 'P').charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.profName}>{item.profName || 'Professeur'}</Text>
            {item.targetGroup && item.targetGroup !== 'all' && (
              <View style={styles.groupTag}>
                <Text style={styles.groupTagText}>{item.targetGroup}</Text>
              </View>
            )}
          </View>
        </View>

        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
    );
  };

  // ── UI ───────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={C.dark} />

      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Annonces</Text>
          {unreadCount > 0 && (
            <Text style={styles.headerSub}>{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</Text>
          )}
        </View>
        {unreadCount > 0 && (
          <View style={styles.badgeBox}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>

      {/* search */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une annonce..."
          placeholderTextColor={C.gray}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* list */}
      {loading ? (
        <ActivityIndicator color={C.primary} style={{ marginTop: 40 }} size="large" />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); load(); }}
              tintColor={C.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>Aucune annonce trouvée</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

// ─── styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: '#0D47A1' },

  // header
  header:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, gap: 12 },
  backBtn:       { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  backArrow:     { color: C.white, fontSize: 22, lineHeight: 26 },
  headerTitle:   { color: C.white, fontSize: 22, fontWeight: '700' },
  headerSub:     { color: 'rgba(255,255,255,0.55)', fontSize: 12, marginTop: 1 },
  badgeBox:      { marginLeft: 'auto', backgroundColor: C.badge, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText:     { color: C.white, fontSize: 12, fontWeight: '700' },

  // search
  searchBox:     { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)', marginHorizontal: 20, marginBottom: 12, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10 },
  searchIcon:    { fontSize: 14, marginRight: 8 },
  searchInput:   { flex: 1, color: C.white, fontSize: 14 },
  clearBtn:      { color: C.gray, fontSize: 14, paddingLeft: 8 },

  // list
  list:          { paddingHorizontal: 16, paddingBottom: 32, backgroundColor: C.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, minHeight: '100%' },

  // card
  card:          { flexDirection: 'row', alignItems: 'center', backgroundColor: C.white, borderRadius: 16, marginTop: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  cardUnread:    { backgroundColor: C.unread, borderLeftWidth: 3, borderLeftColor: C.primary },
  unreadDot:     { width: 8, height: 8, borderRadius: 4, backgroundColor: C.primary, position: 'absolute', top: 14, left: 14 },
  cardBody:      { flex: 1, paddingLeft: 4 },
  cardTop:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  cardTitle:     { fontSize: 15, fontWeight: '700', color: C.dark, flex: 1, marginRight: 8 },
  cardDate:      { fontSize: 11, color: C.gray, marginTop: 2 },
  cardPreview:   { fontSize: 13, color: C.gray, lineHeight: 18, marginBottom: 10 },
  cardFooter:    { flexDirection: 'row', alignItems: 'center', gap: 6 },
  profBadge:     { width: 22, height: 22, borderRadius: 11, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  profInitial:   { color: C.white, fontSize: 10, fontWeight: '700' },
  profName:      { fontSize: 12, color: C.gray, flex: 1 },
  groupTag:      { backgroundColor: '#EEF4FF', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  groupTagText:  { color: C.primary, fontSize: 11, fontWeight: '600' },
  chevron:       { color: C.gray, fontSize: 22, paddingLeft: 4 },

  // empty
  empty:         { alignItems: 'center', marginTop: 60 },
  emptyIcon:     { fontSize: 48, marginBottom: 12 },
  emptyText:     { color: C.gray, fontSize: 15 },
});
