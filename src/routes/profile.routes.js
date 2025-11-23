import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/Profiles';
import ProfileOptions from '../screens/Profiles/Change';
import Photo from '../screens/Profiles/Change/Photo';
import theme from '../theme';
import Informacoes from '../screens/Profiles/Change/Informacoes';
import AlterarSenha from '../screens/Profiles/Change/AlterarSenha';
import ConfiguracoesAvancadas from '../screens/Profiles/Change/ConfiguracoesAvancadas';

import MinhasSolicitacoes from '../screens/Profiles/MinhasSolicitacoes';
import SolicitacaoDetalheUser from '../screens/Profiles/MinhasSolicitacoes/Detalhe';

const Stack = createStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator>

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerTitle: 'Perfil',
          headerTintColor: theme.COLORS.WHITE3,
          headerStyle: { backgroundColor: theme.COLORS.BLUE1 }
        }}
      />

      <Stack.Screen
        name="Editar Perfil"
        component={ProfileOptions}
        options={{
          headerTitle: 'Editar Perfil',
          headerTintColor: theme.COLORS.WHITE3,
          headerStyle: { backgroundColor: theme.COLORS.BLUE1 }
        }}
      />

      <Stack.Screen
        name="photo"
        component={Photo}
        options={{
          headerTitle: 'Foto',
          headerTintColor: theme.COLORS.WHITE3,
          headerStyle: { backgroundColor: theme.COLORS.BLUE1 }
        }}
      />

      <Stack.Screen
        name="informacoes"
        component={Informacoes}
        options={{
          headerTitle: 'Inf. Pessoais',
          headerTintColor: theme.COLORS.WHITE3,
          headerStyle: { backgroundColor: theme.COLORS.BLUE1 }
        }}
      />

      <Stack.Screen
        name="alterarSenha"
        component={AlterarSenha}
        options={{
          headerTitle: 'Alterar Senha',
          headerTintColor: theme.COLORS.WHITE3,
          headerStyle: { backgroundColor: theme.COLORS.BLUE1 }
        }}
      />

      <Stack.Screen
        name="avancadas"
        component={ConfiguracoesAvancadas}
        options={{
          headerTitle: 'Conta',
          headerTintColor: theme.COLORS.WHITE3,
          headerStyle: { backgroundColor: theme.COLORS.BLUE1 }
        }}
      />

   

      <Stack.Screen
        name="MinhasSolicitacoes"
        component={MinhasSolicitacoes}
        options={{
          headerTitle: 'Minhas Solicitações',
          headerTintColor: theme.COLORS.WHITE3,
          headerStyle: { backgroundColor: theme.COLORS.BLUE1 }
        }}
      />

      <Stack.Screen
        name="SolicitacaoDetalheUser"
        component={SolicitacaoDetalheUser}
        options={{
          headerTitle: 'Detalhes da Solicitação',
          headerTintColor: theme.COLORS.WHITE3,
          headerStyle: { backgroundColor: theme.COLORS.BLUE1 }
        }}
      />

    </Stack.Navigator>
  );
}
