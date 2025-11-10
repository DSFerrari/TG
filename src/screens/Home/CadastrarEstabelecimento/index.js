import {
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  Platform,
  View,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useContext, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import TextInputMAI from '../../../components/TextInputMAI';
import ButtonMAI from '../../../components/ButtonMAI';
import CheckboxAcessibilidade from '../../../components/CheckboxAcessibilidade';
import FotoEstabelecimento from '../../../components/FotoEstabelecimento/FotoEstabelecimento';
import CategoriaMAI from '../../../components/CategoriaMAI';
import { AppContext } from '../../../contexts/app';
import { categoryItems } from './categoryItems';
import { styles } from './styles';
import EnderecoAutocomplete from './endereco';

export default function CadastrarEstabelecimento() {
  const [acessibilidade, setAcessibilidade] = useState([]);
  const [image, setImage] = useState(null);
  const [categoria, setCategoria] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [estabelecimento, setEstabelecimento] = useState('');
  const [coords, setCoords] = useState(null);
  const { createEstablishment, uploadEstablishmentImage, loadingAuth } =
    useContext(AppContext);
  const navigation = useNavigation();
  const [endereco, setEndereco] = useState('');
  const placesRef = useRef(null);

  const handleGetLocation = async () => {
    setLoadingLocation(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão negada',
          'Precisamos da permissão de localização para preencher o endereço.'
        );
        setLoadingLocation(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setCoords({ latitude, longitude });

      let addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addressResponse && addressResponse.length > 0) {
        const a = addressResponse[0];
        const formattedAddress = `${a.street || a.name || ''}, ${
          a.streetNumber || ''
        } - ${a.district || ''}, ${a.city || ''} - ${a.region || ''}, CEP: ${
          a.postalCode || ''
        }`;
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
        endereco,
        categoria,
        acessibilidades: acessibilidade.join(','),
        ...(coords && {
          localizacao: `SRID=4326;POINT(${coords.longitude} ${coords.latitude})`,
        }),
      };

      const newEstablishment = await createEstablishment(
        establishmentData,
      );

      if (newEstablishment && newEstablishment.id) {
        const publicUrl = await uploadEstablishmentImage(
          image,
          newEstablishment.id,
          navigation
        );

        if (publicUrl) {
          setEstabelecimento('');
          setEndereco('');
          setCategoria(null);
          setImage(null);
          setAcessibilidade([]);
          setCoords(null);
        }
      }
    } catch (err) {
      Alert.alert('Erro', err.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <SafeAreaView>
            <FotoEstabelecimento image={image} setImage={setImage} />

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

            <View style={{ marginBottom: 15 }}>
            <EnderecoAutocomplete
  endereco={endereco}
  setEndereco={setEndereco}
  setCoords={setCoords}
/>
            </View>

            <View style={{ marginTop: -10, marginBottom: 10 }}>
              <ButtonMAI
                name={
                  loadingLocation
                    ? 'Buscando localização...'
                    : 'Usar localização atual'
                }
                onPress={handleGetLocation}
                disabled={loadingLocation}
              />
            </View>

            <CheckboxAcessibilidade
              selectedAcessibilidade={acessibilidade}
              onSelectionChange={setAcessibilidade}
            />

            <ButtonMAI
              name={loadingAuth ? 'Cadastrando...' : 'Cadastrar'}
              limpo={true}
              onPress={handleSave}
              disabled={loadingAuth}
            />
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
