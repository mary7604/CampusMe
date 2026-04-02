import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity,
  ActivityIndicator, StyleSheet, Alert
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import attendanceApi from '../../api/attendanceApi';

const EXPIRY_SECONDS = 300; // 5 minutes

export default function GenerateQRScreen({ route }) {
  const { courseId } = route.params || { courseId: 1 };
  const [qrValue, setQrValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) { clearInterval(interval); setQrValue(null); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  const generate = async () => {
    try {
      setLoading(true);
      const res = await attendanceApi.generate(courseId);
      setQrValue(res.data.qrCode);
      setSecondsLeft(EXPIRY_SECONDS);
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de générer le QR code.');
    } finally {
      setLoading(false);
    }
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QR Code de présence</Text>
      <Text style={styles.subtitle}>
        Générez un code unique valable 5 minutes. Les étudiants le scannent pour pointer.
      </Text>

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
            Aucun code actif.{'\n'}Appuyez sur le bouton pour en générer un.
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={generate} disabled={loading}>
        <Text style={styles.buttonText}>
          {qrValue ? 'Générer un nouveau code' : 'Générer le QR code'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F9', padding: 24 },
  title: { fontSize: 20, fontWeight: '700', color: '#1a1a2e', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 32 },
  qrContainer: { alignItems: 'center', marginVertical: 24 },
  timer: {
    marginTop: 20, backgroundColor: '#E8EEF7',
    paddingVertical: 10, paddingHorizontal: 24, borderRadius: 6,
  },
  timerWarning: { backgroundColor: '#FDECEA' },
  timerText: { fontSize: 16, fontWeight: '600', color: '#0D47A1' },
  placeholder: {
    alignItems: 'center', marginVertical: 48,
  },
  placeholderText: { color: '#888', fontSize: 14, textAlign: 'center', lineHeight: 22 },
  button: {
    backgroundColor: '#0D47A1', padding: 16,
    borderRadius: 8, alignItems: 'center', marginTop: 'auto',
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});