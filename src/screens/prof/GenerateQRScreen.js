import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  ActivityIndicator, StyleSheet, Alert, TextInput
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import attendanceApi from '../../api/attendanceApi';

const EXPIRY_SECONDS = 300;

export default function GenerateQRScreen({ route }) {
  const { courseId } = route.params || { courseId: 1 };
  const [qrValue, setQrValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [subject, setSubject] = useState('');
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    const restore = async () => {
      const savedQr = await AsyncStorage.getItem('active_qr_code');
      const savedTime = await AsyncStorage.getItem('active_qr_expiry');
      const savedSubject = await AsyncStorage.getItem('active_qr_subject');
      if (savedQr && savedTime) {
        const expiry = parseInt(savedTime);
        const now = Date.now();
        const remaining = Math.floor((expiry - now) / 1000);
        if (remaining > 0) {
          setQrValue(savedQr);
          setSecondsLeft(remaining);
          if (savedSubject) setSubject(savedSubject);
        } else {
          await AsyncStorage.removeItem('active_qr_code');
          await AsyncStorage.removeItem('active_qr_expiry');
          await AsyncStorage.removeItem('active_qr_subject');
        }
      }
    };
    restore();
  }, []);

  useEffect(() => {
    if (!qrValue) return;
    const fetchAttendees = async () => {
      try {
        const res = await attendanceApi.getSession(qrValue);
        setAttendees(res.data);
      } catch (e) {}
    };
    fetchAttendees();
    const interval = setInterval(fetchAttendees, 10000);
    return () => clearInterval(interval);
  }, [qrValue]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(interval);
          setQrValue(null);
          setAttendees([]);
          AsyncStorage.removeItem('active_qr_code');
          AsyncStorage.removeItem('active_qr_expiry');
          AsyncStorage.removeItem('active_qr_subject');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  const generate = async () => {
    if (!subject.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer le nom du cours.');
      return;
    }
    try {
      setLoading(true);
      const res = await attendanceApi.generate(courseId, subject);
      const qr = res.data.qrCode;
      const expiry = Date.now() + EXPIRY_SECONDS * 1000;
      setQrValue(qr);
      setSecondsLeft(EXPIRY_SECONDS);
      setAttendees([]);
      await AsyncStorage.setItem('active_qr_code', qr);
      await AsyncStorage.setItem('active_qr_expiry', String(expiry));
      await AsyncStorage.setItem('active_qr_subject', subject);
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de générer le QR code.');
    } finally {
      setLoading(false);
    }
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>QR Code de présence</Text>
      <Text style={styles.subtitle}>
        Générez un code unique valable 5 minutes. Les étudiants le scannent pour pointer.
      </Text>

      {!qrValue && (
        <TextInput
          style={styles.input}
          placeholder="Nom du cours (ex: Algorithmique)"
          placeholderTextColor="#aaa"
          value={subject}
          onChangeText={setSubject}
        />
      )}

      {qrValue && (
        <Text style={styles.coursLabel}>Cours : {subject}</Text>
      )}

      {loading && <ActivityIndicator size="large" color="#0D47A1" style={{ marginTop: 40 }} />}

      {qrValue && !loading && (
        <View style={styles.qrContainer}>
          <QRCode value={qrValue} size={220} color="#1a1a2e" />
          <View style={[styles.timer, secondsLeft < 60 && styles.timerWarning]}>
            <Text style={styles.timerText}>
              Expire dans {minutes}:{seconds.toString().padStart(2, '0')}
            </Text>
          </View>
        </View>
      )}

      {!qrValue && !loading && (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Aucun code actif.{'\n'}Entrez le nom du cours et appuyez sur le bouton.
          </Text>
        </View>
      )}

      {qrValue && attendees.length > 0 && (
        <View style={styles.attendeesList}>
          <Text style={styles.attendeesTitle}>
            Présents ({attendees.length})
          </Text>
          {attendees.map((a, i) => (
            <View key={i} style={styles.attendeeRow}>
              <View style={styles.attendeeDot} />
              <Text style={styles.attendeeName}>
                {a.firstName} {a.lastName}
              </Text>
            </View>
          ))}
        </View>
      )}

      {qrValue && attendees.length === 0 && !loading && (
        <View style={styles.attendeesList}>
          <Text style={styles.attendeesTitle}>Présents (0)</Text>
          <Text style={{ color: '#888', fontSize: 13, textAlign: 'center', marginTop: 8 }}>
            En attente des étudiants...
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={generate} disabled={loading}>
        <Text style={styles.buttonText}>
          {qrValue ? 'Générer un nouveau code' : 'Générer le QR code'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F9', padding: 24 },
  title: { fontSize: 20, fontWeight: '700', color: '#1a1a2e', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 24 },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd',
    borderRadius: 8, padding: 14, fontSize: 15, color: '#1a1a2e',
    marginBottom: 16,
  },
  coursLabel: {
    fontSize: 14, fontWeight: '600', color: '#0D47A1',
    marginBottom: 8, textAlign: 'center',
  },
  qrContainer: { alignItems: 'center', marginVertical: 24 },
  timer: {
    marginTop: 20, backgroundColor: '#E8EEF7',
    paddingVertical: 10, paddingHorizontal: 24, borderRadius: 6,
  },
  timerWarning: { backgroundColor: '#FDECEA' },
  timerText: { fontSize: 16, fontWeight: '600', color: '#0D47A1' },
  placeholder: { alignItems: 'center', marginVertical: 48 },
  placeholderText: { color: '#888', fontSize: 14, textAlign: 'center', lineHeight: 22 },
  attendeesList: {
    backgroundColor: '#fff', borderRadius: 8,
    padding: 14, marginTop: 16, marginBottom: 8,
  },
  attendeesTitle: {
    fontSize: 14, fontWeight: '700', color: '#0D47A1', marginBottom: 10,
  },
  attendeeRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  attendeeDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#2E7D32', marginRight: 10,
  },
  attendeeName: { fontSize: 14, color: '#1a1a2e' },
  button: {
    backgroundColor: '#0D47A1', padding: 16,
    borderRadius: 8, alignItems: 'center', marginTop: 24,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});