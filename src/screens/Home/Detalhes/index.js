import React, { useContext, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  TouchableWithoutFeedback, 
  Keyboard, 
  StyleSheet 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Modal } from "react-native";

import ButtonMAI from '../../../components/ButtonMAI';
import TextInputMAI from "../../../components/TextInputMAI";
import theme from '../../../theme';
import { AppContext } from '../../../contexts/app';
import { AuthContext } from '../../../contexts/auth';

const MAPA_DEFICIENCIA_ACESSIBILIDADE = {
  "Deficiência Física": [
    "Rampas de acesso",
    "Elevador",
    "Portas largas",
    "Banheiro acessível",
    "Balcão rebaixado",
  ],
  "Deficiência Visual": [
    "Piso tátil",
    "Sinalização em Braille",
    "Alarme visual e sonoro",
  ],
  "Deficiência Auditiva": [
    "Intérprete de Libras",
    "Alarme visual e sonoro",
  ],
  "Deficiência Intelectual": [
    "Piso tátil",
    "Sinalização em Braille",
    "Balcão rebaixado",
  ],
};

export default function Detalhes() {
  const route = useRoute();
  const navigation = useNavigation();
  const { estabelecimento } = route.params;
  const { favoriteIds, toggleFavorite, solicitarExclusao } = useContext(AppContext);
  const { user } = useContext(AuthContext);

  const [modalExclusaoVisible, setModalExclusaoVisible] = useState(false);
  const [justificativaExclusao, setJustificativaExclusao] = useState("");

  const metadata = user?.user_metadata || {};
  const userDisabilities = Array.isArray(metadata.disability)
    ? metadata.disability
    : metadata.disability
    ? [metadata.disability]
    : [];

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

    const ok = await solicitarExclusao(
      estabelecimento.id, 
      justificativaExclusao, 
      estabelecimento.nome
    );

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

  const verificarRelevancia = (item) => {
    if (!userDisabilities.length) return false;

    const itemNormalizado = item.trim();

    for (const def of userDisabilities) {
      const lista = MAPA_DEFICIENCIA_ACESSIBILIDADE[def];
      if (lista && lista.includes(itemNormalizado)) {
        return true;
      }
    }

    return false;
  };

  const renderStars = (rating) => {
    const stars = [];
    const rounded = Math.round((rating || 0) * 2) / 2;
    const full = Math.floor(rounded);
    const hasHalf = rounded - full === 0.5;

    for (let i = 1; i <= full; i++) {
      stars.push(
        <MaterialIcons key={`full_${i}`} name="star" size={28} color={theme.COLORS.YELLOW1} />
      );
    }

    if (hasHalf) {
      stars.push(
        <MaterialIcons key="half" name="star-half" size={28} color={theme.COLORS.YELLOW1} />
      );
    }

    const emptyCount = 5 - full - (hasHalf ? 1 : 0);
    for (let i = 1; i <= emptyCount; i++) {
      stars.push(
        <MaterialIcons key={`empty_${i}`} name="star-border" size={28} color={theme.COLORS.YELLOW1} />
      );
    }

    return <View style={styles.ratingContainer}>{stars}</View>;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image 
          source={{ uri: estabelecimento.url_foto || "https://placehold.co/600x400/png?text=Sem+Foto" }} 
          style={styles.image} 
        />

        <View style={styles.content}>
          {renderStars(estabelecimento.avaliacao_media || 0)}
          <Text style={styles.category}>
            {estabelecimento.categoria || 'Sem categoria'}
          </Text>

          {estabelecimento.acessibilidades && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recursos de acessibilidade</Text>
              
              <View style={{ marginTop: 5 }}>
                {estabelecimento.acessibilidades.split(',').map((item, index) => {
                  const texto = item.trim();
                  if (!texto) return null;
                  
                  const isRelevante = verificarRelevancia(texto);
                  
                  return (
                    <View 
                      key={index} 
                      style={{ 
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        marginBottom: 6,
                      }}
                    >
                      {isRelevante ? (
                        <Ionicons 
                          name="checkmark-circle" 
                          size={20} 
                          color={theme.COLORS.GREEN1} 
                          style={{ marginRight: 8 }}
                        />
                      ) : (
                        <View style={{ width: 20, marginRight: 8, alignItems: 'center' }}>
                           <Text style={{ color: theme.COLORS.BLACK3 }}>•</Text>
                        </View>
                      )}
                      
                      <Text
                        style={[
                          styles.itemText, 
                          { 
                            color: isRelevante ? theme.COLORS.GREEN1 : theme.COLORS.BLACK3,
                            fontWeight: isRelevante ? 'bold' : 'normal',
                            flex: 1
                          }
                        ]}
                      >
                        {texto}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {estabelecimento.endereco && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Endereço</Text>
              <Text style={styles.itemText}>{estabelecimento.endereco}</Text>

              {estabelecimento.latitude && estabelecimento.longitude ? (
                <>
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
                  <TouchableOpacity onPress={abrirNoMapa}>
                    <Text style={{ marginTop: 8, color: theme.COLORS.BLUE1, textDecorationLine: 'underline' }}>
                      Ver no mapa
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity onPress={abrirNoMapa}>
                  <Text style={{ marginTop: 8, color: theme.COLORS.BLUE1, textDecorationLine: 'underline' }}>
                    Ver no mapa
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <View style={{ gap: 10, marginTop: 10 }}>
            <ButtonMAI
              name={isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
              icon={isFavorite ? 'heart' : 'heart-outline'}
              onPress={() => toggleFavorite(estabelecimento.id)}
            />

            <ButtonMAI
              name="Avaliações"
              onPress={() => navigation.navigate('Avaliacoes', { estabelecimentoId: estabelecimento.id })}
              limpo={true}
            />

            <ButtonMAI
              name="Editar estabelecimento"
              onPress={() => navigation.navigate("EditarSolicitacao", { estabelecimento })}
              limpo={true}
            />
            
            <ButtonMAI
              name="Excluir estabelecimento"
              onPress={() => setModalExclusaoVisible(true)}
              color={theme.COLORS.RED2}
              style={{ backgroundColor: theme.COLORS.WHITE1 }}
              textStyle={{ color: theme.COLORS.RED2 }}
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
          <View style={{ 
            flex: 1, 
            backgroundColor: "rgba(0,0,0,0.5)", 
            alignItems: "center", 
            justifyContent: "center", 
            padding: 20 
          }}>
            <TouchableWithoutFeedback>
              <View style={{ 
                width: "100%", 
                backgroundColor: theme.COLORS.WHITE3, 
                borderRadius: 12, 
                padding: 20 
              }}>
                <Text style={{ 
                  fontSize: 18, 
                  fontWeight: "bold", 
                  marginBottom: 10, 
                  color: theme.COLORS.BLACK1 
                }}>
                  Solicitar exclusão
                </Text>

                <Text style={{ 
                  marginBottom: 14, 
                  color: theme.COLORS.BLACK3 
                }}>
                  Explique o motivo pelo qual deseja remover este estabelecimento. 
                  A solicitação será analisada por um administrador.
                </Text>

                <TextInputMAI
                  texto="Justificativa"
                  value={justificativaExclusao}
                  onChangeText={setJustificativaExclusao}
                  style={{ 
                    height: 120, 
                    textAlignVertical: 'top', 
                    paddingTop: 15 
                  }}
                  multiline
                  numberOfLines={5}
                />

                <View style={{ 
                  flexDirection: "row", 
                  marginTop: 20, 
                  justifyContent: "space-between" 
                }}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.WHITE3,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: theme.COLORS.WHITE3,
    marginTop: -20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  category: {
    fontSize: 20,
    color: theme.COLORS.BLACK3,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.COLORS.BLACK1,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
    color: theme.COLORS.BLACK2,
    lineHeight: 24,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 5,
  },
});
