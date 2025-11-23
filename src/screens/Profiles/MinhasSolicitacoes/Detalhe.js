import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SolicitacaoDetalheUser({ route }) {
  const { solicitacao } = route.params;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ padding: 20 }}>

        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          {solicitacao.estabelecimentos?.nome}
        </Text>

        <Text style={{ marginTop: 10 }}>
          Tipo: {solicitacao.tipo}
        </Text>

        <Text style={{ marginTop: 10, fontWeight: "bold" }}>
          Justificativa enviada:
        </Text>
        <Text>{solicitacao.justificativa}</Text>

        <Text style={{ marginTop: 20, fontWeight: "bold" }}>
          Status: {solicitacao.status.toUpperCase()}
        </Text>

        {solicitacao.status !== "pendente" && (
          <>
            <Text style={{ marginTop: 10, fontWeight: "bold" }}>
              Resposta do admin:
            </Text>
            <Text>{solicitacao.resposta_admin || "—"}</Text>

            <Text style={{ marginTop: 10, fontWeight: "bold" }}>
              Data da resposta:
            </Text>
            <Text>{new Date(solicitacao.data_resposta).toLocaleString()}</Text>
          </>
        )}

        <Text style={{ marginTop: 20, fontWeight: "bold" }}>
          Alterações solicitadas:
        </Text>
        <Text>{JSON.stringify(solicitacao.alteracoes, null, 2)}</Text>

      </ScrollView>
    </SafeAreaView>
  );
}
