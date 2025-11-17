import { createStackNavigator } from "@react-navigation/stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import theme from "../theme";

import HomeAdmin from "../screens/Admin/Home";
import UsersAdmin from "../screens/Admin/Users";
import EstabsAdmin from "../screens/Admin/Estabs";
import DetalhesEstabAdmin from "../screens/Admin/Estabs/DetalhesEstabAdmin";

const Stack = createStackNavigator();

export default function AdminRoutes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.COLORS.BLUE1,
        },
        headerTintColor: theme.COLORS.WHITE1,
        contentStyle: {
          backgroundColor: theme.COLORS.WHITE1,
        },
      }}
    >
      <Stack.Screen
        name="AdminInicio"
        component={HomeAdmin}
        options={{
          title: "Adm-Início",
        }}
      />

      <Stack.Screen
        name="AdminUsers"
        component={UsersAdmin}
        options={{
          title: "Usuários",
        }}
      />

      <Stack.Screen
        name="AdminEstabs"
        component={EstabsAdmin}
        options={{
          title: "Estabelecimentos",
        }}
      />

      <Stack.Screen
  name="DetalhesEstabAdmin"
  component={DetalhesEstabAdmin}
  options={{ title: "Detalhes do Estabelecimento" }}
/>
    </Stack.Navigator>
  );
}