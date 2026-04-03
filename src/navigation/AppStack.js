import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfHomeScreen from "../screens/prof/ProfHomeScreen";
import AddAnnouncementScreen from "../screens/AddAnnouncementScreen";
import AddGradeScreen from "../screens/AddGradeScreen";
import StudentListScreen from "../screens/prof/StudentListScreen";
import ManageAnnouncementsScreen from "../screens/prof/ManageAnnouncementsScreen";
import ManageGradesScreen from "../screens/prof/ManageGradesScreen";
import GenerateQRScreen from "../screens/prof/GenerateQRScreen";
import ScanQRScreen from "../screens/ScanQRScreen";
import StudentGradesScreen from '../screens/prof/StudentGradesScreen';


const Stack = createNativeStackNavigator();

const headerOptions = {
  headerShown: true,
  headerTitleStyle: { fontWeight: '600', fontSize: 16 },
  headerTintColor: '#FFFFFF',
  headerStyle: { backgroundColor: '#0D47A1' },
  headerTitleAlign: 'center',
};

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen name="ProfHome"            options={{ title: 'Tableau de bord' }}       component={ProfHomeScreen} />
      <Stack.Screen name="AddAnnouncement"     options={{ title: 'Nouvelle annonce' }}       component={AddAnnouncementScreen} />
      <Stack.Screen name="StudentList"         options={{ title: 'Liste des etudiants' }}    component={StudentListScreen} />
      <Stack.Screen name="AddGrade"            options={{ title: 'Saisir une note' }}        component={AddGradeScreen} />
      <Stack.Screen name="ManageAnnouncements" options={{ title: 'Mes annonces' }}           component={ManageAnnouncementsScreen} />
      <Stack.Screen name="ManageGrades"        options={{ title: 'Notes saisies' }}          component={ManageGradesScreen} />
      <Stack.Screen name="GenerateQR"          options={{ title: 'QR Code de presence' }}   component={GenerateQRScreen} />
      <Stack.Screen name="ScanQR"              options={{ title: 'Scanner QR Code' }}        component={ScanQRScreen} />
      <Stack.Screen
  name="StudentGrades"
  options={{ title: 'Notes de l\'etudiant' }}
  component={StudentGradesScreen}
/>
    </Stack.Navigator>
  );
}