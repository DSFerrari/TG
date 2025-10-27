import {TouchableWithoutFeedback,KeyboardAvoidingView,ScrollView,Keyboard,Platform,Text, View,ActivityIndicator } from 'react-native';
import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextInputMAI from '../../../components/TextInputMAI';
import ButtonMAI from '../../../components/ButtonMAI';
import { useState,useContext } from 'react';
import CheckboxAcessibilidade from '../../../components/CheckboxAcessibilidade';
import FotoEstabelecimento from '../../../components/FotoEstabelecimento/FotoEstabelecimento';
import CategoriaMAI from '../../../components/CategoriaMAI';
import * as Location from 'expo-location';
import { AppContext } from '../../../contexts/app';
import { categoryItems } from './categoryItems';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function CadastrarEstabelecimento() {
const [acessibilidade,setAcessibilidade] = useState([]);
const [image, setImage] = useState(null);
const [categoria, setCategoria] = useState(null);
const { createEstablishment, uploadEstablishmentImage, loadingAuth } =useContext(AppContext);
const navigation = useNavigation();
const [endereco, setEndereco] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [estabelecimento, setEstabelecimento] = useState('');
  const handleGetLocation = async () => {
    setLoadingLocation(true);

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos da permissão de localização para preencher o endereço.');
        setLoadingLocation(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      let addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });
      
      if (addressResponse && addressResponse.length > 0) {
        const addressObj = addressResponse[0];
        
        const formattedAddress = `${addressObj.street || addressObj.name}, ${addressObj.streetNumber || ''} - ${addressObj.district || ''}, ${addressObj.city || ''} - ${addressObj.region || ''}, CEP: ${addressObj.postalCode || ''}`;
        
        setEndereco(formattedAddress);
      }

    } catch (error) {
      Alert.alert('Erro ao buscar localização', error.message);
    } finally {
      setLoadingLocation(false);
    }
  };

    const handleSave = async () => {

    if (!estabelecimento || !endereco || !categoria || !image) {
      Alert.alert(
        'Campos Incompletos',
        'Por favor, preencha o nome, endereço, categoria e selecione uma foto.'
      );
      return;
    }

    try {
      const establishmentData = {
        nome: estabelecimento,
        endereco: endereco,
        categoria: categoria,
        acessibilidades: acessibilidade.join(','),
      };


      const newEstablishment = await createEstablishment(establishmentData,navigation);

      if (newEstablishment && newEstablishment.id) {
        const publicUrl = await uploadEstablishmentImage(
          image,
          newEstablishment.id
        );

        if (publicUrl) {
          setEstabelecimento('');
          setEndereco('');
          setCategoria(null);
          setImage(null);
          setAcessibilidade([]);
        } else {
          Alert.alert(
            'Atenção',
            'O estabelecimento foi criado, mas o upload da foto falhou.'
          );
        }
      }
    
    } catch (err) {
      Alert.alert('Erro Inesperado', `Ocorreu um erro: ${err.message}`);
    }
  };

    return (
   <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          >
          <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding': 'height'}
          >
              <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
                     showsVerticalScrollIndicator={false}
                     keyboardShouldPersistTaps="handled"
                     >
           <SafeAreaView>
            <FotoEstabelecimento
              image={image}
              setImage={setImage}
            />
            <TextInputMAI
            texto="Nome do Estabelecimento"
            value={estabelecimento}
            onChangeText={setEstabelecimento}
            />

      <CategoriaMAI
        value={categoria}
        onValueChange={setCategoria}
        items={categoryItems}
      />
             <TextInputMAI
            texto="Endereço"
            value={endereco}
            onChangeText={setEndereco}
            />
            <View style={{marginTop: -20, marginBottom: 10}}>
            <ButtonMAI
            name="Usar localização atual"
            onPress={handleGetLocation}
            />
            </View>
            <CheckboxAcessibilidade
                selectedAcessibilidade={acessibilidade}
                onSelectionChange={setAcessibilidade}
            />

            <ButtonMAI
            name="Cadastrar"
            limpo={true}
            onPress={handleSave}
          />
            
            </SafeAreaView>
              </ScrollView>
              </KeyboardAvoidingView>
             </TouchableWithoutFeedback>
  );
}
