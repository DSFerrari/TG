import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  Modal, 
  StyleSheet,
  Dimensions,
  Linking
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

import ButtonMAI from '../../../components/ButtonMAI'; 
import theme from '../../../theme'; 
import { AppContext } from '../../../contexts/app'; 

const { height } = Dimensions.get('window');

export default function DetalhesModal({ visible, onClose, estabelecimento }) {
  const navigation = useNavigation();
  const { favoriteIds, toggleFavorite, deleteEstablishment } = useContext(AppContext);

  if (!estabelecimento) return null;

  const isFavorite = favoriteIds.has(estabelecimento.id);

  const handleExcluir = () => {
    Alert.alert(
      "Excluir Estabelecimento",
      `Tem certeza que deseja apagar "${estabelecimento.nome}" permanentemente?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive",
          onPress: async () => {
            const sucesso = await deleteEstablishment(estabelecimento);
            if (sucesso) {
              onClose();
            }
          }
        }
      ]
    );
  };

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
      stars.push(<MaterialIcons key={`full_${i}`} name="star" size={24} color={theme.COLORS.YELLOW1} />);
    }
    if (hasHalf) {
      stars.push(<MaterialIcons key="half" name="star-half" size={24} color={theme.COLORS.YELLOW1} />);
    }
    return <View style={styles.ratingContainer}>{stars}</View>;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          
          <View style={styles.modalHeader}>
            <View style={styles.dragIndicator} />
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close-circle" size={30} color="#ccc" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Image 
              source={{ uri: estabelecimento.url_foto || "https://placehold.co/600x400/png?text=Sem+Foto" }} 
              style={styles.image} 
            />

            <View style={styles.contentPadding}>
              <View style={styles.headerRow}>
                 <Text style={styles.title}>{estabelecimento.nome}</Text>
                 {renderStars(estabelecimento.avaliacao_media)}
              </View>

              <Text style={styles.category}>{estabelecimento.categoria || 'Sem categoria'}</Text>

              {estabelecimento.status && (
                <View style={styles.statusContainer}>
                   <Text style={styles.statusLabel}>Status: </Text>
                   <Text style={{ fontWeight: 'bold', color: estabelecimento.status === 'aprovado' ? 'green' : 'orange' }}>
                      {estabelecimento.status.toUpperCase()}
                   </Text>
                </View>
              )}

              {estabelecimento.acessibilidades && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Acessibilidade:</Text>
                  {estabelecimento.acessibilidades.split(',').map((item, index) =>
                    item.trim() ? <Text key={index} style={styles.itemText}>• {item.trim()}</Text> : null
                  )}
                </View>
              )}

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Endereço:</Text>
                <Text style={styles.itemText}>{estabelecimento.endereco}</Text>
                
                {estabelecimento.localizacao || (estabelecimento.latitude && estabelecimento.longitude) ? ( 
                   <View style={styles.mapContainer}>
                       <MapView
                          style={styles.map}
                          scrollEnabled={false}
                          initialRegion={{
                            latitude: estabelecimento.latitude || -23.55, 
                            longitude: estabelecimento.longitude || -46.63,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005,
                          }}
                        >
                          <Marker
                            coordinate={{
                              latitude: estabelecimento.latitude || -23.55,
                              longitude: estabelecimento.longitude || -46.63,
                            }}
                          />
                       </MapView>

                       <TouchableOpacity style={styles.mapOverlay} onPress={abrirNoMapa} />
                   </View>
                ) : (
                  <ButtonMAI name="Ver no Google Maps" onPress={abrirNoMapa} icon="map-outline" limpo />
                )}
              </View>

              <View style={styles.actionsContainer}>
                  <ButtonMAI
                    name={isFavorite ? 'Remover Favorito' : 'Favoritar'}
                    icon={isFavorite ? 'heart' : 'heart-outline'}
                    onPress={() => toggleFavorite(estabelecimento.id)}
                  />

                  <ButtonMAI
                    name="Ver Avaliações"
                    onPress={() => {
                        onClose(); 
                        navigation.navigate('Avaliacoes', { estabelecimentoId: estabelecimento.id });
                    }}
                  />

                  <ButtonMAI
                    name="Editar"
                    icon="pencil-outline"
                    onPress={() => {
                        onClose();
                        navigation.navigate("EditarSolicitacao", { estabelecimento });
                    }}
                  />
                  
                  <ButtonMAI
                    name="Excluir"
                    icon="trash-outline"
                    color="#FF4444" 
                    onPress={handleExcluir}
                    style={{ marginTop: 10, backgroundColor: '#FFE5E5' }}
                    textStyle={{ color: '#FF4444' }}
                  />
              </View>
            </View>
          </ScrollView>
          
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    height: height * 0.85, 
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    position: 'relative',
    backgroundColor: '#fff',
    zIndex: 1,
  },
  dragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 10,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  contentPadding: {
    padding: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    fontStyle: 'italic',
  },
  statusContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  statusLabel: {
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  itemText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  mapContainer: {
    height: 150,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject, 
  },
  actionsContainer: {
    gap: 10,
    marginTop: 10,
  },
});