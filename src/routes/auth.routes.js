import { createStackNavigator } from "@react-navigation/stack";

import SignIn from "../screens/SignIn";
import SignUp from "../screens/SignUp";
import ConfirmEmailScreen from "../screens/SignUp/ConfirmEmail";
import theme from "../theme";
import ForgetPassword from "../screens/ForgetPassword";
import Confirm from "../screens/ForgetPassword/Confirm";
import Change from "../screens/ForgetPassword/Change";

const AuthStack = createStackNavigator();

export default function AuthRoutes(){
return(
    <AuthStack.Navigator
    screenOptions={{
        headerStyle:{
            backgroundColor: theme.COLORS.BLUE1,
            height: 80,
        },
        headerTintColor: theme.COLORS.WHITE1,
        headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600'
        }
        
    }}
    >
        <AuthStack.Screen
        name="SignIn"
        component={SignIn}
        options={{
            headerShown: false,
        }
        }
        />
        <AuthStack.Screen
        name="SignUp"
        component={SignUp}
        options={{
            headerShown: false
        }}
        />

        <AuthStack.Screen
        name="ConfirmEmail"
        component={ConfirmEmailScreen}
        options={{
            headerShown: false
        }}
        />

        <AuthStack.Screen
        name="Esqueci minha senha"
        component={ForgetPassword}
        options={{
            headerShown: false
        }}
        />

        <AuthStack.Screen
        name="VerifyResetOtp"
        component={Confirm}
          options={{
            headerShown: false
        }}
        />

        <AuthStack.Screen
        name="UpdatePassword"
        component={Change}
          options={{
            headerShown: false
        }}
        />

    </AuthStack.Navigator>
)
}