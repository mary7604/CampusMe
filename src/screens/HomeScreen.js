import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator
} from 'react-native';
import { homeStyles as styles, colors } from '../styles/HomeStyles';
import useAuth from '../hooks/useAuth';
import announcementsApi from '../api/announcementsApi';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  
  const studentName = user ? (user.firstName || user.email.split('@')[0]) : "Étudiant";
  const roleDisplay = user?.role === 'professeur' ? 'Professeur' : 'Étudiant';
  
  const [announcements, setAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoading] = useState(true);

  useEffect(() => {
    // Écouter le focus pour recharger les annonces
    const unsubscribe = navigation.addListener('focus', () => {
      loadAnnouncements();
    });
    loadAnnouncements();
    return unsubscribe;
  }, [navigation]);

  const loadAnnouncements = async () => {
    try {
      const res = await announcementsApi.getAll();
      setAnnouncements(res.data || []);
    } catch(err) {
      console.log('Erreur chargement annonces:', err);
    } finally {
      setLoading(false);
    }
  };
  const today = new Date().toLocaleDateString('fr-FR', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
});

  const nextCourse = {
    subject:   "React Native",
    room:      "Salle B204",
    time:      "10:00",
    timeLeft:  "dans 23 min",
    professor: "Dr. Karim",
  };

  const stats = [
    { label: "Présences", value: "85%" },
    { label: "Moyenne",   value: "14.5" },
    { label: "Cours",     value: "4"    },
  ];

  const quickAccess = [
    { label: "Emploi\ndu temps"  },
    { label: "Campus\nNavigator" },
    { label: "Mes\nPrésences"   },
    { label: "Mes\nNotes"       },
  ];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/*   prsnl */ }
      <StatusBar barStyle="light-content" backgroundColor={colors.dark} />

      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Bonjour, {studentName}</Text>
            <Text style={styles.date}>{today} • {roleDisplay}</Text>
          </View>
          <View style={styles.avatarRing}>
            <Text style={styles.avatarInitial}>{studentName.charAt(0)}</Text>
          </View>
        </View>
      </View>

      {/* ── PROCHAIN COURS ── */}
      <View style={styles.nextCard}>
        <View style={styles.nextCardHeader}>
          <Text style={styles.nextCardLabel}>Prochain cours</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{nextCourse.timeLeft}</Text>
          </View>
        </View>
        <Text style={styles.nextSubject}>{nextCourse.subject}</Text>
        <View style={styles.pillsRow}>
          <View style={styles.pill}><Text style={styles.pillText}>{nextCourse.time}</Text></View>
          <View style={styles.pill}><Text style={styles.pillText}>{nextCourse.room}</Text></View>
          <View style={styles.pill}><Text style={styles.pillText}>{nextCourse.professor}</Text></View>
        </View>
        <TouchableOpacity style={styles.navBtn} activeOpacity={0.85}>
          <Text style={styles.navBtnText}>M'y amener</Text>
        </TouchableOpacity>
      </View>

      {/* ── STATISTIQUES ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistiques</Text>
        <View style={styles.statsRow}>
          {stats.map((s, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── ACCÈS RAPIDE ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accès rapide</Text>
        <View style={styles.quickRow}>
          {quickAccess.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.quickCard, i % 2 === 0 ? styles.quickDark : styles.quickLight]}
              activeOpacity={0.8}
            >
              <Text style={[styles.quickLabel, { color: i % 2 === 0 ? colors.white : colors.dark }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── ANNONCES ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Annonces</Text>
        {loadingAnnouncements ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }}/>
        ) : announcements.length === 0 ? (
          <Text style={{ textAlign: 'center', color: colors.gray, marginTop: 15 }}>Aucune annonce publiée.</Text>
        ) : (
          announcements.map((item) => (
            <TouchableOpacity key={item.id} style={styles.announcementCard} activeOpacity={0.75}>
              <View style={styles.dotBox}>
                <View style={styles.dot} />
              </View>
              <View style={styles.announcementContent}>
                <Text style={styles.announcementTitle}>{item.title}</Text>
                <Text style={styles.announcementMeta}>{item.profName || 'Professeur'} · {new Date(item.createdAt).toLocaleDateString()}</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))
        )}
      </View>

    </ScrollView>
  );
}