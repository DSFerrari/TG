import React, { useEffect, useState, useContext } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppContext } from "../../../contexts/app";
import theme from "../../../theme";

export default function MinhasSolicitacoes({ navigation }) {
  const { listarSolicitacoesUsuario } = useContext(AppContext);

  const [solicitacoes, setSolicitacoes] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const data = await listarSolicitacoesUsuario();
    setSolicitacoes(data);
  }

  function abrirDetalhes(item) {
    navigation.navigate("SolicitacaoDetalheUser", { solicitacao: item });
  }

  function tagStatus(status) {
    const cores = {
      pendente: theme.COLORS.YELLOW1,
      aprovado: theme.COLORS.GREEN1,
      rejeitado: theme.COLORS.RED1
    };
    return (
      <Text style={{ color: cores[status], fontWeight: "bold" }}>
        {status.toUpperCase()}
      </Text>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ padding: 20 }}>

        {solicitacoes.map((s) => (
          <TouchableOpacity
            key={s.id}
            onPress={() => abrirDetalhes(s)}
            style={{
              padding: 15,
              marginBottom: 12,
              borderRadius: 10,
              backgroundColor: "#fff",
              elevation: 2
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {s.estabelecimentos?.nome}
            </Text>

            <Text>Tipo: {s.tipo}</Text>

            <Text>Status: {tagStatus(s.status)}</Text>

            <Text style={{ marginTop: 5, opacity: 0.7 }}>
              {new Date(s.data_solicitacao).toLocaleString()}
            </Text>
          </TouchableOpacity>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}
