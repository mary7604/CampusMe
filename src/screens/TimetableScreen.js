import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import colors from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import { timetableStyles } from '../styles/TimetableStyles';

const DAYS = [
  { name: "Lun", num: "17" },
  { name: "Mar", num: "18" },
  { name: "Mer", num: "19" },
  { name: "Jeu", num: "20" },
  { name: "Ven", num: "21" },
  { name: "Sam", num: "22" },
];

// ─── Chaque salle a ses coordonnées GPS FSTM ────────────────────
const COURSES = {
  0: [
    { id: 1, subject: "Algorithmique",           time: "08:00 - 09:30", room: "Amphi Ω",  prof: "Dr. Amine",   color: colors.dark,      latitude: 33.6988, longitude: -7.3855 },
    { id: 2, subject: "React Native",            time: "10:00 - 11:30", room: "BAT X",    prof: "Dr. Karim",   color: colors.primary,   latitude: 33.6992, longitude: -7.3848 },
    { id: 3, subject: "Base de données",         time: "14:00 - 15:30", room: "BAT D",    prof: "Dr. Sara",    color: colors.secondary, latitude: 33.6984, longitude: -7.3852 },
  ],
  1: [
    { id: 4, subject: "Mathématiques",           time: "09:00 - 10:30", room: "Amphi λ",  prof: "Dr. Nadia",   color: colors.dark,      latitude: 33.6990, longitude: -7.3852 },
    { id: 5, subject: "Réseaux",                 time: "11:00 - 12:30", room: "BAT E",    prof: "Dr. Youssef", color: colors.accent,    latitude: 33.6984, longitude: -7.3858 },
  ],
  2: [
    { id: 6, subject: "NestJS Backend",          time: "08:00 - 09:30", room: "BAT C",    prof: "Dr. Karim",   color: colors.primary,   latitude: 33.6984, longitude: -7.3845 },
    { id: 7, subject: "Systèmes d'exploitation", time: "13:00 - 14:30", room: "Amphi δ",  prof: "Dr. Amine",   color: colors.dark,      latitude: 33.6983, longitude: -7.3858 },
  ],
  3: [
    { id: 8, subject: "Anglais Tech",            time: "10:00 - 11:30", room: "BAT Y",    prof: "Mme. Leila",  color: colors.accent,    latitude: 33.6988, longitude: -7.3865 },
  ],
  4: [
    { id: 9,  subject: "Projet Mobile",          time: "09:00 - 12:00", room: "BAT F",    prof: "Dr. Karim",   color: colors.primary,   latitude: 33.6984, longitude: -7.3864 },
    { id: 10, subject: "Algorithmique TP",       time: "14:00 - 15:30", room: "BAT E",    prof: "Dr. Amine",   color: colors.dark,      latitude: 33.6984, longitude: -7.3858 },
  ],
  5: [],
};

export default function TimetableScreen({ navigation }) {
  const [activeDay, setActiveDay] = useState(0);
  const todayCourses = COURSES[activeDay] || [];

  // ── Naviguer vers la carte avec la salle du cours ────────────
  const handleGoToRoom = (course) => {
    // Quand navigation sera connectée :
    // navigation.navigate('Map', {
    //   destination: { name: course.room, latitude: course.latitude, longitude: course.longitude }
    // });

    // Pour l'instant : afficher dans la console
    console.log(`Naviguer vers ${course.room}`, course.latitude, course.longitude);
  };

  return (
    <View style={globalStyles.container}>

      {/* HEADER */}
      <View style={globalStyles.header}>
        <Text style={globalStyles.headerTitle}>Emploi du temps</Text>
        <Text style={globalStyles.headerSubtitle}>Semaine du 17 au 22 Février 2026</Text>
      </View>

      {/* SÉLECTEUR DE JOURS */}
      <View style={timetableStyles.daysRow}>
        {DAYS.map((day, i) => (
          <TouchableOpacity
            key={i}
            style={[timetableStyles.dayBtn, activeDay === i && timetableStyles.dayBtnActive]}
            onPress={() => setActiveDay(i)}
          >
            <Text style={[timetableStyles.dayName, activeDay === i && timetableStyles.dayNameActive]}>
              {day.name}
            </Text>
            <Text style={[timetableStyles.dayNum, activeDay === i && timetableStyles.dayNumActive]}>
              {day.num}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LISTE DES COURS */}
      <ScrollView style={timetableStyles.coursesList} showsVerticalScrollIndicator={false}>
        {todayCourses.length === 0 ? (
          <View style={timetableStyles.emptyContainer}>
            <Text style={timetableStyles.emptyIcon}>🎉</Text>
            <Text style={timetableStyles.emptyText}>Pas de cours aujourd'hui !</Text>
            <Text style={timetableStyles.emptySubText}>Profite de ta journée 😊</Text>
          </View>
        ) : (
          todayCourses.map((course) => (
            <View key={course.id}>
              <Text style={timetableStyles.timeLabel}>🕐 {course.time}</Text>
              <View style={timetableStyles.courseCard}>

                {/* Bande colorée à gauche */}
                <View style={[timetableStyles.courseStripe, { backgroundColor: course.color }]} />

                {/* Contenu du cours */}
                <View style={timetableStyles.courseContent}>
                  <Text style={timetableStyles.courseSubject}>{course.subject}</Text>
                  <View style={timetableStyles.courseRow}>
                    <Text>📍</Text>
                    <Text style={timetableStyles.courseDetail}>{course.room}</Text>
                  </View>
                  <View style={timetableStyles.courseRow}>
                    <Text></Text>
                    <Text style={timetableStyles.courseDetail}>{course.prof}</Text>
                  </View>
                </View>

                {/* Bouton 🗺️ — ouvre la carte sur la salle */}
                <TouchableOpacity
                  style={timetableStyles.courseMapBtn}
                  onPress={() => handleGoToRoom(course)}
                >
                  <Text style={timetableStyles.courseMapIcon}>🗺️</Text>
                </TouchableOpacity>

              </View>
            </View>
          ))
        )}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}