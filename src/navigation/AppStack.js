import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import AddAnnouncementScreen from "../screens/AddAnnouncementScreen";
import AddGradeScreen from "../screens/AddGradeScreen";
import ProfHomeScreen from "../screens/prof/ProfHomeScreen";
import StudentListScreen from "../screens/prof/StudentListScreen";
import ManageAnnouncementsScreen from "../screens/prof/ManageAnnouncementsScreen";
import ManageGradesScreen from "../screens/prof/ManageGradesScreen";
import useAuth from "../hooks/useAuth";

const Stack = createNativeStackNavigator();

function AppStack() {
  return (
    <Stack.Navigator initialRouteName="ProfHome" screenOptions={{ 
      headerShown: true,
      headerTitleStyle: { fontWeight: 'bold' },
      headerTintColor: '#FFFFFF',
      headerStyle: { backgroundColor: '#0D47A1' },
      headerTitleAlign: 'center'
    }}>
      <Stack.Screen name="ProfHome" options={{ title: '🏠 Dashboard Prof' }} component={ProfHomeScreen} />
      <Stack.Screen name="AddAnnouncement" options={{ title: '📢 Nouvelle Annonce' }} component={AddAnnouncementScreen} />
      <Stack.Screen name="StudentList" options={{ title: '👥 Liste Étudiants' }} component={StudentListScreen} />
      <Stack.Screen name="AddGrade" options={{ title: '✏️ Ajouter Note' }} component={AddGradeScreen} />
      <Stack.Screen name="ManageAnnouncements" options={{ title: '📋 Mes Annonces' }} component={ManageAnnouncementsScreen} />
      <Stack.Screen name="ManageGrades" options={{ title: '📊 Mes Notes' }} component={ManageGradesScreen} />
    </Stack.Navigator>
  );
}

export default AppStack;
