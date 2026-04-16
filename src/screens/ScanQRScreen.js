import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import attendanceApi from '../api/attendanceApi';
// import { useTranslation } from 'react-i18next';

export default function ScanQRScreen({ navigation }) {
  // const { t } = useTranslation(); 
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permText}>
          L'accès à la caméra est requis pour scanner le QR code.
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Autoriser la caméra</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleScan = async ({ data }) => {
    if (scanned || loading) return;
    setScanned(true);
    setLoading(true);
    try {
      await attendanceApi.scan(data);
      Alert.alert('Presence enregistree', 'Votre presence a ete validee.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      const msg = e.response?.data?.message || 'QR code invalide ou expire.';
      Alert.alert('Echec', msg, [
        { text: 'Reessayer', onPress: () => setScanned(false) }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scanner le QR code</Text>
      <Text style={styles.subtitle}>
        Pointez la caméra sur le QR code affiché par votre professeur.
      </Text>
      <View style={styles.cameraWrapper}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleScan}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        />
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
        </View>
      </View>
      {scanned && (
        <TouchableOpacity style={styles.button} onPress={() => setScanned(false)}>
          <Text style={styles.buttonText}>Scanner a nouveau</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F9', padding: 24 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 20, fontWeight: '700', color: '#1a1a2e', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 24 },
  cameraWrapper: {
    flex: 1, borderRadius: 12, overflow: 'hidden', position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center', alignItems: 'center',
  },
  scanFrame: {
    width: 200, height: 200,
    borderWidth: 2, borderColor: '#fff', borderRadius: 12,
  },
  permText: { fontSize: 15, color: '#444', textAlign: 'center', marginBottom: 24 },
  button: {
    backgroundColor: '#0D47A1', padding: 16,
    borderRadius: 8, alignItems: 'center', marginTop: 16,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});