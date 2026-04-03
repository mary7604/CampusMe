import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator
} from 'react-native';
import { homeStyles as styles, colors } from '../styles/HomeStyles';
import useAuth from '../hooks/useAuth';
import announcementsApi from '../api/announcementsApi';
import coursesApi from '../api/coursesApi';
import gradesApi from '../api/gradesApi';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();

  const [announcements, setAnnouncements] = useState([]);
  const [nextCourse, setNextCourse] = useState(null);
  const [average, setAverage] = useState(null);
  const [loading, setLoading] = useState(true);

  const studentName = user ? (user.firstName || user.email.split('@')[0]) : 'Etudiant';
  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  useEffect(() => {
    const unsub = navigation.addListener('focus', loadAll);
    loadAll();
    return unsub;
  }, [navigation]);

  const loadAll = async () => {
    try {
      const [annRes, coursesRes, gradesRes] = await Promise.all([
        announcementsApi.getMy().catch(() => ({ data: [] })),
        coursesApi.getTodayCourses().catch(() => ({ data: [] })),
        user?.id ? gradesApi.getGrades(user.id).catch(() => ({ data: { average: null } })) : Promise.resolve({ data: { average: null } }),
      ]);

      setAnnouncements(annRes.data || []);

      // Prochain cours = premier cours du jour dont l'heure n'est pas passée
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const todayCourses = coursesRes.data || [];
      const next = todayCourses.find(c => {
        const startTime = c.time?.split(' - ')[0];
        if (!startTime) return false;
        const [h, m] = startTime.split(':').map(Number);
        return h * 60 + m > currentMinutes;
      }) || todayCourses[0];
      setNextCourse(next || null);

      setAverage(gradesRes.data?.average || null);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const quickAccess = [
    { label: 'Emploi\ndu temps',  screen: 'Timetable' },
    { label: 'Campus\nNavigator', screen: 'Map' },
    { label: 'Scanner\nQR Code',  screen: 'ScanQR' },
    { label: 'Mes\nNotes',        screen: 'Grades' },
  ];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.dark} />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Bonjour, {studentName}</Text>
            <Text style={styles.date}>{today}</Text>
          </View>
          <View style={styles.avatarRing}>
            <Text style={styles.avatarInitial}>{studentName.charAt(0).toUpperCase()}</Text>
          </View>
        </View>
      </View>

      {/* PROCHAIN COURS */}
      <View style={styles.nextCard}>
        <View style={styles.nextCardHeader}>
          <Text style={styles.nextCardLabel}>Prochain cours</Text>
        </View>
        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginVertical: 16 }} />
        ) : nextCourse ? (
          <>
            <Text style={styles.nextSubject}>{nextCourse.subject}</Text>
            <View style={styles.pillsRow}>
              <View style={styles.pill}><Text style={styles.pillText}>{nextCourse.time?.split(' - ')[0]}</Text></View>
              <View style={styles.pill}><Text style={styles.pillText}>{nextCourse.room}</Text></View>
              <View style={styles.pill}><Text style={styles.pillText}>{nextCourse.professor}</Text></View>
            </View>
            {nextCourse.latitude && (
              <TouchableOpacity
                style={styles.navBtn}
                onPress={() => navigation.navigate('Map', {
                  destination: {
                    name: nextCourse.room,
                    latitude: nextCourse.latitude,
                    longitude: nextCourse.longitude,
                  }
                })}
              >
                <Text style={styles.navBtnText}>M'y amener</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <Text style={{ color: colors.gray, marginVertical: 16, textAlign: 'center' }}>
            Aucun cours aujourd'hui.
          </Text>
        )}
      </View>

      {/* STATISTIQUES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistiques</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{average ?? '—'}</Text>
            <Text style={styles.statLabel}>Moyenne</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user?.group || '—'}</Text>
            <Text style={styles.statLabel}>Groupe</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user?.niveau || '—'}</Text>
            <Text style={styles.statLabel}>Niveau</Text>
          </View>
        </View>
      </View>

      {/* ACCÈS RAPIDE */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accès rapide</Text>
        <View style={styles.quickRow}>
          {quickAccess.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.quickCard, i % 2 === 0 ? styles.quickDark : styles.quickLight]}
              activeOpacity={0.8}
              onPress={() => item.screen && navigation.navigate(item.screen)}
            >
              <Text style={[styles.quickLabel, { color: i % 2 === 0 ? colors.white : colors.dark }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ANNONCES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Annonces</Text>
        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} />
        ) : announcements.length === 0 ? (
          <Text style={{ textAlign: 'center', color: colors.gray, marginTop: 15 }}>
            Aucune annonce publiée.
          </Text>
        ) : (
          announcements.map((item) => (
            <TouchableOpacity key={item.id} style={styles.announcementCard} activeOpacity={0.75}>
              <View style={styles.dotBox}><View style={styles.dot} /></View>
              <View style={styles.announcementContent}>
                <Text style={styles.announcementTitle}>{item.title}</Text>
                <Text style={styles.announcementMeta}>
                  {item.profName || 'Professeur'} · {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                </Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))
        )}
      </View>

    </ScrollView>
  );
}