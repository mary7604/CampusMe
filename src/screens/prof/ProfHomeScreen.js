import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import colors from '../../styles/colors';
import useAuth from '../../hooks/useAuth';
import announcementsApi from '../../api/announcementsApi';
import gradesApi from '../../api/gradesApi';
import usersApi from '../../api/usersApi';

export default function ProfHomeScreen({ navigation }) {
  const { user } = useAuth();
  const [stats, setStats] = useState({ announcements: 0, grades: 0, students: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [studentsRes, announcementsRes, gradesRes] = await Promise.all([
        usersApi.getStudents().catch(() => ({ data: [] })),
        announcementsApi.getAll().catch(() => ({ data: [] })),
        Promise.resolve({ data: [] }) // No global grades API, use 0
      ]);
      
      // Filter prof's announcements (mock filter by profName or profId)
      const profAnnouncements = announcementsRes.data?.filter(a => a.profName?.toLowerCase().includes((user?.firstName || '').toLowerCase())) || [];
      
      setStats({
        announcements: profAnnouncements.length,
        grades: gradesRes.data?.length || 0,
        students: studentsRes.data?.length || 0,
      });
    } catch (err) {
      console.error('Prof stats load error:', err);
      setStats({ announcements: 0, grades: 0, students: 0 });
    } finally {
      setLoading(false);
    }
  };

  const profName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.email?.split('@')[0] || 'Professeur';

  if (loading) return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} color={colors.primary} />;

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={{ padding: 20 }}>
      {/* Header */}
      <View style={{ alignItems: 'center', marginBottom: 30, marginTop: 60 }}>
        <View style={{ 
          width: 100, height: 100, borderRadius: 50, backgroundColor: colors.primary, 
          justifyContent: 'center', alignItems: 'center', marginBottom: 15 
        }}>
          <Text style={{ fontSize: 40, color: 'white' }}>👨‍🏫</Text>
        </View>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.dark }}>Bonjour {profName}</Text>
        <Text style={{ color: colors.gray, fontSize: 16 }}>Espace Professeur</Text>
      </View>

      {/* Stats */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 }}>
        <View style={{ 
          flex: 1, backgroundColor: colors.primary+'20', padding: 20, borderRadius: 15, marginHorizontal: 5, alignItems: 'center' 
        }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.primary }}>{stats.announcements}</Text>
          <Text style={{ color: colors.gray }}>Annonces</Text>
        </View>
        <View style={{ 
          flex: 1, backgroundColor: colors.success+'20', padding: 20, borderRadius: 15, marginHorizontal: 5, alignItems: 'center' 
        }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.success }}>{stats.grades}</Text>
          <Text style={{ color: colors.gray }}>Notes</Text>
        </View>
        <View style={{ 
          flex: 1, backgroundColor: colors.secondary+'20', padding: 20, borderRadius: 15, marginHorizontal: 5, alignItems: 'center' 
        }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.secondary }}>{stats.students}</Text>
          <Text style={{ color: colors.gray }}>Étudiants</Text>
        </View>
      </View>

      {/* Quick Actions - Different from student */}
      <TouchableOpacity style={[globalStyles.primaryButton, { marginBottom: 15 }]} 
        onPress={() => navigation.navigate('AddAnnouncement')}>
        <Text style={globalStyles.primaryButtonText}>📢 Publier Annonce</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[globalStyles.primaryButton, { backgroundColor: colors.success, marginBottom: 15 }]} 
        onPress={() => navigation.navigate('StudentList')}>
        <Text style={[globalStyles.primaryButtonText, { color: 'white' }]}>📝 Saisir Note</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[globalStyles.primaryButton, { backgroundColor: colors.dark, marginBottom: 15 }]} 
        onPress={() => navigation.navigate('ManageAnnouncements')}>
        <Text style={[globalStyles.primaryButtonText, { color: 'white' }]}>📋 Mes Annonces</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[globalStyles.primaryButton, { backgroundColor: colors.secondary }]} 
        onPress={() => navigation.navigate('ManageGrades')}>
        <Text style={[globalStyles.primaryButtonText, { color: 'white' }]}>📊 Mes Notes</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

