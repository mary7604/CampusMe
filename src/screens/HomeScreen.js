import {
  View, Text, ScrollView, TouchableOpacity, StatusBar
} from 'react-native';
import { homeStyles as styles, colors } from '../styles/HomeStyles'; // ← import depuis src\styles

export default function HomeScreen() {
  const studentName = "Yasmine";
  const today = "Samedi 22 Février 2026";

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

  const announcements = [
    { id: 1, title: "TP annulé jeudi",           prof: "Dr. Karim", time: "Il y a 2h" },
    { id: 2, title: "Examen reporté au lundi",    prof: "Dr. Chantit",  time: "Il y a 5h" },
    { id: 3, title: "Réunion de groupe vendredi", prof: "Dr. Amine", time: "Hier"      },
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

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Bonjour, {studentName}</Text>
            <Text style={styles.date}>{today}</Text>
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
        {announcements.map((item) => (
          <TouchableOpacity key={item.id} style={styles.announcementCard} activeOpacity={0.75}>
            <View style={styles.dotBox}>
              <View style={styles.dot} />
            </View>
            <View style={styles.announcementContent}>
              <Text style={styles.announcementTitle}>{item.title}</Text>
              <Text style={styles.announcementMeta}>{item.prof} · {item.time}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

    </ScrollView>
  );
}