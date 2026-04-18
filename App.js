import { Provider, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './src/i18n';
import store from './src/store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


import LoginScreen               from './src/screens/LoginScreen';
import RegisterScreen            from './src/screens/RegisterScreen';
import HomeScreen                from './src/screens/HomeScreen';
import MapScreen                 from './src/screens/MapScreen';
import ProfileScreen             from './src/screens/ProfileScreen';
import TimetableScreen           from './src/screens/TimetableScreen';
import GradesScreen              from './src/screens/GradesScreen';
import ScanQRScreen              from './src/screens/ScanQRScreen';
import ProfStack                 from './src/navigation/ProfStack';
import AttendanceScreen          from './src/screens/AttendanceScreen';
import AnnouncementsScreen       from './src/screens/AnnouncementsScreen';      
import AnnouncementDetailScreen  from './src/screens/AnnouncementDetailScreen';  

import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import HelpScreen from './src/screens/HelpScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import LanguageScreen from './src/screens/LanguageScreen';

const Tab          = createBottomTabNavigator();
const Stack        = createStackNavigator();
const StudentStack = createStackNavigator();

function MainTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
       screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0D47A1',
          borderTopWidth: 0,
          height: 65 + insets.bottom, 
          paddingBottom: insets.bottom || 10,
          paddingTop: 8,
          elevation: 20,
        },
        tabBarActiveTintColor:   '#FFFFFF',
        tabBarInactiveTintColor: '#90CAF9',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen}
        options={{ tabBarLabel: 'Accueil', tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}></Text> }} />
      <Tab.Screen name="Timetable" component={TimetableScreen}
        options={{ tabBarLabel: 'EDT',     tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>📅</Text> }} />
      <Tab.Screen name="Map" component={MapScreen}
        options={{ tabBarLabel: 'Campus',  tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🗺️</Text> }} />
      <Tab.Screen name="Grades" component={GradesScreen}
        options={{ tabBarLabel: 'Notes',   tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>📊</Text> }} />
      <Tab.Screen name="Profile" component={ProfileScreen}
        options={{ tabBarLabel: 'Profil',  tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>👤</Text> }} />
    </Tab.Navigator>
  );
}

function StudentNavigator() {
  return (
    <StudentStack.Navigator screenOptions={{ headerShown: false }}>

      {/* ── écrans principaux ── */}
      <StudentStack.Screen name="MainTabs"  component={MainTabs} />

      {/* ── annonces ── */}
      <StudentStack.Screen
        name="Announcements"
        component={AnnouncementsScreen}
        options={{ headerShown: false }}   // header géré dans le composant lui-même
      />
      <StudentStack.Screen
        name="AnnouncementDetail"
        component={AnnouncementDetailScreen}
        options={{ headerShown: false }}   // idem
      />

      {/* ── autres écrans existants ── */}
      <StudentStack.Screen
        name="ScanQR"
        component={ScanQRScreen}
        options={{
          headerShown:      true,
          headerTitle:      'Scanner QR Code',
          headerStyle:      { backgroundColor: '#0D47A1' },
          headerTintColor:  '#fff',
          headerTitleStyle: { fontWeight: '600' },
          headerTitleAlign: 'center',
        }}
      />
      <StudentStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          headerShown: true,
          headerTitle: 'Mot de passe',
          headerStyle: { backgroundColor: '#0D47A1' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '600' },
          headerTitleAlign: 'center',
        }}
      />
      <StudentStack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          headerShown: true,
          headerTitle: 'Notifications',
          headerStyle: { backgroundColor: '#0D47A1' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '600' },
          headerTitleAlign: 'center',
        }}
      />
      <StudentStack.Screen
        name="Language"
        component={LanguageScreen}
        options={{
          headerShown: true,
          headerTitle: 'Langue',
          headerStyle: { backgroundColor: '#0D47A1' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '600' },
          headerTitleAlign: 'center',
        }}
      />
      <StudentStack.Screen
        name="Help"
        component={HelpScreen}
        options={{
          headerShown: true,
          headerTitle: 'Aide et support',
          headerStyle: { backgroundColor: '#0D47A1' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '600' },
          headerTitleAlign: 'center',
        }}
      />
      <StudentStack.Screen
        name="Attendance"
        component={AttendanceScreen}
        options={{
          headerShown:      true,
          headerTitle:      'Mes Présences',
          headerStyle:      { backgroundColor: '#0D47A1' },
          headerTintColor:  '#fff',
          headerTitleStyle: { fontWeight: '600' },
          headerTitleAlign: 'center',
        }}
      />

    </StudentStack.Navigator>
  );
}

function AppNavigator() {
  const { isLoggedIn, user, loading } = useSelector(state => state.auth);

  if (loading) {
    return (
      <NavigationContainer>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="Login"    component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        ) : user?.role === 'professeur' ? (
          <Stack.Screen name="ProfMain" component={ProfStack} />
        ) : (
          <Stack.Screen name="Main" component={StudentNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </Provider>
  );
}