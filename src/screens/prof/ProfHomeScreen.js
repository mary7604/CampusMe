import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, StyleSheet, Alert
} from 'react-native';
import useAuth from '../../hooks/useAuth';
import announcementsApi from '../../api/announcementsApi';
import usersApi from '../../api/usersApi';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfHomeScreen({ navigation }) {
  const { user, handleLogout } = useAuth();
  const [stats, setStats] = useState({ announcements: 0, students: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = navigation.addListener('focus', loadStats);
    loadStats();
    return unsub;
  }, []);

  const loadStats = async () => {
    try {
      const [studentsRes, announcementsRes] = await Promise.all([
        usersApi.getStudents().catch(() => ({ data: [] })),
        announcementsApi.getAll().catch(() => ({ data: [] })),
      ]);
      const mine = (announcementsRes.data || []).filter(a =>
        a.profName?.toLowerCase().includes((user?.firstName || '').toLowerCase())
      );
      setStats({
        announcements: mine.length,
        students: (studentsRes.data || []).length,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Se déconnecter', style: 'destructive', onPress: () => handleLogout(navigation) },
      ]
    );
  };

  const profName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Professeur';

  if (loading) return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color="#0D47A1" />
    </View>
  );

  const actions = [
    {
      key: 'announce',
      title: 'Publier une annonce',
      sub: 'Visible par les etudiants cibles',
      iconBg: '#E8EEF7',
      iconColor: '#0D47A1',
      letter: 'A',
      onPress: () => navigation.navigate('AddAnnouncement'),
    },
    {
      key: 'grade',
      title: 'Saisir une note',
      sub: 'Choisir un etudiant dans la liste',
      iconBg: '#E8F5E9',
      iconColor: '#2E7D32',
      letter: 'N',
      onPress: () => navigation.navigate('StudentList'),
    },
    {
      key: 'qr',
      title: 'QR Code de presence',
      sub: 'Generer un code valable 5 minutes',
      iconBg: '#FFF3E0',
      iconColor: '#E65100',
      letter: 'Q',
      onPress: () => navigation.navigate('GenerateQR', { courseId: 1 }),
    },
    {
      key: 'manageAnn',
      title: 'Mes annonces',
      sub: 'Consulter, modifier ou supprimer',
      iconBg: '#F3E5F5',
      iconColor: '#6A1B9A',
      letter: 'M',
      onPress: () => navigation.navigate('ManageAnnouncements'),
    },
    {
      key: 'manageGrades',
      title: 'Notes saisies',
      sub: 'Voir les notes par etudiant',
      iconBg: '#E3F2FD',
      iconColor: '#1565C0',
      letter: 'G',
      onPress: () => navigation.navigate('ManageGrades'),
    },
  ];

  return (
   <SafeAreaView style={{ flex: 1, backgroundColor: '#0D47A1' }} edges={['top']}>
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* En-tete */}
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitial}>{profName.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.headerName}>{profName}</Text>
        <Text style={styles.headerRole}>Espace Professeur</Text>
      </View>

      {/* Statistiques */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.announcements}</Text>
          <Text style={styles.statLabel}>Mes annonces</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.students}</Text>
          <Text style={styles.statLabel}>Etudiants</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        {actions.map((item, i) => (
          <TouchableOpacity
            key={item.key}
            style={[styles.actionRow, i === actions.length - 1 && { borderBottomWidth: 0 }]}
            onPress={item.onPress}
          >
            <View style={styles.actionLeft}>
              <View style={[styles.actionIcon, { backgroundColor: item.iconBg }]}>
                <Text style={[styles.actionIconText, { color: item.iconColor }]}>
                  {item.letter}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.actionTitle}>{item.title}</Text>
                <Text style={styles.actionSub}>{item.sub}</Text>
              </View>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Deconnexion */}
      <TouchableOpacity style={styles.logoutBtn} onPress={confirmLogout}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>

     </ScrollView>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F9' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    backgroundColor: '#0D47A1',
    paddingTop: 48,
    paddingBottom: 32,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 12,
  },
  avatarInitial: { fontSize: 30, fontWeight: '700', color: '#fff' },
  headerName: { fontSize: 20, fontWeight: '700', color: '#fff' },
  headerRole: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4 },

  statsRow: {
    flexDirection: 'row',
    margin: 16,
    gap: 12,
  },
  statCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 8,
    padding: 20, alignItems: 'center', elevation: 1,
  },
  statValue: { fontSize: 28, fontWeight: '700', color: '#0D47A1' },
  statLabel: { fontSize: 13, color: '#888', marginTop: 4 },

  section: {
    backgroundColor: '#fff', marginHorizontal: 16,
    borderRadius: 8, elevation: 1, overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 12, fontWeight: '700', color: '#888',
    letterSpacing: 1, paddingHorizontal: 16,
    paddingTop: 16, paddingBottom: 8,
    textTransform: 'uppercase',
  },
  actionRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  actionLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  actionIcon: {
    width: 40, height: 40, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  actionIconText: { fontWeight: '700', fontSize: 16 },
  actionTitle: { fontSize: 15, fontWeight: '600', color: '#1a1a2e' },
  actionSub: { fontSize: 12, color: '#888', marginTop: 2 },
  actionArrow: { fontSize: 22, color: '#ccc' },

  logoutBtn: {
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C62828',
    alignItems: 'center',
  },
  logoutText: {
    color: '#C62828',
    fontWeight: '700',
    fontSize: 15,
  },
});