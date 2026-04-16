import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StatusBar, StyleSheet, Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── palette ─────────────────────────────────────────────────────────────────
const C = {
  dark:    '#0D47A1',   // était #1A1A2E
  primary: '#1565C0',   // était #4F8EF7
  white:   '#FFFFFF',
  gray:    '#78909C',
  card:    '#F7FAFF',   // était #F4F6FB
  border:  '#DCEEFF',   // était #E8ECF4
  light:   '#EAF1FF',
};

const formatDateFull = (iso) =>
  new Date(iso).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

// ─── AnnouncementDetailScreen ─────────────────────────────────────────────────
export default function AnnouncementDetailScreen({ navigation, route }) {
  const { announcement: a } = route.params;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `📢 ${a.title}\n\n${a.content}\n\n— ${a.profName || 'Professeur'}`,
        title: a.title,
      });
    } catch (_) {}
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={C.dark} />

      {/* ── top bar ──────────────────────────────────────────────── */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle} numberOfLines={1}>Annonce</Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
          <Text style={styles.shareIcon}>⬆</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        {/* ── hero band ─────────────────────────────────────────── */}
        <View style={styles.heroBand}>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>📢 Annonce</Text>
          </View>
          <Text style={styles.heroTitle}>{a.title}</Text>
          <Text style={styles.heroDate}>{formatDateFull(a.createdAt)}</Text>
        </View>

        {/* ── white content card ────────────────────────────────── */}
        <View style={styles.contentCard}>

          {/* prof info */}
          <View style={styles.profRow}>
            <View style={styles.profAvatar}>
              <Text style={styles.profAvatarText}>
                {(a.profName || 'P').charAt(0).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.profNameText}>{a.profName || 'Professeur'}</Text>
              <Text style={styles.profRole}>Enseignant</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* meta chips */}
          <View style={styles.chipsRow}>
            {a.targetGroup && a.targetGroup !== 'all' && (
              <View style={styles.chip}>
                <Text style={styles.chipIcon}>👥</Text>
                <Text style={styles.chipText}>Groupe {a.targetGroup}</Text>
              </View>
            )}
            {a.targetFiliere && a.targetFiliere !== 'all' && (
              <View style={styles.chip}>
                <Text style={styles.chipIcon}>🎓</Text>
                <Text style={styles.chipText}>{a.targetFiliere}</Text>
              </View>
            )}
            <View style={styles.chip}>
              <Text style={styles.chipIcon}>📅</Text>
              <Text style={styles.chipText}>
                {new Date(a.createdAt).toLocaleDateString('fr-FR')}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* body */}
          <Text style={styles.bodyText}>{a.content}</Text>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: C.dark },
  scroll:          { flex: 1 },

  // top bar
  topBar:          { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  backBtn:         { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  backArrow:       { color: C.white, fontSize: 22, lineHeight: 26 },
  topBarTitle:     { flex: 1, color: C.white, fontSize: 17, fontWeight: '600' },
  shareBtn:        { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  shareIcon:       { color: C.white, fontSize: 15 },

  // hero
  heroBand:        { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 32 },
  categoryTag:     { alignSelf: 'flex-start', backgroundColor: 'rgba(79,142,247,0.2)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, marginBottom: 14 },
  categoryText:    { color: C.primary, fontSize: 12, fontWeight: '600' },
  heroTitle:       { color: C.white, fontSize: 24, fontWeight: '800', lineHeight: 32, marginBottom: 8 },
  heroDate:        { color: 'rgba(255,255,255,0.5)', fontSize: 13 },

  // content card
  contentCard:     { backgroundColor: C.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -10, paddingHorizontal: 24, paddingTop: 28, minHeight: 500 },

  // prof
  profRow:         { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  profAvatar:      { width: 46, height: 46, borderRadius: 23, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  profAvatarText:  { color: C.white, fontSize: 18, fontWeight: '700' },
  profNameText:    { fontSize: 15, fontWeight: '700', color: C.dark },
  profRole:        { fontSize: 12, color: C.gray, marginTop: 2 },

  divider:         { height: 1, backgroundColor: C.border, marginVertical: 16 },

  // chips
  chipsRow:        { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  chip:            { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: C.card, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  chipIcon:        { fontSize: 13 },
  chipText:        { fontSize: 12, color: C.dark, fontWeight: '500' },

  // body
  bodyText:        { fontSize: 15, color: '#2D2D3E', lineHeight: 26, letterSpacing: 0.1 },
});
