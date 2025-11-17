import { View, Text, Image, TouchableOpacity, AccessibilityInfo } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import theme from '../../theme';

export default function CardMAI({
  nome,
  distancia,
  categoria,
  imagem,
  avaliacao = 0,
  onPress,
  isFavorite,
  onToggleFavorite
}) {
  
  const altDistancia = distancia && distancia !== "—"
    ? `a ${distancia} de você`
    : `distância não informada`;

  const altAvaliacao =
    avaliacao > 0
      ? `avaliação ${avaliacao} de 5`
      : `sem avaliações`;

  const cardA11y = `${nome}, categoria ${categoria}, ${altAvaliacao}, ${altDistancia}. Toque para ver detalhes.`

  function handleFavoriteToggle() {
    onToggleFavorite?.();
    AccessibilityInfo.announceForAccessibility(
      isFavorite 
        ? `${nome} removido dos favoritos.` 
        : `${nome} adicionado aos favoritos.`
    );
  }

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={cardA11y}
      focusable={true}
    >
      <View style={styles.imageContainer}>
        <Image
          source={imagem}
          style={styles.image}
          resizeMode="cover"
          accessibilityLabel={`Foto de ${nome}`}
        />

        <TouchableOpacity
          style={styles.heartIcon}
          onPress={handleFavoriteToggle}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={
            isFavorite
              ? `Remover ${nome} dos favoritos`
              : `Adicionar ${nome} aos favoritos`
          }
          accessibilityHint="Toque para alternar favorito"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? theme.COLORS.RED3 : theme.COLORS.BLACK1}
            accessibilityElementsHidden={true}
            importantForAccessibility="no"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text
          style={styles.nome}
          accessibilityElementsHidden={true}
          importantForAccessibility="no"
        >
          {nome}
        </Text>

        <Text
          style={styles.distancia}
          accessibilityElementsHidden={true}
          importantForAccessibility="no"
        >
          {distancia}
        </Text>

        <Text
          style={styles.categoria}
          accessibilityElementsHidden={true}
          importantForAccessibility="no"
        >
          {categoria}
        </Text>

        <View
          style={styles.starsContainer}
          accessibilityLabel={altAvaliacao}
        >
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
                accessibilityElementsHidden={true}
                importantForAccessibility="no"
              />
            );
          })}
        </View>
      </View>
    </TouchableOpacity>
  );
}
