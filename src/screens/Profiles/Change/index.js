import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../../contexts/auth';
import theme from '../../../theme';
import {styles} from './styles'

export default function ProfileOptions({ navigation }) {
  const { user } = useContext(AuthContext);

  const editOptions = [
    {
      id: 'personal_info',
      title: 'Informações Pessoais',
      subtitle: 'Nome, data de nascimento, deficiência',
      icon: 'person-outline',
      iconColor: theme.COLORS.BLUE3,
      route: 'informacoes',
      currentValue: user?.user_metadata?.full_name || 'Não informado'
    },
    {
      id: 'avatar',
      title: 'Foto de Perfil',
      subtitle: 'Alterar ou remover foto',
      icon: 'camera-outline',
      iconColor: theme.COLORS.GREEN2,
      route: 'photo',
      currentValue: user?.user_metadata?.avatar_url ? 'Foto atual' : 'Sem foto'
    },
    {
      id: 'password',
      title: 'Alterar Senha',
      subtitle: 'Criar nova senha de acesso',
      icon: 'lock-closed-outline',
      iconColor: theme.COLORS.RED2,
      route: 'alterarSenha',
      currentValue: '••••••••'
    },
    {
      id: 'account',
      title: 'Configurações da Conta',
      subtitle: 'Gerenciar sua conta',
      icon: 'settings-outline',
      iconColor: theme.COLORS.YELLOW1,
      route: 'avancadas',
      currentValue: 'Configurações avançadas'
    }
  ];

  const handleOptionPress = (route) => {
    navigation.navigate(route);
  };

  const renderOption = (option) => (
    <TouchableOpacity
      key={option.id}
      style={styles.optionCard}
      onPress={() => handleOptionPress(option.route)}
      activeOpacity={0.7}
    >
      <View style={styles.optionContent}>
        <View style={[styles.iconContainer, { backgroundColor: option.iconColor + '20' }]}>
          <Ionicons 
            name={option.icon} 
            size={24} 
            color={option.iconColor} 
          />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.optionTitle}>{option.title}</Text>
          <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
          <Text style={styles.currentValue}>{option.currentValue}</Text>
        </View>
        
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color= {theme.COLORS.BLACK3}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.userInfo}>
          <Text style={styles.userEmail}>{user.user_metadata?.full_name}</Text>
          <Text style={styles.subtitle}>O que você gostaria de alterar?</Text>
        </View>

        <View style={styles.optionsContainer}>
          {editOptions.map(renderOption)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}