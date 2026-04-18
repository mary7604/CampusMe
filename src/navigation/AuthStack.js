import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StartScreen from "../screens/StartScreen";  // ← ajoute !
import LoginScreen from "../screens/LoginScreen";

const Stack = createNativeStackNavigator();

function AuthStack({ setIsLoggedIn }) {
  return (
    <Stack.Navigator initialRouteName="Start">
    {/*                                   
                           Start = premier écran ! */}

      {/* ÉCRAN START */}
      <Stack.Screen
        name="Start"
        component={StartScreen}
        options={{ headerShown: false }}
      />

      {/* ÉCRAN LOGIN */}
      <Stack.Screen
        name="Login"
        options={{ headerShown: false }}
      >
        {(props) => (
          <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />
        )}
      </Stack.Screen>

    </Stack.Navigator>
  );
}

export default AuthStack;