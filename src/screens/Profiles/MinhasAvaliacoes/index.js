import React, { useEffect, useState, useContext } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  Alert, 
  TouchableOpacity, 
  RefreshControl 
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from "../../../contexts/app";
import { supabase } from "../../../services/supabase";
import theme from "../../../theme";


export default function MinhasAvaliacoes() {
  const { user, deleteAvaliacao } = useContext(AppContext); 
  
  const [loading, setLoading] = useState(true);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAvaliacoes = async () => {
    try {
      const { data, error } = await supabase
        .from('avaliacoes')
        .select(`
          *,
          estabelecimentos (
            nome
          )
        `)
        .eq('id_usuario', user.id)
        .order('data_criacao', { ascending: false });

      if (error) throw error;
      setAvaliacoes(data || []);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar suas avaliações.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAvaliacoes();
  }, []);

  const handleDelete = (id) => {
    Alert.alert(
      "Excluir Avaliação",
      "Tem certeza que deseja apagar esta avaliação?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive",
          onPress: async () => {
            const sucesso = await deleteAvaliacao(id);

            if (sucesso) {
              setAvaliacoes((prev) => prev.filter((item) => item.id !== id));
              Alert.alert("Sucesso", "Avaliação removida.");
            }
          }
        }
      ]
    );
  };
const renderStars = (nota) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons 
          key={i} 
          name={i <= nota ? "star" : "star-outline"} 
          size={16} 
          color={theme.COLORS.YELLOW1}
        />
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{flex: 1}}>
            <Text style={styles.estabName}>
              {item.estabelecimentos?.nome || "Estabelecimento Desconhecido"}
            </Text>
            <Text style={styles.date}>
              {new Date(item.data_criacao).toLocaleDateString('pt-BR')}
            </Text>
        </View>
        
        <TouchableOpacity 
          onPress={() => handleDelete(item.id)}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={24} color={theme.COLORS.RED2} /> 
        </TouchableOpacity>
      </View>

      {renderStars(item.nota)}

      {item.titulo && <Text style={styles.reviewTitle}>{item.titulo}</Text>}
      {item.comentario && <Text style={styles.reviewText}>{item.comentario}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenTitle}>Minhas Avaliações</Text>

      {loading ? (
        <ActivityIndicator size="large" color={theme.COLORS.BLUE1} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={avaliacoes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Você ainda não fez nenhuma avaliação.</Text>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => {
              setRefreshing(true);
              fetchAvaliacoes();
            }} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.WHITE2,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    margin: 20,
    color: theme.COLORS.BLACK1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: theme.COLORS.WHITE3,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,

    shadowColor: theme.COLORS.BLACK1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,

    borderWidth: 1,
    borderColor: theme.COLORS.WHITE1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  estabName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.COLORS.BLACK1,
  },
  date: {
    fontSize: 12,
    color: theme.COLORS.BLACK3,
    marginTop: 2,
  },
  deleteButton: {
    padding: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.COLORS.BLACK1,
    marginBottom: 4,
  },
  reviewText: {
    fontSize: 14,
    color: theme.COLORS.BLACK2,
    lineHeight: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.COLORS.BLACK3,
    
    marginTop: 40,
    fontSize: 16,
  }
});