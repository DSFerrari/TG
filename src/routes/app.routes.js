import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Configuration from "../screens/Configuration";
import Favorites from "../screens/Favorites";
import Profiles from "../screens/Profiles";
import Home from "../screens/Home"

const authBottomTab = createBottomTabNavigator();
export default function authTab(){
    <authBottomTab.Navigator>
        <authBottomTab.Screen
        name="Inicio"
        component={Home}
        />
        <authBottomTab.Screen
        name="Favoritos"
        component={Favorites}
        />
        <authBottomTab.Screen
        name="Perfil"
        component={Profiles}
        />
        <authBottomTab.Screen
        name="Configuracao"
        component={Configuration}
        />
    </authBottomTab.Navigator>
}