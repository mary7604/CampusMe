import { NavigationContainer } from '@react-navigation/native';
import { useState } from 'react';
import AuthStack from './src/navigation/AuthStack';
import AppStack from './src/navigation/AppStack';

// import LoginScreen from './src/screens/LoginScreen';
// import MapScreen from './src/screens/MapScreen';
// import HomeScreen from './src/screens/HomeScreen';
// import TestSceen  from './src/screens/TestSceen';
// import ProfileScreen from './src/screens/ProfileScreen';
// import TimetableScreen from './src/screens/TimetableScreen';
// import GradesScreen from './src/screens/GradesScreen';

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      {isLoggedIn
        ? <AppStack />
        : <AuthStack setIsLoggedIn={setIsLoggedIn} />
      }
    </NavigationContainer>
  );

  // return <LoginScreen />;
  // return <HomeScreen />;
  // return <TestSceen />;
  // return <ProfileScreen />;
  // return <GradesScreen />;
  // return <TimetableScreen />;
  // return <MapScreen />;
}