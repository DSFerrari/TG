import React, { useState, useCallback } from "react";
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons"; 
import { supabase } from "../../../services/supabase";
import theme from "../../../theme";

export default function PedidosAvaliacao({ navigation }) {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    setLoading(true);
    
    const { data, error } = await supabase
      .from("pedidos_exclusao_avaliacao")
      .select(`
        id, id_avaliacao, motivo, status, data_criacao,
        estabelecimentos (id, nome),
        avaliacoes (
          id,
          titulo,
          comentario,
          nota,
          eh_anonimo,
          data_criacao,
          id_usuario,
          profiles ( full_name )  
        )
      `)
      .order("data_criacao", { ascending: false });
    if (error) {
    } else {
      setPedidos(data || []);
    }
    setLoading(false);
  }

  useFocusEffect(useCallback(() => { carregar(); }, []));

  const getStatusColor = (status) => {
    switch (status) {
      case 'aprovado': return theme.COLORS.GREEN1;
      case 'rejeitado': return theme.COLORS.RED1;
      default: return theme.COLORS.YELLOW1;
    }
  };

  const renderItem = ({ item }) => {
    const statusColor = getStatusColor(item.status);
    const nomeEstab = item.estabelecimentos?.nome || "Estabelecimento";

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => navigation.navigate("AdminDetalhesPedido", { pedido: item })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="store" size={20} color={theme.COLORS.BLUE1} />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.estabName} numberOfLines={1}>{nomeEstab}</Text>
            <Text style={styles.dateText}>
              {new Date(item.data_criacao).toLocaleDateString("pt-BR")}
            </Text>
          </View>
        </View>

        <Text style={styles.motivoText} numberOfLines={2}>
          <Text style={{ fontWeight: 'bold', color: theme.COLORS.BLACK1 }}>Motivo:</Text> {item.motivo}
        </Text>

        <View style={styles.cardFooter}>
          <View style={[styles.statusBadge, { borderColor: statusColor, borderWidth: 1 }]}> 
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={theme.COLORS.BLACK3} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Moderação</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.COLORS.BLUE1} style={{ marginTop: 50 }} />
      ) : pedidos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="playlist-add-check" size={60} color={theme.COLORS.WHITE1} />
          <Text style={styles.emptyText}>Nenhum pedido pendente.</Text>
        </View>
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.COLORS.WHITE2, paddingHorizontal: 20 },
  header: { marginVertical: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: theme.COLORS.BLACK1 },
  
  card: {
    backgroundColor: theme.COLORS.WHITE3,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.COLORS.WHITE1,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  iconContainer: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: theme.COLORS.WHITE2, 
    justifyContent: "center", alignItems: "center"
  },
  estabName: { fontSize: 16, fontWeight: "bold", color: theme.COLORS.BLACK1 },
  dateText: { fontSize: 12, color: theme.COLORS.BLACK3 },
  motivoText: { fontSize: 14, color: theme.COLORS.BLACK2, marginBottom: 15, lineHeight: 20 },
  
  cardFooter: { 
    flexDirection: "row", justifyContent: "space-between", alignItems: "center", 
    borderTopWidth: 1, borderTopColor: theme.COLORS.WHITE1, paddingTop: 10 
  },
  statusBadge: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
    backgroundColor: theme.COLORS.WHITE3
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 10, fontWeight: "bold" },
  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 50 },
  emptyText: { color: theme.COLORS.BLACK3, marginTop: 10, fontSize: 16 }
});