import React, { useEffect, useState, useContext } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  Alert, 
  TouchableOpacity, 
  Image,
  RefreshControl 
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 

import { AppContext } from "../../../contexts/app";

import theme from "../../../theme"

export default function MeusEstabelecimentos() {
  const { 
    user, 
    getMyEstablishments, 
    deleteEstablishment 
  } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    const data = await getMyEstablishments();
    setEstabelecimentos(data || []);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (item) => {
    Alert.alert(
      "Excluir Estabelecimento",
      `Tem certeza que deseja apagar "${item.nome}" permanentemente?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive",
          onPress: async () => {
            const success = await deleteEstablishment(item);
            
            if(success) {
              setEstabelecimentos(prev => prev.filter(e => e.id !== item.id));
              Alert.alert("Sucesso", "Estabelecimento excluído.");
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch(status) {
        case 'aprovado': return '#4CAF50';
        case 'pendente': return '#FF9800';
        case 'rejeitado': return '#F44336';
        default: return '#999';
    }
  };

  const handlePressItem = (item) => {
    setSelectedEstab(item);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image 
        source={{ 
            uri: item.url_foto || "https://placehold.co/600x400/png?text=Sem+Foto" 
        }} 
        style={styles.cardImage} 
      />

      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
            <Text style={styles.estabName} numberOfLines={1}>{item.nome}</Text>
            
            <TouchableOpacity onPress={() => handleDelete(item)} style={{ padding: 5 }}>
                <Ionicons name="trash-outline" size={22} color="#FF4444" />
            </TouchableOpacity>
        </View>

        <Text style={styles.address} numberOfLines={1}>
            {item.endereco || "Endereço não informado"}
        </Text>

        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>
                {item.status ? item.status.toUpperCase() : "DESCONHECIDO"}
            </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenTitle}>Meus Locais</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={estabelecimentos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Você ainda não cadastrou nenhum local.</Text>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => {
              setRefreshing(true);
              fetchData();
            }} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.COLORS.WHITE3 },
  screenTitle: { fontSize: 22, fontWeight: 'bold', margin: 20, color: '#333' },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  card: {
    backgroundColor: theme.COLORS.WHITE1,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    height: 110,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: { width: 110, height: '100%', resizeMode: 'cover' },
  cardContent: { flex: 1, padding: 12, justifyContent: 'space-between' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  estabName: { fontSize: 16, fontWeight: 'bold', color: '#222', flex: 1, marginRight: 8 },
  address: { fontSize: 12, color: '#666' },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginTop: 6 },
  statusText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 16 }
});