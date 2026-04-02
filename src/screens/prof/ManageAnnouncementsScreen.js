import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import colors from '../../styles/colors';
import announcementsApi from '../../api/announcementsApi';
import useAuth from '../../hooks/useAuth';

export default function ManageAnnouncementsScreen({ navigation }) {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    load();
    return unsub;
  }, []);

  const load = async () => {
    try {
      const res = await announcementsApi.getAll();
      const mine = (res.data || []).filter(a =>
        a.profName?.toLowerCase().includes((user?.firstName || '').toLowerCase())
      );
      setAnnouncements(mine);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />;

  return (
    <View style={globalStyles.container}>
      <FlatList
        data={announcements}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: colors.gray, marginTop: 40 }}>
            Vous n'avez pas encore publié d'annonce.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={{
            backgroundColor: '#fff', borderRadius: 12, padding: 16,
            marginBottom: 12, elevation: 2
          }}>
            <Text style={{ fontWeight: '700', fontSize: 16 }}>{item.title}</Text>
            <Text style={{ color: colors.gray, marginTop: 6 }}>{item.content}</Text>
            <Text style={{ color: '#90CAF9', marginTop: 8, fontSize: 12 }}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        )}
      />
      <TouchableOpacity
        style={[globalStyles.primaryButton, { margin: 16 }]}
        onPress={() => navigation.navigate('AddAnnouncement')}
      >
        <Text style={globalStyles.primaryButtonText}>+ Nouvelle annonce</Text>
      </TouchableOpacity>
    </View>
  );
}