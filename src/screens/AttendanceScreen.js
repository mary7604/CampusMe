import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, StyleSheet, Alert
} from 'react-native';
import attendanceApi from '../api/attendanceApi';
import notificationService from '../services/notificationService';
import * as Notifications from 'expo-notifications';

const SEUIL_ALERTE = 85; 

export default function AttendanceScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
  try {
    const res = await attendanceApi.getHistory();
    setData(res.data);
    const { rate, total } = res.data;
    console.log('rate:', rate, 'total:', total, 'seuil:', SEUIL_ALERTE);
    if (total > 0 && rate < SEUIL_ALERTE) {
      console.log('Envoi notification...');
      const { status } = await Notifications.requestPermissionsAsync();
      console.log('Permission status:', status);
      if (status === 'granted') {
        await notificationService.sendLocalNotification(
          'Alerte absences',
          `Votre taux de présence est de ${rate}%. Attention au seuil réglementaire.`
        );
        console.log('Notification envoyee !');
      }
    }
  } catch (e) {
    console.log('Erreur:', e);
  } finally {
    setLoading(false);
  }
};

  const handleSeed = async () => {
    try {
      await attendanceApi.seed();
      load();
    } catch (e) {
      Alert.alert('Erreur', 'Seed impossible.');
    }
  };

  if (loading) return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color="#0D47A1" />
    </View>
  );

  const { records = [], total = 0, present = 0, absent = 0, rate = 0 } = data || {};
  const alerte = rate < SEUIL_ALERTE && total > 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

      {/* Résumé global */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Présences</Text>
        <Text style={styles.headerSub}>Année universitaire 2025 — 2026</Text>
      </View>

      {/* Alerte seuil */}
      {alerte && (
        <View style={styles.alertBox}>
          <Text style={styles.alertText}>
            Votre taux de présence est de {rate}%, en dessous du seuil réglementaire de {SEUIL_ALERTE}%.
          </Text>
        </View>
      )}

      {/* Stats globales */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderTopColor: '#0D47A1' }]}>
          <Text style={styles.statValue}>{rate}%</Text>
          <Text style={styles.statLabel}>Taux de présence</Text>
        </View>
        <View style={[styles.statCard, { borderTopColor: '#2E7D32' }]}>
          <Text style={[styles.statValue, { color: '#2E7D32' }]}>{present}</Text>
          <Text style={styles.statLabel}>Présences</Text>
        </View>
        <View style={[styles.statCard, { borderTopColor: '#C62828' }]}>
          <Text style={[styles.statValue, { color: '#C62828' }]}>{absent}</Text>
          <Text style={styles.statLabel}>Absences</Text>
        </View>
      </View>

      {/* Barre de progression globale */}
      <View style={styles.progressSection}>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, {
            width: `${rate}%`,
            backgroundColor: alerte ? '#C62828' : '#0D47A1',
          }]} />
        </View>
        <Text style={styles.progressLabel}>{rate}% de présence sur {total} séances</Text>
      </View>

      {/* Liste des présences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Historique</Text>

        {records.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Aucune présence enregistrée.</Text>
            <TouchableOpacity style={styles.seedBtn} onPress={handleSeed}>
              <Text style={styles.seedBtnText}>Insérer des données de test</Text>
            </TouchableOpacity>
          </View>
        ) : (
          records.map((item) => (
            <View key={item.id} style={styles.row}>
              <View style={[
                styles.statusDot,
                { backgroundColor: item.status === 'present' ? '#2E7D32' : '#C62828' }
              ]} />
              <View style={styles.rowInfo}>
                <Text style={styles.rowSubject}>{item.subject || 'Cours'}</Text>
                <Text style={styles.rowDate}>
                  {new Date(item.date).toLocaleDateString('fr-FR', {
                    weekday: 'long', day: 'numeric', month: 'long'
                  })}
                </Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: item.status === 'present' ? '#E8F5E9' : '#FDECEA' }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: item.status === 'present' ? '#2E7D32' : '#C62828' }
                ]}>
                  {item.status === 'present' ? 'Présent' : 'Absent'}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F9' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    backgroundColor: '#0D47A1', padding: 24, paddingTop: 48,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4 },

  alertBox: {
    backgroundColor: '#FDECEA', margin: 16, padding: 14,
    borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#C62828',
  },
  alertText: { color: '#C62828', fontSize: 14, lineHeight: 20 },

  statsRow: {
    flexDirection: 'row', margin: 16, gap: 10,
  },
  statCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 8,
    padding: 14, alignItems: 'center',
    borderTopWidth: 3, elevation: 1,
  },
  statValue: { fontSize: 24, fontWeight: '700', color: '#0D47A1' },
  statLabel: { fontSize: 11, color: '#888', marginTop: 4, textAlign: 'center' },

  progressSection: { paddingHorizontal: 16, marginBottom: 8 },
  progressBg: {
    height: 8, backgroundColor: '#E0E0E0',
    borderRadius: 4, overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 4 },
  progressLabel: { fontSize: 12, color: '#888', marginTop: 6 },

  section: { margin: 16 },
  sectionTitle: {
    fontSize: 12, fontWeight: '700', color: '#888',
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12,
  },

  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { color: '#888', fontSize: 15, marginBottom: 20 },
  seedBtn: {
    backgroundColor: '#0D47A1', paddingVertical: 12,
    paddingHorizontal: 24, borderRadius: 8,
  },
  seedBtnText: { color: '#fff', fontWeight: '600' },

  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 8,
    padding: 14, marginBottom: 8, elevation: 1,
  },
  statusDot: {
    width: 10, height: 10, borderRadius: 5, marginRight: 14,
  },
  rowInfo: { flex: 1 },
  rowSubject: { fontSize: 15, fontWeight: '600', color: '#1a1a2e' },
  rowDate: { fontSize: 12, color: '#888', marginTop: 2 },
  statusBadge: {
    paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12,
  },
  statusText: { fontSize: 12, fontWeight: '600' },
});