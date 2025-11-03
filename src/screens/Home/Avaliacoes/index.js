import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import ButtonMAI from '../../../components/ButtonMAI';
import theme from '../../../theme';
import { styles } from './styles';
import { AppContext } from '../../../contexts/app';

export default function Avaliacoes() {
  const navigation = useNavigation();
  const route = useRoute();
  const { estabelecimentoId } = route.params;
  const { getAvaliacoesByEstabelecimento } = useContext(AppContext);

  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      const data = await getAvaliacoesByEstabelecimento(estabelecimentoId);
      setAvaliacoes(data);
      setLoading(false);
    }
    carregar();
  }, [estabelecimentoId]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <MaterialIcons
          key={i}
          name={i <= rating ? 'star' : 'star-border'}
          size={24}
          color={theme.COLORS.YELLOW1}
        />
      );
    }
    return <View style={{ flexDirection: 'row', marginTop: 4 }}>{stars}</View>;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.COLORS.BLUE1} />
        ) : avaliacoes.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma avaliação ainda.</Text>
        ) : (
          avaliacoes.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.nome}>
                {item.eh_anonimo ? 'Anônimo' : item.id_usuario?.email || 'Usuário'}{' '}
                {item.deficiencia ? `- ${item.deficiencia}` : ''}
              </Text>

              {renderStars(item.nota)}

              <Text style={styles.titulo}>{item.titulo}</Text>
              <Text style={styles.data}>
                {new Date(item.data_criacao).toLocaleDateString('pt-BR')}
              </Text>
              <Text style={styles.texto}>{item.comentario}</Text>
            </View>
          ))
        )}

        <View style={{ marginBottom: 100 }}>
          <ButtonMAI
            name="+ Escrever avaliação"
            onPress={() =>
              navigation.navigate('EscreverAvaliacao', { estabelecimentoId })
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}