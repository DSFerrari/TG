import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home';
import CadastrarEstabelecimento from '../screens/Home/CadastrarEstabelecimento';
import theme from '../theme';

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home}
      options={{
           headerTitle:'Inicio - Estabelecimentos',
                headerTintColor: theme.COLORS.WHITE3,
                headerStyle: {
                    backgroundColor: theme.COLORS.BLUE1
                }
      }}
      />
      <Stack.Screen name="Cadastrar Estabelecimento" component={CadastrarEstabelecimento}
      options={{
          headerBackTitle: '',
           headerTitle:'Cadastrar Estabelecimento',
                headerTintColor: theme.COLORS.WHITE3,
                headerStyle: {
                    backgroundColor: theme.COLORS.BLUE1
                }
      }}
      />

    </Stack.Navigator>
  );
}