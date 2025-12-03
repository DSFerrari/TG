import React, { useEffect, useState, useContext,useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppContext } from "../../../contexts/app";
import theme from "../../../theme";
import { useFocusEffect } from "@react-navigation/native";

export default function AdminSolicitacoes({ navigation }) {
  const { listarSolicitacoesAdmin } = useContext(AppContext);
  const [solicitacoes, setSolicitacoes] = useState([]);

  useFocusEffect((
    useCallback(() => {
    carregar();
  }, [])));

  async function carregar() {
    const data = await listarSolicitacoesAdmin();
    setSolicitacoes(data);
  }

  function tagStatus(status) {
    const cores = {
      pendente: theme.COLORS.YELLOW1,
      aprovado: theme.COLORS.GREEN1,
      rejeitado: theme.COLORS.RED1,
    };
    return (
      <Text style={{ color: cores[status], fontWeight: "bold" }}>
        {status.toUpperCase()}
      </Text>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.WHITE3 }}>
      <ScrollView style={{ padding: 20 }}>
        {solicitacoes.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 40 }}>
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
            <Text style={{ fontSize: 16, color: theme.COLORS.BLACK1, opacity: 0.7 }}>
              Não há estabelecimentos pendentes
            </Text>
          </View>
        ) : (
          solicitacoes.map((s) => (
            <TouchableOpacity
              key={s.id}
              onPress={() =>
                navigation.navigate("AdminDetalheSolicitacao", { solicitacao: s })
              }
              style={{
                padding: 15,
                backgroundColor: theme.COLORS.WHITE1,
                borderColor: theme.COLORS.BLACK1,
                marginBottom: 12,
                borderRadius: 10,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {s.nome_estabelecimento || s.estabelecimentos?.nome}
              </Text>

              <Text>Tipo: {s.tipo}</Text>
              <Text>Status: {tagStatus(s.status)}</Text>

              <Text style={{ opacity: 0.7, marginTop: 5 }}>
                {new Date(s.data_solicitacao).toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
