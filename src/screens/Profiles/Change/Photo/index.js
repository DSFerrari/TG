import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../../../contexts/auth';
import theme from '../../../../theme';
import { styles } from './styles';

export default function Photo({ navigation }) {
  const { user, uploadAvatar, loadingAuth } = useContext(AuthContext);
  const [selectedImage, setSelectedImage] = useState(null);

  const currentAvatar = user?.user_metadata?.avatar_url;

  const handleImagePick = async () => {
       try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissão Necessária',
          'Precisamos de permissão para acessar sua galeria de fotos.',
          [{ text: 'OK' }]
        );
        return;
      }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 1,
      base64: true,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  }catch (error) {
      Alert.alert('Erro', 'Não foi possível acessar a galeria');
    }
};

  const handleTakePhoto = async () => {
     try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissão Necessária',
          'Precisamos de permissão para usar a câmera.',
          [{ text: 'OK' }]
        );
        return;
      }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images',
      quality: 1,
      base64: true,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  } catch (error) {
      Alert.alert('Erro', 'Não foi possível acessar a câmera');
    }
  };

  const handleSaveAvatar = async () => {
    if (!selectedImage) {
      Alert.alert('Erro', 'Selecione uma imagem primeiro');
      return;
    }

    const success = await uploadAvatar(selectedImage);
    if (success) {
      Alert.alert('Sucesso', 'Foto de perfil atualizada!', [
        { text: 'OK', onPress: () => navigation.navigate('Profile',{
          refreshUser: Date.now()
          }) 
        }
      ]);
    }
  };


  const handleCancelSelection = () => {
    setSelectedImage(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: selectedImage?.uri || currentAvatar || 
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }}
            style={styles.avatar}
          />
          {selectedImage && (
            <View style={styles.previewBadge}>
              <Text style={styles.previewText}>Preview</Text>
            </View>
          )}
        </View>

        <View style={styles.info}>
          <Ionicons name="information-circle-outline" size={24} color={theme.COLORS.BLUE3} />
          <Text style={styles.infoText}>
            Escolha uma foto quadrada para melhor resultado
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={styles.optionButton}
            onPress={handleImagePick}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.COLORS.BLUE3 + '20' }]}>
              <Ionicons name="images-outline" size={24} color={theme.COLORS.BLUE3} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.optionTitle}>Escolher da Galeria</Text>
              <Text style={styles.optionSubtitle}>Selecione uma foto existente</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.optionButton}
            onPress={handleTakePhoto}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.COLORS.GREEN2 + '20' }]}>
              <Ionicons name="camera-outline" size={24} color={theme.COLORS.GREEN2} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.optionTitle}>Tirar Foto</Text>
              <Text style={styles.optionSubtitle}>Use a câmera do dispositivo</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
          </TouchableOpacity>
        </View>

        {selectedImage && (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleCancelSelection}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSaveAvatar}
              disabled={loadingAuth}
            >
              <Text style={styles.saveButtonText}>
                {loadingAuth ? 'Salvando...' : 'Salvar Foto'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}