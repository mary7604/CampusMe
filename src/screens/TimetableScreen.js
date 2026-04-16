import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import colors from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import { timetableStyles } from '../styles/TimetableStyles';
import coursesApi from '../api/coursesApi';
import { useSelector } from 'react-redux';
import notificationService from '../services/notificationService';
import * as Notifications from 'expo-notifications';
import { SafeAreaView } from 'react-native-safe-area-context';

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

const COURSE_COLORS = [
  colors.dark, colors.primary, colors.secondary,
  '#1565C0', '#2E7D32', '#E65100',
];

export default function TimetableScreen({ navigation }) {
  // const { t } = useTranslation(); 
  const user = useSelector(s => s.auth.user);
  const [weekCourses, setWeekCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(() => {
    const d = new Date().getDay();
    return d === 0 ? 5 : d - 1; // Dimanche→Sam(5), sinon Lundi=0
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await coursesApi.getWeekCourses(user?.group || 'all');
      const grouped = (res.data || []).reduce((acc, course) => {
        if (!acc[course.day]) acc[course.day] = [];
        acc[course.day].push(course);
        return acc;
      }, {});
      setWeekCourses(grouped);
      const todayIndex = new Date().getDay() === 0 ? 5 : new Date().getDay() - 1;
const todayList = grouped[todayIndex] || [];
scheduleCoursNotifications(todayList);
    } catch (e) {
      console.log('Erreur cours:', e);
    } finally {
      setLoading(false);
    }
  };

  const todayCourses = weekCourses[activeDay] || [];

  // Dates de la semaine courante
  const getWeekDates = () => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1));
    return DAYS.map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d.getDate().toString();
    });
  };
  const weekDates = getWeekDates();
  const scheduleCoursNotifications = async (courses) => {
  await notificationService.cancelAll();
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;

  const now = new Date();
  courses.forEach(course => {
    const startTime = course.time?.split(' - ')[0];
    if (!startTime) return;
    const [h, m] = startTime.split(':').map(Number);
    const courseDate = new Date();
    courseDate.setHours(h, m + 1, 0, 0); // dans 1 minute
    if (courseDate > now) {
      notificationService.scheduleNotification(
        'Cours dans 15 minutes',
        `${course.subject} — ${course.room}`,
        courseDate
      );
    }
  });
};

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
    <View style={globalStyles.container}>
      <View style={globalStyles.header}>

      
        <Text style={globalStyles.headerTitle}>Emploi du temps</Text>
        <Text style={globalStyles.headerSubtitle}>
          {user?.group || ''} — {user?.filiere || ''}
        </Text>
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
              {day}
            </Text>
            <Text style={[timetableStyles.dayNum, activeDay === i && timetableStyles.dayNumActive]}>
              {weekDates[i]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LISTE DES COURS */}
      <ScrollView style={timetableStyles.coursesList} showsVerticalScrollIndicator={false}>
        {todayCourses.length === 0 ? (
          <View style={timetableStyles.emptyContainer}>
            <Text style={timetableStyles.emptyText}>Pas de cours ce jour.</Text>
          </View>
        ) : (
          todayCourses.map((course, idx) => (
            <View key={course.id}>
              <Text style={timetableStyles.timeLabel}>{course.time}</Text>
              <View style={timetableStyles.courseCard}>
                <View style={[timetableStyles.courseStripe, {
                  backgroundColor: COURSE_COLORS[idx % COURSE_COLORS.length]
                }]} />
                <View style={timetableStyles.courseContent}>
                  <Text style={timetableStyles.courseSubject}>{course.subject}</Text>
                  <View style={timetableStyles.courseRow}>
                    <Text style={timetableStyles.courseDetail}>{course.room}</Text>
                  </View>
                  <View style={timetableStyles.courseRow}>
                    <Text style={timetableStyles.courseDetail}>{course.professor}</Text>
                  </View>
                </View>
                {course.latitude && (
                  <TouchableOpacity
                    style={timetableStyles.courseMapBtn}
                    onPress={() => navigation.navigate('Map', {
                      destination: {
                        name: course.room,
                        latitude: course.latitude,
                        longitude: course.longitude,
                      }
                    })}
                  >
                    <Text style={timetableStyles.courseMapIcon}>carte</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  </SafeAreaView>
  );
}