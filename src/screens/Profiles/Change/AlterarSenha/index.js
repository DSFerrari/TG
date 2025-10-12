import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../../../contexts/auth';
import theme from '../../../../theme';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from './styles';
import TextInputMAI from '../../../../components/TextInputMAI';
import ButtonMAI from '../../../../components/ButtonMAI';

export default function AlterarSenha({ navigation }) {
  const { updateUserPassword, loadingAuth } = useContext(AuthContext);
  
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleSave = async () => {
    if (!novaSenha || !confirmarSenha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (novaSenha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    const success = await updateUserPassword(novaSenha);
    
    if (success) {
      Alert.alert('Sucesso', 'Senha alterada com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.info}>
          <Ionicons name="information-circle-outline" size={24} color={theme.COLORS.BLUE3} />
          <Text style={styles.infoText}>
            Sua nova senha deve ter pelo menos 6 caracteres
          </Text>
        </View>

        <TextInputMAI
        texto="Nova Senha"
        value={novaSenha}
        onChangeText={setNovaSenha}
        password={true}
        />
        
        <TextInputMAI
        texto="Confirmar Nova Senha"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        password={true}
        />

        <ButtonMAI
        name="Alterar Senha"
        onPress={handleSave}
        />

      </ScrollView>
    </SafeAreaView>
  );
}