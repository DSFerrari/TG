import React, { useContext, useLayoutEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import ButtonMAI from '../../../components/ButtonMAI';
import theme from '../../../theme';
import { styles } from './styles';
import { AppContext } from '../../../contexts/app';

export default function Detalhes() {
  const route = useRoute();
  const navigation = useNavigation();
  const { estabelecimento } = route.params;
  const { favoriteIds, toggleFavorite } = useContext(AppContext);

  const isFavorite = favoriteIds.has(estabelecimento.id);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: estabelecimento.nome,
    });
  }, [navigation, estabelecimento.nome]);

  const abrirNoMapa = () => {
    const query = encodeURIComponent(estabelecimento.endereco);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    Linking.openURL(url);
  };

  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <MaterialIcons
          key={i}
          name={i <= roundedRating ? 'star' : 'star-border'}
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
              onPress={() => console.log('Implementar navegação para Editar')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
