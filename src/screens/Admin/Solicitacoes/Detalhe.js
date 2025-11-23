import React, { useState, useContext, useEffect } from "react";
import { View, Text, ScrollView, Alert, ActivityIndicator,Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TextInputMAI from "../../../components/TextInputMAI";
import ButtonMAI from "../../../components/ButtonMAI";
import { AppContext } from "../../../contexts/app";
import theme from "../../../theme";
import { supabase } from "../../../services/supabase";

export default function AdminDetalheSolicitacao({ route, navigation }) {
  const { aprovarSolicitacao, rejeitarSolicitacao } = useContext(AppContext);
  const { solicitacao } = route.params;

  const [motivoRejeicao, setMotivoRejeicao] = useState("");
  const [estab, setEstab] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEstab() {
      if (solicitacao.tipo === "editar") {
        const { data } = await supabase
          .from("estabelecimentos")
          .select("*")
          .eq("id", solicitacao.id_estabelecimento)
          .maybeSingle();

        setEstab(data);
      }
      setLoading(false);
    }
    loadEstab();
  }, []);

  async function aceitar() {
    const ok = await aprovarSolicitacao(
      solicitacao.id,
      solicitacao.id_estabelecimento,
      solicitacao.alteracoes
    );
    if (ok) navigation.goBack();
  }

  async function rejeitar() {
    if (!motivoRejeicao.trim()) {
      Alert.alert("Justifique a rejeição");
      return;
    }

    const ok = await rejeitarSolicitacao(solicitacao.id, motivoRejeicao);
    if (ok) navigation.goBack();
  }

  function renderAlteracoes() {
  if (!estab || !solicitacao.alteracoes) return null;

  const alteracoes = solicitacao.alteracoes;
  const campos = Object.keys(alteracoes);

  if (campos.length === 0)
    return <Text>Nenhuma alteração enviada.</Text>;

  return (
    <View style={{ marginTop: 15 }}>
      {campos.map((campo) => {
        const valorNovo = alteracoes[campo];
        const valorAntigo = estab[campo];

        const isImagem =
          campo.toLowerCase().includes("foto") ||
          campo.toLowerCase().includes("img");

        return (
          <View key={campo} style={{ marginBottom: 20 }}>

            <Text style={{ fontWeight: "bold", fontSize: 17 }}>
              {campo.charAt(0).toUpperCase() + campo.slice(1)}
            </Text>

            {isImagem ? (
              <>
                <Text style={{ color: "#666", marginTop: 4 }}>Antes:</Text>

                {valorAntigo ? (
                  <Image
                    source={{ uri: valorAntigo }}
                    style={{
                      width: "100%",
                      height: 180,
                      borderRadius: 10,
                      marginVertical: 5,
                    }}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={{ marginLeft: 10 }}>(Sem foto atual)</Text>
                )}

                <Text style={{ color: "#666", marginTop: 4 }}>Depois:</Text>

                {(() => {
                  let uri = null;

                  if (typeof valorNovo === "object" && valorNovo !== null) {
                    if (valorNovo.uri) uri = valorNovo.uri;
                    else if (valorNovo.base64)
                      uri = `data:image/jpeg;base64,${valorNovo.base64}`;
                  }

                  else if (typeof valorNovo === "string") {
                    uri = valorNovo.startsWith("http")
                      ? valorNovo
                      : `data:image/jpeg;base64,${valorNovo}`;
                  }

                  if (!uri)
                    return (
                      <Text style={{ marginLeft: 10 }}>(Sem nova foto)</Text>
                    );

                  return (
                    <Image
                      source={{ uri }}
                      style={{
                        width: "100%",
                        height: 180,
                        borderRadius: 10,
                        marginVertical: 5,
                      }}
                      resizeMode="cover"
                    />
                  );
                })()}
              </>
            ) : (
              <>
                <Text style={{ color: "#666", marginTop: 4 }}>Antes:</Text>
                <Text style={{ marginLeft: 10 }}>
                  {JSON.stringify(valorAntigo, null, 2)}
                </Text>

                <Text style={{ color: "#666", marginTop: 4 }}>Depois:</Text>
                <Text style={{ marginLeft: 10 }}>
                  {JSON.stringify(valorNovo, null, 2)}
                </Text>
              </>
            )}
          </View>
        );
      })}
    </View>
  );
}


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.WHITE3 }}>
      <ScrollView style={{ padding: 20 }}>

        <Text style={{ fontSize: 22, fontWeight: "bold" }}>
          {solicitacao.nome_estabelecimento ||
            solicitacao.estabelecimentos?.nome ||
            "(Estabelecimento removido)"}
        </Text>

        <Text style={{ marginTop: 10 }}>Tipo: {solicitacao.tipo}</Text>

        <Text style={{ marginTop: 20, fontWeight: "bold" }}>
          Justificativa do usuário:
        </Text>
        <Text>{solicitacao.justificativa}</Text>

        {solicitacao.tipo === "editar" && solicitacao.alteracoes && (
          <>
            <Text style={{ marginTop: 20, fontWeight: "bold" }}>
              Alterações solicitadas:
            </Text>
            {renderAlteracoes()}
          </>
        )}

        {solicitacao.status === "pendente" && (
          <>
            <ButtonMAI name="Aprovar Solicitação" onPress={aceitar} />

            <TextInputMAI
              texto="Motivo da rejeição (obrigatório)"
              value={motivoRejeicao}
              onChangeText={setMotivoRejeicao}
              style={{
                height: 120,
                textAlignVertical: "top",
                paddingTop: 15,
              }}
              multiline
            />

            <ButtonMAI
              name="Rejeitar Solicitação"
              onPress={rejeitar}
              icon="close"
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
