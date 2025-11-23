import {
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  View,
  Alert,
  FlatList,
  TouchableOpacity,
  Text
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

import TextInputMAI from '../../../components/TextInputMAI';
import ButtonMAI from '../../../components/ButtonMAI';
import CheckboxAcessibilidade from '../../../components/CheckboxAcessibilidade';
import FotoEstabelecimento from '../../../components/FotoEstabelecimento/FotoEstabelecimento';
import EnderecoAutocomplete from './endereco';

import { AppContext } from '../../../contexts/app';
import { categoryItems } from './categoryItems';
import { logAction } from '../../../services/logs';
import theme from '../../../theme';
import { styles } from './styles';

export default function CadastrarEstabelecimento() {
  const [acessibilidade, setAcessibilidade] = useState([]);
  const [image, setImage] = useState(null);
  const [categoria, setCategoria] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [estabelecimento, setEstabelecimento] = useState('');
  const [coords, setCoords] = useState(null);
  const [endereco, setEndereco] = useState('');

  const { createEstablishment, uploadEstablishmentImage, loadingAuth } = useContext(AppContext);
  const navigation = useNavigation();

  const formItems = [
    { id: "foto" },
    { id: "nome" },
    { id: "categoria" },
    { id: "endereco" },
    { id: "usar_localizacao" },
    { id: "acessibilidade" },
    { id: "botao_salvar" },
  ];

  const handleGetLocation = async () => {
    setLoadingLocation(true);

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Você precisa conceder permissão.');
        setLoadingLocation(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setCoords({ latitude, longitude });

      await logAction('usar_localizacao_atual', {
        latitude,
        longitude
      });

      let addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addressResponse && addressResponse.length > 0) {
        const a = addressResponse[0];
        const formattedAddress = `${a.street || a.name || ''}, ${a.streetNumber || ''} - ${a.district || ''}, ${a.city || ''} - ${a.region || ''}, CEP: ${a.postalCode || ''}`;
        setEndereco(formattedAddress);

        await logAction('endereco_resolvido_por_gps', {
          endereco_resolvido: formattedAddress
        });
      }

    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleSave = async () => {
    if (!estabelecimento || !endereco || !categoria || !image) {
      Alert.alert('Campos Incompletos', 'Preencha todos os obrigatórios.');
      return;
    }

    try {
      await logAction('cadastro_estabelecimento_iniciado', {
        nome: estabelecimento,
        categoria,
        endereco,
        acessibilidades: acessibilidade.join(','),
        coordenadas: coords
      });

      const establishmentData = {
        nome: estabelecimento,
        endereco,
        categoria,
        acessibilidades: acessibilidade.join(','),
        ...(coords && {
          localizacao: `SRID=4326;POINT(${coords.longitude} ${coords.latitude})`,
        }),
      };

      const newEstablishment = await createEstablishment(establishmentData);

      if (newEstablishment?.id) {
        await logAction('estabelecimento_criado', {
          id_estabelecimento: newEstablishment.id,
          nome: estabelecimento
        });

        const url = await uploadEstablishmentImage(image, newEstablishment.id, navigation);

        if (url) {
          await logAction('upload_foto_estabelecimento', {
            id_estabelecimento: newEstablishment.id,
            url_foto: url
          });

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

  const renderItem = ({ item }) => {
    switch (item.id) {

      case "foto":
        return <FotoEstabelecimento image={image} setImage={setImage} />;

      case "nome":
        return (
          <TextInputMAI
            texto="Nome do Estabelecimento"
            value={estabelecimento}
            onChangeText={setEstabelecimento}
          />
        );

      case "categoria":
        return (
          <View style={{ marginTop: 30 }}>
            <Text style={{ color: theme.COLORS.BLACK1, fontSize: 14, left: 12, paddingHorizontal: 5, marginBottom: 10 }}>
              Categoria<Text style={{ color: theme.COLORS.RED1 }}> *</Text>
            </Text>

            <CategoriaChips
              selected={categoria}
              onSelect={async (cat) => {
                setCategoria(cat);
                await logAction('selecionou_categoria', { categoria: cat });
              }}
            />
          </View>
        );

      case "endereco":
        return (
          <View style={{ marginBottom: 15 }}>
            <EnderecoAutocomplete
              endereco={endereco}
              setEndereco={setEndereco}
              setCoords={setCoords}
            />
          </View>
        );

      case "usar_localizacao":
        return (
          <View style={{ marginBottom: 10 }}>
            <ButtonMAI
              name={loadingLocation ? "Buscando localização..." : "Usar localização atual"}
              onPress={handleGetLocation}
              disabled={loadingLocation}
            />
          </View>
        );

      case "acessibilidade":
        return (
          <CheckboxAcessibilidade
            selectedAcessibilidade={acessibilidade}
            onSelectionChange={setAcessibilidade}
          />
        );

      case "botao_salvar":
        return (
          <ButtonMAI
            name={loadingAuth ? "Cadastrando..." : "Cadastrar"}
            limpo={true}
            onPress={handleSave}
            disabled={loadingAuth}
          />
        );

      default:
        return null;
    }
  };

  const CategoriaChips = ({ selected, onSelect }) => {
    return (
      <FlatList
        horizontal
        data={categoryItems}
        keyExtractor={(item, index) => `${item.value}_${index}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 5 }}
        renderItem={({ item }) => {
          const active = selected === item.value;

          return (
            <TouchableOpacity
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onSelect(item.value)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <FlatList
            data={formItems}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 30 }}
            keyboardShouldPersistTaps="handled"
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}