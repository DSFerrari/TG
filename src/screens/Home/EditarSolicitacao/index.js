import React, { useState, useContext } from "react";
import { View, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";

import TextInputMAI from "../../../components/TextInputMAI";
import ButtonMAI from "../../../components/ButtonMAI";
import CategoriaMAI from "../../../components/CategoriaMAI";
import CheckboxAcessibilidade from "../../../components/CheckboxAcessibilidade";
import FotoEstabelecimento from "../../../components/FotoEstabelecimento/FotoEstabelecimento";

import { AppContext } from "../../../contexts/app";
import { categoryItems } from "../CadastrarEstabelecimento/categoryItems";
import theme from "../../../theme";

export default function EditarSolicitacao() {
  const { solicitarEdicao } = useContext(AppContext);
  const route = useRoute();
  const navigation = useNavigation();

  const { estabelecimento } = route.params;

  const [nome, setNome] = useState(estabelecimento.nome);
  const [categoria, setCategoria] = useState(estabelecimento.categoria);
  const [endereco, setEndereco] = useState(estabelecimento.endereco);
  const [acessibilidades, setAcessibilidades] = useState(
    estabelecimento.acessibilidades
      ? estabelecimento.acessibilidades.split(",")
      : []
  );
  const [foto, setFoto] = useState(null);
  const [justificativa, setJustificativa] = useState("");

  async function enviarSolicitacao() {
    if (!justificativa.trim()) {
      Alert.alert("Justifique!", "Explique por que deseja alterar os dados.");
      return;
    }

    const alteracoes = {
      nome,
      categoria,
      endereco,
      acessibilidades: acessibilidades.join(",")
    };

    if (foto) {
      alteracoes.url_foto_nova = foto;
    }

    const ok = await solicitarEdicao(estabelecimento.id, alteracoes, justificativa, estabelecimento.nome);

    if (ok) navigation.goBack();
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.WHITE3 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>

        <FotoEstabelecimento image={foto} setImage={setFoto} />

        <TextInputMAI
          texto="Nome"
          value={nome}
          onChangeText={setNome}
        />

        <CategoriaMAI
          value={categoria}
          onValueChange={setCategoria}
          items={categoryItems}
        />

        <TextInputMAI
          texto="Endereço"
          value={endereco}
          onChangeText={setEndereco}
        />

        <CheckboxAcessibilidade
          selectedAcessibilidade={acessibilidades}
          onSelectionChange={setAcessibilidades}
        />

        <TextInputMAI
          texto="Justificativa da solicitação"
          value={justificativa}
          onChangeText={setJustificativa}
          style={{height:120,textAlignVertical: 'top',paddingTop:15}}
        multiline
        numberOfLines={5}
        />

        <ButtonMAI
          name="Enviar solicitação"
          onPress={enviarSolicitacao}
        />

      </ScrollView>
    </SafeAreaView>
  );
}
