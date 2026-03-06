import { NavigationContainer } from '@react-navigation/native';
import { useState } from 'react';
import AuthStack from './src/navigation/AuthStack';
import AppStack from './src/navigation/AppStack';

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //         ↑
  //   false = pas connecté au départ

  return (
    <NavigationContainer>
      {isLoggedIn
        ? <AppStack />
        : <AuthStack setIsLoggedIn={setIsLoggedIn} />
      }
    </NavigationContainer>
  );
}


/**
 * import LoginScreen from './src/screens/LoginScreen';
import MapScreen from './src/screens/MapScreen';
import HomeScreen from './src/screens/HomeScreen';
import TestSceen  from './src/screens/TestSceen';
import ProfileScreen from './src/screens/ProfileScreen';
import TimetableScreen from './src/screens/TimetableScreen';
import GradesScreen from './src/screens/GradesScreen';


  
export default function App() {
  //return <LoginScreen />;
  //return <HomeScreen />;
  //return <TestSceen />;
  return <ProfileScreen />;
  //return <GradesScreen />;
  //return <TimetableScreen />;
  //return <MapScreen />;


}
 */