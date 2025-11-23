import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
    id,
    id_avaliacao,
    motivo,
    status,
    data_criacao,
    avaliacoes:avaliacoes (
      id,
      titulo,
      comentario,
      nota,
      eh_anonimo,
      data_criacao
    )
  `)
  .order("data_criacao", { ascending: false });
    setPedidos(data || []);
    setLoading(false);
  }

  useEffect(() => {
    carregar();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{
        backgroundColor: "#fff",
        padding: 15,
        marginVertical: 8,
        borderRadius: 10,
        elevation: 2,
      }}
      onPress={() => navigation.navigate("AdminDetalhesPedido", { pedido: item })}
    >
      <Text style={{ fontWeight: "bold", fontSize: 16 }}>
        Avaliação #{item.id_avaliacao}
      </Text>
      <Text>Status: {item.status}</Text>
      <Text>{new Date(item.data_criacao).toLocaleString("pt-BR")}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 15 }}>
        Pedidos de Exclusão
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={theme.COLORS.BLUE1} />
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
}
