import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';

import store from './src/store';

import LoginScreen     from './src/screens/LoginScreen';
import HomeScreen      from './src/screens/HomeScreen';
import MapScreen       from './src/screens/MapScreen';
import ProfileScreen   from './src/screens/ProfileScreen';
import TimetableScreen from './src/screens/TimetableScreen';
import GradesScreen    from './src/screens/GradesScreen';

const Tab   = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0D47A1',
          borderTopWidth: 0,
          height: 65,
          paddingBottom: 10,
          paddingTop: 8,
          elevation: 20,
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#90CAF9',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen name="Home"      component={HomeScreen}
        options={{ tabBarLabel: 'Accueil', tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🏠</Text> }} />
      <Tab.Screen name="Timetable" component={TimetableScreen}
        options={{ tabBarLabel: 'EDT',     tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>📅</Text> }} />
      <Tab.Screen name="Map"       component={MapScreen}
        options={{ tabBarLabel: 'Campus',  tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🗺️</Text> }} />
      <Tab.Screen name="Grades"    component={GradesScreen}
        options={{ tabBarLabel: 'Notes',   tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>📊</Text> }} />
      <Tab.Screen name="Profile"   component={ProfileScreen}
        options={{ tabBarLabel: 'Profil',  tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>👤</Text> }} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main"  component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Provider Redux englobe toute l'app
export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
