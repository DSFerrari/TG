import React, { useContext, useState, useCallback } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation,useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import ButtonMAI from '../../../components/ButtonMAI';
import theme from '../../../theme';
import { styles } from './styles';
import { AppContext } from '../../../contexts/app';
import { Modal } from "react-native";
import TextInputMAI from "../../../components/TextInputMAI";



export default function Detalhes() {
  const route = useRoute();
  const navigation = useNavigation();
  const { estabelecimento } = route.params;
  const { favoriteIds, toggleFavorite,deleteEstablishment, solicitarExclusao  } = useContext(AppContext);

const [modalExclusaoVisible, setModalExclusaoVisible] = useState(false);
const [justificativaExclusao, setJustificativaExclusao] = useState("");


  const isFavorite = favoriteIds.has(estabelecimento.id);

 useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        title: estabelecimento.nome,
      });
    }, [navigation, estabelecimento.nome])
  );


    async function enviarSolicitacaoExclusao() {
  if (!justificativaExclusao.trim()) {
    Alert.alert("Justifique!", "Por favor, explique o motivo da exclusão.");
    return;
  }

  const ok = await solicitarExclusao(estabelecimento.id, justificativaExclusao, estabelecimento.nome);

  if (ok) {
    setModalExclusaoVisible(false);
    setJustificativaExclusao("");
  }
}

  
  const abrirNoMapa = () => {
    const query = encodeURIComponent(estabelecimento.endereco);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    Linking.openURL(url);
  };

   const renderStars = (rating) => {
    const stars = [];
    const rounded = Math.round((rating || 0) * 2) / 2;
    const full = Math.floor(rounded);
    const hasHalf = rounded - full === 0.5;

    for (let i = 1; i <= full; i++) {
      stars.push(
        <MaterialIcons
          key={`full_${i}`}
          name="star"
          size={28}
          color={theme.COLORS.YELLOW1}
        />
      );
    }

    if (hasHalf) {
      stars.push(
        <MaterialIcons
          key="half"
          name="star-half"
          size={28}
          color={theme.COLORS.YELLOW1}
        />
      );
    }

    const emptyCount = 5 - full - (hasHalf ? 1 : 0);
    for (let i = 1; i <= emptyCount; i++) {
      stars.push(
        <MaterialIcons
          key={`empty_${i}`}
          name="star-border"
          size={28}
          color={theme.COLORS.YELLOW1}
        />
      );
    }

    return <View style={styles.ratingContainer}>{stars}</View>;
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image source={{ uri: estabelecimento.url_foto }} style={styles.image} />

        <View style={styles.content}>
          {renderStars(estabelecimento.avaliacao_media || 0)}
          <Text style={styles.category}>
            {estabelecimento.categoria || 'Sem categoria'}
          </Text>

          {estabelecimento.acessibilidades && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recursos de acessibilidade</Text>
              {estabelecimento.acessibilidades.split(',').map((item, index) =>
                item.trim() ? (
                  <Text key={index} style={styles.itemText}>
                    • {item.trim()}
                  </Text>
                ) : null
              )}
            </View>
          )}

          {estabelecimento.endereco && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Endereço</Text>
              <Text style={styles.itemText}>{estabelecimento.endereco}</Text>

              {estabelecimento.latitude && estabelecimento.longitude ? (
                <MapView
                  style={{
                    width: '100%',
                    height: 200,
                    marginTop: 10,
                    borderRadius: 10,
                  }}
                  initialRegion={{
                    latitude: estabelecimento.latitude,
                    longitude: estabelecimento.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: estabelecimento.latitude,
                      longitude: estabelecimento.longitude,
                    }}
                    title={estabelecimento.nome}
                    description={estabelecimento.endereco}
                  />
                </MapView>
              ) : (
                <TouchableOpacity onPress={abrirNoMapa}>
                  <Text
                    style={{
                      marginTop: 8,
                      color: theme.COLORS.BLUE1,
                      textDecorationLine: 'underline',
                    }}
                  >
                    Ver no mapa
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <View style={{ marginTop: -20 }}>
            <ButtonMAI
              name={isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
              icon={isFavorite ? 'heart' : 'heart-outline'}
              onPress={() => toggleFavorite(estabelecimento.id)}
            />
          </View>

          <View style={{ marginTop: -20 }}>
            <ButtonMAI
              name="Avaliações"
              onPress={() => navigation.navigate('Avaliacoes', { estabelecimentoId: estabelecimento.id })}
            />
          </View>

          <View style={{ marginTop: -20 }}>
            <ButtonMAI
              name="Editar estabelecimento"
              onPress={() => navigation.navigate("EditarSolicitacao", { estabelecimento })}
            />
            <ButtonMAI
            name="Excluir estabelecimento"
            onPress={() => setModalExclusaoVisible(true)}
            />

          </View>
        </View>
      </ScrollView>
      <Modal
        visible={modalExclusaoVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalExclusaoVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <TouchableWithoutFeedback>
              <View
                style={{
                  width: "100%",
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  padding: 20,
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
                  Solicitar exclusão
                </Text>

                <Text style={{ marginBottom: 14 }}>
                  Explique o motivo pelo qual deseja remover este estabelecimento. A solicitação será analisada por um administrador.
                </Text>

                <TextInputMAI
                  texto="Justificativa"
                  value={justificativaExclusao}
                  onChangeText={setJustificativaExclusao}
                   style={{height:120,textAlignVertical: 'top',paddingTop:15}}
        multiline
        numberOfLines={5}
                />

                <View style={{ flexDirection: "row", marginTop: 20, justifyContent: "space-between" }}>
                  <ButtonMAI
                    name="Cancelar"
                    limpo
                    onPress={() => setModalExclusaoVisible(false)}
                    style={{ flex: 1, marginRight: 10 }}
                  />

                  <ButtonMAI
                    name="Enviar"
                    onPress={enviarSolicitacaoExclusao}
                    style={{ flex: 1, marginLeft: 10 }}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>

  );
}
