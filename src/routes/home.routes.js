import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home';
import CadastrarEstabelecimento from '../screens/Home/CadastrarEstabelecimento';
import theme from '../theme';
import Detalhes from '../screens/Home/Detalhes';
import Avaliacoes from '../screens/Home/Avaliacoes';
import EscreverAvaliacao from '../screens/Home/Avaliacoes/EscreverAvaliacao';
import EditarSolicitacao from '../screens/Home/EditarSolicitacao';

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      
      <Stack.Screen 
        name="Home" 
        component={Home}
        options={{
          headerTitle: 'Início - Estabelecimentos',
          headerTintColor: theme.COLORS.WHITE3,
          headerStyle: { backgroundColor: theme.COLORS.BLUE1 }
        }}
      />

      <Stack.Screen 
        name="Cadastrar Estabelecimento" 
        component={CadastrarEstabelecimento}
        options={{
          headerBackTitle: '',
          headerTitle: 'Cadastrar Estabelecimento',
          headerTintColor: theme.COLORS.WHITE3,
          headerStyle: { backgroundColor: theme.COLORS.BLUE1 }
        }}
      />

      <Stack.Screen 
        name="Detalhes" 
        component={Detalhes}
        options={({ route }) => ({
          headerBackTitle: '',
          headerTitle: route.params.estabelecimento.nome || 'Detalhes',
          headerTintColor: theme.COLORS.WHITE3,
          headerStyle: { backgroundColor: theme.COLORS.BLUE1 }
        })}
      />

      <Stack.Screen
        name="Avaliacoes"
        component={Avaliacoes}
        options={{ title: 'Avaliações' }}
      />

      <Stack.Screen
        name="EscreverAvaliacao"
        component={EscreverAvaliacao}
        options={{ title: 'Escrever avaliação', headerBackTitle: '' }}
      />

      <Stack.Screen
        name="EditarSolicitacao"
        component={EditarSolicitacao}
        options={{
          headerTitle: "Editar Estabelecimento",
          headerTintColor: theme.COLORS.WHITE3,
          headerStyle: { backgroundColor: theme.COLORS.BLUE1 }
        }}
      />

    </Stack.Navigator>
  );
}
