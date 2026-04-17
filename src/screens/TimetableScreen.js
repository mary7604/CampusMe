import { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, Modal, FlatList
} from 'react-native';
import colors from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import { timetableStyles } from '../styles/TimetableStyles';
import coursesApi from '../api/coursesApi';
import { useSelector } from 'react-redux';
import notificationService from '../services/notificationService';
import * as Notifications from 'expo-notifications';
import { SafeAreaView } from 'react-native-safe-area-context';

const DAY_NAMES_SHORT = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const DAY_NAMES_FULL  = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
const MONTH_NAMES = [
  'Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre'
];

const COURSE_COLORS = [
  colors.dark, colors.primary, colors.secondary,
  '#1565C0', '#2E7D32', '#E65100',
];

// ── helpers ───────────────────────────────────────────────
const toDateKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

// index backend : 0=Lun … 5=Sam
const backendDay = (jsDay) => (jsDay === 0 ? 6 : jsDay - 1);

// ──────────────────────────────────────────────────────────
export default function TimetableScreen({ navigation }) {
  const user = useSelector(s => s.auth.user);
  const [allCourses, setAllCourses]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [calMonth, setCalMonth]         = useState(new Date());
  const stripRef = useRef(null);

  // ── 6 jours à afficher dans le strip ──────────────────
  const buildStrip = (center) => {
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(center);
      d.setDate(center.getDate() - 2 + i);
      return d;
    });
  };
  const [stripDays, setStripDays] = useState(() => buildStrip(new Date()));

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await coursesApi.getWeekCourses(user?.group || 'all');
      setAllCourses(res.data || []);
      scheduleCoursNotifications(res.data || []);
    } catch (e) {
      console.log('Erreur cours:', e);
    } finally {
      setLoading(false);
    }
  };

  // cours du jour sélectionné
  const dayIndex   = backendDay(selectedDate.getDay());
  const todayCourses = allCourses.filter(c => c.day === dayIndex);

  // ── navigation dans le strip ──────────────────────────
  const selectDay = (date) => {
    setSelectedDate(date);
    setStripDays(buildStrip(date));
  };

  // ── calendrier mensuel ────────────────────────────────
  const buildMonthGrid = (ref) => {
    const year  = ref.getFullYear();
    const month = ref.getMonth();
    const first = new Date(year, month, 1).getDay(); // 0=dim
    const days  = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < first; i++) cells.push(null);
    for (let d = 1; d <= days; d++) cells.push(new Date(year, month, d));
    return cells;
  };
  const monthGrid = buildMonthGrid(calMonth);

  const scheduleCoursNotifications = async (courses) => {
    await notificationService.cancelAll();
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return;
    const now      = new Date();
    const todayIdx = backendDay(now.getDay());
    courses.filter(c => c.day === todayIdx).forEach(course => {
      const startTime = course.time?.split(' - ')[0];
      if (!startTime) return;
      const [h, m] = startTime.split(':').map(Number);
      const t = new Date(); t.setHours(h, m - 15, 0, 0);
      if (t > now) notificationService.scheduleNotification(
        'Cours dans 15 minutes', `${course.subject} — ${course.room}`, t
      );
    });
  };

  const isToday = (d) => toDateKey(d) === toDateKey(new Date());
  const isSelected = (d) => toDateKey(d) === toDateKey(selectedDate);

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top']}>

      {/* ── HEADER ──────────────────────────────────────── */}
      <View style={globalStyles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={globalStyles.headerTitle}>Emploi du temps</Text>
            <Text style={globalStyles.headerSubtitle}>
              {user?.group || ''} — {user?.filiere || ''}
            </Text>
          </View>
          {/* bouton calendrier */}
          <TouchableOpacity
            onPress={() => { setCalMonth(new Date(selectedDate)); setShowCalendar(true); }}
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: 10, padding: 8,
            }}
          >
            <Text style={{ fontSize: 22 }}>📅</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── STRIP 6 JOURS ───────────────────────────────── */}
      <View style={{
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 8,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
      }}>
        {stripDays.map((date, i) => {
          const sel = isSelected(date);
          const tod = isToday(date);
          return (
            <TouchableOpacity
              key={i}
              onPress={() => selectDay(date)}
              style={{
                flex: 1, alignItems: 'center',
                paddingVertical: 8, borderRadius: 12,
                backgroundColor: sel ? colors.primary : 'transparent',
              }}
            >
              <Text style={{
                fontSize: 11, fontWeight: '600',
                color: sel ? '#fff' : '#999',
                marginBottom: 4,
              }}>
                {DAY_NAMES_SHORT[date.getDay()]}
              </Text>
              <View style={{
                width: 32, height: 32, borderRadius: 16,
                justifyContent: 'center', alignItems: 'center',
                backgroundColor: sel ? 'rgba(255,255,255,0.25)'
                  : tod ? colors.primary + '20' : 'transparent',
                borderWidth: tod && !sel ? 1.5 : 0,
                borderColor: colors.primary,
              }}>
                <Text style={{
                  fontSize: 14, fontWeight: '700',
                  color: sel ? '#fff' : tod ? colors.primary : '#333',
                }}>
                  {date.getDate()}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* label jour sélectionné */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: colors.dark }}>
          {DAY_NAMES_FULL[selectedDate.getDay()]} {selectedDate.getDate()} {MONTH_NAMES[selectedDate.getMonth()]}
          {isToday(selectedDate) ? "  🟢 Aujourd'hui" : ''}
        </Text>
      </View>

      {/* ── LISTE DES COURS ─────────────────────────────── */}
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {todayCourses.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Text style={{ fontSize: 40 }}>📭</Text>
            <Text style={{ color: '#999', marginTop: 12, fontSize: 15 }}>Pas de cours ce jour.</Text>
          </View>
        ) : (
          todayCourses.map((course, idx) => (
            <View key={course.id} style={{ paddingHorizontal: 16, marginBottom: 12 }}>
              <Text style={timetableStyles.timeLabel}>{course.time}</Text>
              <View style={timetableStyles.courseCard}>
                <View style={[timetableStyles.courseStripe, {
                  backgroundColor: COURSE_COLORS[idx % COURSE_COLORS.length]
                }]} />
                <View style={timetableStyles.courseContent}>
                  <Text style={timetableStyles.courseSubject}>{course.subject}</Text>
                  <Text style={timetableStyles.courseDetail}>{course.room}</Text>
                  <Text style={timetableStyles.courseDetail}>{course.professor}</Text>
                </View>
                {course.latitude && (
                  <TouchableOpacity
                    style={timetableStyles.courseMapBtn}
                    onPress={() => navigation.navigate('Map', {
                      destination: { name: course.room, latitude: course.latitude, longitude: course.longitude }
                    })}
                  >
                    <Text style={timetableStyles.courseMapIcon}>🗺️</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* ── MODAL CALENDRIER MENSUEL ─────────────────────── */}
      <Modal visible={showCalendar} transparent animationType="slide">
        <View style={{
          flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
          justifyContent: 'flex-end',
        }}>
          <View style={{
            backgroundColor: '#fff', borderTopLeftRadius: 24,
            borderTopRightRadius: 24, paddingBottom: 40,
          }}>

            {/* entête modal */}
            <View style={{
              flexDirection: 'row', alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8,
            }}>
              <TouchableOpacity onPress={() => {
                const p = new Date(calMonth);
                p.setMonth(p.getMonth() - 1);
                setCalMonth(p);
              }}>
                <Text style={{ fontSize: 22, color: colors.primary }}>‹</Text>
              </TouchableOpacity>

              <Text style={{ fontSize: 17, fontWeight: '700', color: colors.dark }}>
                {MONTH_NAMES[calMonth.getMonth()]} {calMonth.getFullYear()}
              </Text>

              <TouchableOpacity onPress={() => {
                const n = new Date(calMonth);
                n.setMonth(n.getMonth() + 1);
                setCalMonth(n);
              }}>
                <Text style={{ fontSize: 22, color: colors.primary }}>›</Text>
              </TouchableOpacity>
            </View>

            {/* noms des jours */}
            <View style={{ flexDirection: 'row', paddingHorizontal: 12, marginBottom: 4 }}>
              {['Di','Lu','Ma','Me','Je','Ve','Sa'].map(d => (
                <Text key={d} style={{
                  flex: 1, textAlign: 'center',
                  fontSize: 12, fontWeight: '600', color: '#999',
                }}>
                  {d}
                </Text>
              ))}
            </View>

            {/* grille */}
            <FlatList
              data={monthGrid}
              keyExtractor={(_, i) => String(i)}
              numColumns={7}
              scrollEnabled={false}
              renderItem={({ item: date }) => {
                if (!date) return <View style={{ flex: 1, height: 44 }} />;
                const sel = isSelected(date);
                const tod = isToday(date);
                return (
                  <TouchableOpacity
                    style={{ flex: 1, alignItems: 'center', paddingVertical: 6 }}
                    onPress={() => {
                      selectDay(date);
                      setShowCalendar(false);
                    }}
                  >
                    <View style={{
                      width: 36, height: 36, borderRadius: 18,
                      justifyContent: 'center', alignItems: 'center',
                      backgroundColor: sel ? colors.primary
                        : tod ? colors.primary + '20' : 'transparent',
                      borderWidth: tod && !sel ? 1.5 : 0,
                      borderColor: colors.primary,
                    }}>
                      <Text style={{
                        fontSize: 14, fontWeight: sel || tod ? '700' : '400',
                        color: sel ? '#fff' : tod ? colors.primary : '#333',
                      }}>
                        {date.getDate()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
              contentContainerStyle={{ paddingHorizontal: 12 }}
            />

            {/* bouton fermer */}
            <TouchableOpacity
              onPress={() => setShowCalendar(false)}
              style={{
                marginTop: 16, marginHorizontal: 20,
                backgroundColor: colors.primary,
                borderRadius: 12, paddingVertical: 14,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}