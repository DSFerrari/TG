import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import theme from "../theme";

import Configuration from "../screens/Configuration";
import Favorites from "../screens/Favorites";
import ProfileStack from "./profile.routes";
import HomeStack from "./home.routes";
import { useContext } from "react";
import { AppContext } from "../contexts/app";
import HomeAdmin from "../screens/Admin/Home";
import AdminRoutes from "./admin.routes";


const Tab = createBottomTabNavigator();

export default function AuthTab() {
  const { userIsAdmin } = useContext(AppContext);
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 112,
          paddingBottom: 10,
          paddingTop: 20,
          backgroundColor: theme.COLORS.BLUE1,
        },
        tabBarInactiveTintColor: theme.COLORS.WHITE3,
        headerShown: false,
      }}
    >
 
      <Tab.Screen
        name="Início"
        component={HomeStack}
        options={{
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="map-marker-outline"
              color={theme.COLORS.WHITE3}
              size={24}
            />
          ),
        }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            const state = navigation.getState();
            const currentRoute = state.routes[state.index];

            if (currentRoute.name === route.name) {
    
              e.preventDefault();
    
              navigation.reset({
                index: 0,
                routes: [{ name: "Início"}],
              });
            }
          },
        })}
      />

      <Tab.Screen
        name="Favoritos"
        component={Favorites}
        options={{
          headerShown: true,
          headerTitle: "Favoritos",
          headerTintColor: theme.COLORS.WHITE3,
          headerStyle: { backgroundColor: theme.COLORS.BLUE1 },
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="heart-outline"
              color={theme.COLORS.WHITE3}
              size={24}
            />
          ),
        }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            const state = navigation.getState();
            const currentRoute = state.routes[state.index];

            if (currentRoute.name === route.name) {
              e.preventDefault();
              navigation.reset({
                index: 0,
                routes: [{ name: "Favoritos"}],
              });
            }
          },
        })}
      />

      <Tab.Screen
        name="Perfil"
        component={ProfileStack}
        options={{
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="account-outline"
              color={theme.COLORS.WHITE3}
              size={24}
            />
          ),
        }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            const state = navigation.getState();
            const currentRoute = state.routes[state.index];

            if (currentRoute.name === route.name) {
              e.preventDefault();
              navigation.reset({
                index: 0,
                routes: [{ name: "Perfil"}],
              });
            }
          },
        })}
      />

      <Tab.Screen
        name="Configurações"
        component={Configuration}
        options={{
          headerShown: true,
          headerTitle: "Configurações",
          headerTintColor: theme.COLORS.WHITE3,
          headerStyle: { backgroundColor: theme.COLORS.BLUE1 },
          tabBarIcon: () => (
            <MaterialCommunityIcons
              name="cog-outline"
              color={theme.COLORS.WHITE3}
              size={24}
            />
          ),
        }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            const state = navigation.getState();
            const currentRoute = state.routes[state.index];

            if (currentRoute.name === route.name) {
              e.preventDefault();
             navigation.reset({
                index: 0,
                routes: [{ name: "Configurações"}],
              });
            }
          },
        })}
      />
      {userIsAdmin &&
        <Tab.Screen
          name="AdminHome"
        component={AdminRoutes}
        options={{
          headerShown: false,
          headerTitle: "Administração",
          headerTintColor: theme.COLORS.WHITE3,
          headerBackTitleVisible: false,
        headerBackTitle: '', 
          headerStyle: { backgroundColor: theme.COLORS.BLUE1 },
           tabBarIcon: () => (
            <MaterialCommunityIcons
              name="shield-account-outline"
              color={theme.COLORS.WHITE3}
              size={24}
            />
          ),
        }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            const state = navigation.getState();
            const currentRoute = state.routes[state.index];

            if (currentRoute.name === route.name) {
              e.preventDefault();
             navigation.reset({
                index: 0,
                routes: [{ name: "AdminHome"}],
              });
            }
          },
        })}
      />
      }
    </Tab.Navigator>
  );
}
