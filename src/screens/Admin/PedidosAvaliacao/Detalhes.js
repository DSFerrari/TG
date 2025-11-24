import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonMAI from "../../../components/ButtonMAI";
import { supabase } from "../../../services/supabase";
import theme from "../../../theme";

export default function DetalhesPedido({ route, navigation }) {
  const { pedido } = route.params;

  async function atualizarStatus(status) {
    const { error } = await supabase
      .from("pedidos_exclusao_avaliacao")
      .update({ status })
      .eq("id", pedido.id);

    if (error) {
      console.log("ERRO UPDATE PEDIDO:", error);
      Alert.alert("Erro ao atualizar status");
      return;
    }

    Alert.alert("Sucesso", `Pedido ${status}`);
    navigation.goBack();
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>
  Avaliação Original
</Text>

<View style={{ marginTop: 10, padding: 15, backgroundColor: "#f3f3f3", borderRadius: 10 }}>
  <Text style={{ fontWeight: "bold", fontSize: 16 }}>
    {pedido.avaliacoes?.titulo || "Sem título"}
  </Text>
  
  <Text style={{ marginTop: 5 }}>
    {pedido.avaliacoes?.comentario || "Sem comentário"}
  </Text>

  <Text style={{ marginTop: 5, fontSize: 14 }}>
    Nota: {pedido.avaliacoes?.nota ?? "?"} ⭐
  </Text>

  <Text style={{ marginTop: 5, fontSize: 12, color: "#666" }}>
    {pedido.avaliacoes?.eh_anonimo ? "Anônimo" : "Usuário identificado"}
  </Text>
</View>

      <View style={{ marginTop: 40 }}>
        <ButtonMAI
          name="Aprovar exclusão"
          color={theme.COLORS.RED1}
          onPress={() => atualizarStatus("aprovado")}
        />

        <View style={{ height: 20 }} />

        <ButtonMAI
          name="Rejeitar pedido"
          color={theme.COLORS.BLUE1}
          onPress={() => atualizarStatus("rejeitado")}
        />
      </View>
    </SafeAreaView>
  );
}
