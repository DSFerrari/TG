import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { supabase } from "../../services/supabase";
import theme from "../../theme";

export default function EstabsAdmin() {
  const [estabs, setEstabs] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchEstabs() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("estabelecimentos")
        .select("*")
        .eq("status", "pendente")
        .order("id", { ascending: false });
      if (error) throw error;
      setEstabs(data);
    } catch (err) {
      Alert.alert("Erro", err.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, novoStatus) {
 if (novoStatus === "rejeitado") {
  const { error } = await supabase
    .from("estabelecimentos")
    .delete()
    .eq("id", id);

  if (error) throw error;
  Alert.alert("Removido", "Estabelecimento rejeitado e excluído da base.");
} else {
  const { error } = await supabase
    .from("estabelecimentos")
    .update({ status: novoStatus })
    .eq("id", id);

  if (error) throw error;
  Alert.alert("Sucesso", "Estabelecimento aprovado!");
}

fetchEstabs();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.COLORS.BLUE1} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.COLORS.WHITE1 }}>
      <FlatList
        data={estabs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              margin: 10,
              padding: 15,
              backgroundColor: "#fff",
              borderRadius: 10,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
          >
            <Text style={{ fontWeight: "600", color: theme.COLORS.BLUE1 }}>{item.nome}</Text>
            <Text>{item.endereco}</Text>
            <View style={{ flexDirection: "row", marginTop: 10, gap: 10 }}>
              <TouchableOpacity
                onPress={() => updateStatus(item.id, "aprovado")}
                style={{
                  backgroundColor: "#28a745",
                  padding: 8,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "#fff" }}>Aprovar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => updateStatus(item.id, "rejeitado")}
                style={{
                  backgroundColor: "#dc3545",
                  padding: 8,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "#fff" }}>Rejeitar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
}