import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Configuration from "../screens/Configuration";
import Favorites from "../screens/Favorites";
import Profiles from "../screens/Profiles";
import Home from "../screens/Home"

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import theme from "../theme";

const authBottomTab = createBottomTabNavigator();
export default function authTab(){
    return(
    <authBottomTab.Navigator
    screenOptions={{
        tabBarStyle: {
            height: 112,
            paddingBottom:10,
            paddingTop: 20,
            backgroundColor: theme.COLORS.BLUE1

        },
        tabBarInactiveTintColor: theme.COLORS.WHITE3
    }}
    >
        <authBottomTab.Screen
        name="Inicio"
        component={Home}
        options={{
            tabBarIcon: () => (
<Icon name="map-marker-outline" color={theme.COLORS.WHITE3} size={24}/>
            ),
        }}
        />
        <authBottomTab.Screen
        name="Favoritos"
        component={Favorites}
        options={{
            tabBarIcon: () => (
<Icon name="heart-outline" color={theme.COLORS.WHITE3} size={24}/>
            ),
        }}
        />
        <authBottomTab.Screen
        name="Perfil"
        component={Profiles}
        options={{
            tabBarIcon: () => (
<Icon name="account-outline" color={theme.COLORS.WHITE3} size={24}/>
            ),
        }}
        />
        <authBottomTab.Screen
        name="Configuracao"
        component={Configuration}
        options={{
            tabBarIcon: () => (
<Icon name="cog-outline" color={theme.COLORS.WHITE3} size={24}/>
            ),
        }}
        />
    </authBottomTab.Navigator>
    )
}