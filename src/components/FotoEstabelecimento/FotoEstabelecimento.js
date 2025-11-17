import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  AccessibilityInfo
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function FotoEstabelecimento({ image, setImage }) {

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da permissão da câmera.');
      AccessibilityInfo.announceForAccessibility("Permissão da câmera negada.");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const img = result.assets[0];
      setImage(img);
      AccessibilityInfo.announceForAccessibility("Foto selecionada com sucesso.");
    }
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da permissão da galeria.');
      AccessibilityInfo.announceForAccessibility("Permissão da galeria negada.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const img = result.assets[0];
      setImage(img);
      AccessibilityInfo.announceForAccessibility("Imagem selecionada da galeria.");
    }
  };

  const showImageOptions = () => {
    AccessibilityInfo.announceForAccessibility("Escolha uma opção de imagem.");
    
    Alert.alert(
      "Selecionar Imagem",
      "Escolha de onde quer pegar a foto:",
      [
        {
          text: "Tirar Foto",
          onPress: takePhoto,
        },
        {
          text: "Escolher da Galeria",
          onPress: pickFromGallery,
        },
        {
          text: "Cancelar",
          style: "cancel",
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={showImageOptions}
      accessibilityRole="button"
      accessibilityLabel={
        image
          ? "Imagem do estabelecimento. Toque para alterar ou remover."
          : "Carregar imagem do estabelecimento"
      }
      accessibilityHint="Abre opções para tirar foto ou escolher imagem da galeria"
      activeOpacity={0.8}
    >
      {image ? (
        <Image
          source={{ uri: image.uri }}
          style={styles.previewImage}
          accessibilityRole="image"
          accessibilityLabel="Imagem selecionada"
        />
      ) : (
        <>
          <Feather name="upload" size={40} color="#666" />
          <Text
            style={styles.text}
            accessibilityLabel="Botão para enviar imagem"
          >
            Carregar imagem
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    marginBottom: 20,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});
