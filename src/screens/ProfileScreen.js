import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { profileStyles } from '../styles/ProfileStyles';
import useAuth from '../hooks/useAuth';
import gradesApi from '../api/gradesApi';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { useTranslation } from 'react-i18next';

export default function ProfileScreen({ navigation }) {
  // const { t } = useTranslation(); 
  const { user, handleLogout } = useAuth();
  const [average, setAverage] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const menuItems = [
    { label: "Notifications", onPress: () => navigation.navigate('Notifications') },
    { label: "Changer le mot de passe", onPress: () => navigation.navigate('ForgotPassword') },
    { label: "Langue", onPress: () => navigation.navigate('Language') },
    { label: "Aide et support", onPress: () => navigation.navigate('Help') },
  ];

  useEffect(() => {
    if (user?.id) {
      gradesApi.getGrades(user.id)
        .then(res => setAverage(res.data.average || '—'))
        .catch(() => setAverage('—'))
        .finally(() => setLoadingStats(false));
    } else {
      setLoadingStats(false);
    }
  }, [user?.id]);

  if (!user) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0D47A1" />
    </View>
  );

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;

  const stats = [
    { value: average ?? '—', label: 'Moyenne' },
    { value: user.filiere || '—', label: 'Filière' },
    { value: user.group || '—', label: 'Groupe' },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
    <ScrollView style={globalStyles.container} showsVerticalScrollIndicator={false}>
     
      {/* HEADER */}
      <View style={profileStyles.header}>
        <View style={profileStyles.avatarCircle}>
          <Text style={profileStyles.avatarText}>
            {fullName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={profileStyles.studentName}>{fullName}</Text>
        <Text style={profileStyles.studentEmail}>{user.email}</Text>
        <View style={profileStyles.badgeRow}>
          {user.filiere && (
            <View style={profileStyles.badge}>
              <Text style={profileStyles.badgeText}>{user.filiere}</Text>
            </View>
          )}
          {user.niveau && (
            <View style={profileStyles.badge}>
              <Text style={profileStyles.badgeText}>Niveau {user.niveau}</Text>
            </View>
          )}
          {user.group && (
            <View style={profileStyles.badge}>
              <Text style={profileStyles.badgeText}>{user.group}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={profileStyles.statsRow}>
        {loadingStats ? (
          <ActivityIndicator color="#0D47A1" style={{ flex: 1, paddingVertical: 20 }} />
        ) : (
          stats.map((s, i) => (
            <View key={i} style={profileStyles.statBox}>
              <Text style={profileStyles.statValue} numberOfLines={1}>{s.value}</Text>
              <Text style={profileStyles.statLabel}>{s.label}</Text>
            </View>
          ))
        )}
      </View>

      <View style={profileStyles.content}>

        <Text style={globalStyles.sectionTitle}>Informations personnelles</Text>
        <View style={profileStyles.infoCard}>
          {[
            { label: 'Nom complet', value: fullName },
            { label: 'Email', value: user.email },
            { label: 'Filière', value: user.filiere || 'Non précisée' },
            { label: 'Niveau', value: user.niveau || 'Non précisé' },
            { label: 'Groupe', value: user.group || 'Non précisé' },
            { label: 'Matricule', value: `MAT-${user.id}` },
          ].map((item, i, arr) => (
            <View
              key={i}
              style={i === arr.length - 1 ? profileStyles.infoRowLast : profileStyles.infoRow}
            >
              <Text style={profileStyles.infoLabel}>{item.label}</Text>
              <Text style={profileStyles.infoValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        <Text style={globalStyles.sectionTitle}>Paramètres</Text>
        <View style={profileStyles.menuCard}>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={i === menuItems.length - 1 ? profileStyles.menuItemLast : profileStyles.menuItem}
              onPress={item.onPress}
            >
              <Text style={profileStyles.menuLabel}>{item.label}</Text>
              <Text style={profileStyles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={profileStyles.logoutBtn}
          onPress={() => handleLogout(navigation)}
        >
          <Text style={profileStyles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>

      </View>
     </ScrollView>
  </SafeAreaView>
  );
}