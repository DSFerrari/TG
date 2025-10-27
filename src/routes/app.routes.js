import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Configuration from "../screens/Configuration";
import Favorites from "../screens/Favorites";
import ProfileStack from "./profile.routes";

import { MaterialCommunityIcons } from '@expo/vector-icons'

import theme from "../theme";
import HomeStack from "./home.routes";

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
        component={HomeStack}
        options={{
            tabBarIcon: () => (
                <MaterialCommunityIcons name="map-marker-outline" color = {theme.COLORS.WHITE3} size={24} />
            ),
        headerShown: false,
        }}
        />
        <authBottomTab.Screen
        name="Favoritos"
        component={Favorites}
        options={{
            tabBarIcon: () => (
<MaterialCommunityIcons name="heart-outline" color={theme.COLORS.WHITE3} size={24}/>
            ),
            headerTitle:'Favoritos',
            headerTintColor: theme.COLORS.WHITE3,
            headerStyle: {
                backgroundColor: theme.COLORS.BLUE1
            }
        }}
        />
        <authBottomTab.Screen
        name="Perfil"
        component={ProfileStack}
        options={{
            headerShown:false,
                tabBarIcon: () => (
    <MaterialCommunityIcons name="account-outline" color={theme.COLORS.WHITE3} size={24}/>
                ),
             
            }}
        />
        <authBottomTab.Screen
        name="Configurações"
        component={Configuration}
        options={{
            tabBarIcon: () => (
<MaterialCommunityIcons name="cog-outline" color={theme.COLORS.WHITE3} size={24}/>
            ),
            headerTitle:'Configurações',
            headerTintColor: theme.COLORS.WHITE3,
            headerStyle: {
                backgroundColor: theme.COLORS.BLUE1
            }
        }}
        />

    </authBottomTab.Navigator>
    )
}