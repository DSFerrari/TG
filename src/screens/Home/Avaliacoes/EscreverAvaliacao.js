import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Switch, ScrollView,TouchableWithoutFeedback,Keyboard, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import ButtonMAI from '../../../components/ButtonMAI';
import theme from '../../../theme';
import { styles } from './styles';
import { AppContext } from '../../../contexts/app';
import { useRoute, useNavigation } from '@react-navigation/native';
import TextInputMAI from '../../../components/TextInputMAI';

export default function EscreverAvaliacao() {
  const { createAvaliacao } = useContext(AppContext);
  const route = useRoute();
  const navigation = useNavigation();
  const { estabelecimentoId } = route.params;

  const [nota, setNota] = useState('');
  const [titulo, setTitulo] = useState('');
  const [comentario, setComentario] = useState('');
  const [ehAnonimo, setEhAnonimo] = useState(true);

 const publicar = async () => {
  const valorNota = parseInt(nota);

  if (isNaN(valorNota)) {
    alert("Digite uma nota válida entre 0 e 5.");
    return;
  }

  if (valorNota < 0 || valorNota > 5) {
    alert("A nota deve ser de 0 a 5.");
    return;
  }
try{
  const ok = await createAvaliacao({
    id_estabelecimento: estabelecimentoId,
    nota: valorNota,
    titulo,
    comentario,
    eh_anonimo: ehAnonimo,
  });

  if (ok) navigation.goBack();
}catch(error){
  Alert.alert("Erro","Não foi possível publicar a avaliação. Tente novamente mais tarde.");
};
 }
  return (
    <SafeAreaView style={styles.safe}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View>
          <TextInputMAI
            value={nota}
            onChangeText={setNota}
            texto="Nota"
            keyboardType="numeric"
          />
          <Text style={{marginTop:5}}> De 0 a 5 </Text>
        </View>
        <TextInputMAI
        texto="Titulo da avaliação"
        value={titulo}
        onChangeText={setTitulo}
        />

        <TextInputMAI
        texto="Conte sua expêriencia"
        value={comentario}
        onChangeText={setComentario}
        style={{height:120,TextalignVertical: 'top',paddingTop:15}}
        multiline
        numberOfLines={5}
        />

        <View style={styles.switchRow}>
          <Switch
            value={ehAnonimo}
            onValueChange={setEhAnonimo}
            thumbColor={ehAnonimo ? theme.COLORS.BLUE1 : theme.COLORS.GRAY2}
          />
          <Text style={styles.switchLabel}>Anônimo</Text>
        </View>

        <ButtonMAI name="Publicar avaliação" onPress={publicar} />
      </ScrollView>
    </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
