import { useEffect, useState, useCallback, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { supabase } from "../../../services/supabase";
import theme from "../../../theme";
import { AppContext } from "../../../contexts/app";

export default function EstabsAdmin() {
  const navegar = useNavigation();
  const { deleteEstablishment } = useContext(AppContext);

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

  useEffect(() => {
    fetchEstabs();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchEstabs();
    }, [])
  );

  async function aprovarEstabelecimento(id) {
    const { error } = await supabase
      .from("estabelecimentos")
      .update({ status: "aprovado" })
      .eq("id", id);

    if (error) {
      Alert.alert("Erro", error.message);
      return;
    }

    Alert.alert("Aprovado!", "Estabelecimento liberado para o app.");
    setEstabs(prev => prev.filter(e => e.id !== id));
  }

  async function rejeitarEstabelecimento(estab) {
    Alert.alert(
      "Rejeitar Estabelecimento",
      "Tem certeza que deseja rejeitar e remover este estabelecimento?\n\nIsso apagará:\n• o registro\n• a foto\n• os favoritos.\n\nEssa ação é permanente.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          style: "destructive",
          onPress: async () => {
            const ok = await deleteEstablishment(estab);
            if (ok) {
              setEstabs(prev => prev.filter(e => e.id !== estab.id));
            }
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.COLORS.WHITE2 }}>
        <ActivityIndicator size="large" color={theme.COLORS.BLUE1} />
        <Text style={{ marginTop: 10, color: theme.COLORS.BLACK3 }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.COLORS.WHITE2 }}>
      <FlatList
        data={estabs}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponent={
          <Text
            style={{
              marginTop: 20,
              marginBottom: 10,
              textAlign: "center",
              fontSize: 18,
              fontWeight: "bold",
              color: theme.COLORS.BLUE1,
            }}
          >
            Estabelecimentos Pendentes
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navegar.navigate("DetalhesEstabAdmin", { estab: item })}
          >
            <View
              style={{
                marginHorizontal: 15,
                marginVertical: 8,
                padding: 15,
                backgroundColor: theme.COLORS.WHITE3,
                borderRadius: 10,
                shadowColor: theme.COLORS.BLACK1,
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
                borderWidth: 1,
                borderColor: theme.COLORS.WHITE1,
              }}
            >
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 16,
                  color: theme.COLORS.BLUE1,
                }}
              >
                {item.nome}
              </Text>

              <Text style={{ marginTop: 4, color: theme.COLORS.BLACK3 }}> 
                {item.endereco || "Endereço não informado"}
              </Text>

              <View style={{ flexDirection: "row", marginTop: 15, gap: 10 }}>
                <TouchableOpacity
                  onPress={() => aprovarEstabelecimento(item.id)}
                  style={{
                    backgroundColor: theme.COLORS.GREEN1,
                    padding: 10,
                    borderRadius: 8,
                    flex: 1,
                    elevation: 1,
                  }}
                >
                  <Text style={{ textAlign: "center", color: theme.COLORS.WHITE3, fontWeight: "bold" }}>
                    Aprovar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => rejeitarEstabelecimento(item)}
                  style={{
                    backgroundColor: theme.COLORS.RED2,
                    padding: 10,
                    borderRadius: 8,
                    flex: 1,
                    elevation: 1,
                  }}
                >
                  <Text style={{ textAlign: "center", color: theme.COLORS.WHITE3, fontWeight: "bold" }}>
                    Rejeitar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <Text style={{ textAlign: "center", marginTop: 30, color: theme.COLORS.BLACK3 }}>
            Nenhum estabelecimento pendente.
          </Text>
        )}
      />
    </View>
  );
}