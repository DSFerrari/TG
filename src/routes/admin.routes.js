import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import theme from "../theme";

import HomeAdmin from "../screens/Admin/HomeAdmin";
import UsersAdmin from "../screens/Admin/UsersAdmin";
import EstabsAdmin from "../screens/Admin/EstabsAdmin";

const Tab = createBottomTabNavigator();

export default function AdminRoutes() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.COLORS.BLUE1,
        },
        headerTintColor: theme.COLORS.WHITE1,
        tabBarStyle: {
          backgroundColor: theme.COLORS.BLUE1,
          height: 100,
          paddingTop: 15,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: theme.COLORS.WHITE1,
        tabBarInactiveTintColor: theme.COLORS.WHITE3,
      }}
    >
      <Tab.Screen
        name="Início"
        component={HomeAdmin}
        options={{
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="view-dashboard-outline" color={color} size={24} />
          ),
        }}
      />

      <Tab.Screen
        name="Usuários"
        component={UsersAdmin}
        options={{
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-group-outline" color={color} size={24} />
          ),
        }}
      />

      <Tab.Screen
        name="Estabelecimentos"
        component={EstabsAdmin}
        options={{
          headerShown: true,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="store-outline" color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}