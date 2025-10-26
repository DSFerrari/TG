import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import theme from '../../theme';

export default function CardMAI({nome,distancia,categoria,imagem,avaliacao = 0,onPress,}) {
  const [favorito, setFavorito] = useState(false);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={imagem} style={styles.image} resizeMode="cover" />
        <TouchableOpacity
          style={styles.heartIcon}
          onPress={() => setFavorito(!favorito)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={favorito ? 'heart' : 'heart-outline'}
            size={24}
            color={theme.COLORS.RED3}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.nome}>{nome}</Text>
        <Text style={styles.distancia}>{distancia}</Text>
        <Text style={styles.categoria}>{categoria}</Text>
         <View style={styles.starsContainer}>
  {Array.from({ length: 5 }).map((_, i) => {
    const filled = i + 1 <= Math.floor(avaliacao);
    const half = i + 0.5 === avaliacao;

    let iconName = 'star-outline';
    if (filled) iconName = 'star';
    else if (half) iconName = 'star-half';

    return (
      <Ionicons
        key={i}
        name={iconName}
        size={18}
        color={theme.COLORS.YELLOW2}
        style={{ marginRight: 2 }}
      />
    );
  })}

        </View>
      </View>
    </TouchableOpacity>
  );
}