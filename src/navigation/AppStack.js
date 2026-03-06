import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";

const Stack = createNativeStackNavigator();

function AppStack() {
// pas de props car déjà connecté !

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      <Stack.Screen name="Home" component={HomeScreen} />

    </Stack.Navigator>
  );
}

export default AppStack;