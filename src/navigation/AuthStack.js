import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";

const Stack = createNativeStackNavigator();

function AuthStack({ setIsLoggedIn }) {
//                       ↑
//         reçoit setIsLoggedIn depuis App.js

  return (
    <Stack.Navigator initialRouteName="Login">

      <Stack.Screen
        name="Login"
        options={{ headerShown: false }}
      >
        {(props) => (
          <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />
        )}
      </Stack.Screen>
      {/* headerShown: false = cache la barre du haut */}

    </Stack.Navigator>
  );
}

export default AuthStack;