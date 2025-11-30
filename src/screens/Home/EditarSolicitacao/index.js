import React, { useState, useContext, useEffect } from "react";
import { 
  View, 
  ScrollView, 
  Alert, 
  TouchableOpacity, 
  Text, 
  TouchableWithoutFeedback, 
  Keyboard,
  StyleSheet 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";

import TextInputMAI from "../../../components/TextInputMAI";
import ButtonMAI from "../../../components/ButtonMAI";
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
  const [endereco, setEndereco] = useState(estabelecimento.endereco);
  const [foto, setFoto] = useState(null);
  const [justificativa, setJustificativa] = useState("");
  const [acessibilidades, setAcessibilidades] = useState(
    estabelecimento.acessibilidades
      ? estabelecimento.acessibilidades.split(",")
      : []
  );

  const [categoria, setCategoria] = useState(estabelecimento.categoria);
  const [searchCategoria, setSearchCategoria] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showCategoryList, setShowCategoryList] = useState(false);

  useEffect(() => {
    if (estabelecimento.categoria) {
      const found = categoryItems.find(item => item.value === estabelecimento.categoria);
      if (found) {
        setSearchCategoria(found.label);
      } else {
        setSearchCategoria(estabelecimento.categoria); 
      }
    }
  }, [estabelecimento.categoria]);

  const handleSearchCategory = (text) => {
    setSearchCategoria(text);
    setCategoria(null); 
    if (text) {
      const newData = categoryItems.filter((item) => {
        const itemData = item.label ? item.label.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredCategories(newData);
      setShowCategoryList(true);
    } else {
      setFilteredCategories([]);
      setShowCategoryList(false);
    }
  };

  const handleSelectCategory = (item) => {
    setCategoria(item.value);
    setSearchCategoria(item.label);
    setShowCategoryList(false);
    Keyboard.dismiss();
  };

  async function enviarSolicitacao() {
    if (!justificativa.trim()) {
      Alert.alert("Justifique!", "Explique por que deseja alterar os dados.");
      return;
    }

    if (!categoria) {
      Alert.alert("Categoria inválida", "Por favor, selecione uma categoria da lista.");
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
    <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss();
      setShowCategoryList(false);
    }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.WHITE3 }}>
        <ScrollView 
          contentContainerStyle={{ padding: 20 }}
          keyboardShouldPersistTaps="handled"
        >

          <FotoEstabelecimento image={foto} setImage={setFoto} />

          <TextInputMAI
            texto="Nome"
            value={nome}
            onChangeText={setNome}
          />

          <View style={{ zIndex: 10 }}>
            <TextInputMAI
              texto="Categoria"
              value={searchCategoria}
              onChangeText={handleSearchCategory}
              placeholder="Digite para buscar..."
            />

            {showCategoryList && (
              <View style={styles.dropdownContainer}>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat, index) => (
                    <TouchableOpacity
                      key={`${cat.value}_${index}`}
                      style={styles.dropdownItem}
                      onPress={() => handleSelectCategory(cat)}
                    >
                      <Text style={styles.dropdownText}>{cat.label}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.dropdownItem}>
                    <Text style={{ color: '#999' }}>Nenhuma categoria encontrada</Text>
                  </View>
                )}
              </View>
            )}
             {!categoria && searchCategoria.length > 0 && !showCategoryList && (
               <Text style={{color: theme.COLORS.RED1, fontSize: 12, marginLeft: 12, marginTop: 5}}>
                 Selecione uma categoria da lista.
               </Text>
            )}
          </View>

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
            style={{ height: 120, textAlignVertical: 'top', paddingTop: 15 }}
            multiline
            numberOfLines={5}
          />

          <ButtonMAI
            name="Enviar solicitação"
            onPress={enviarSolicitacao}
          />

        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  dropdownContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 5,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownText: {
    fontSize: 16,
    color: theme.COLORS.BLACK1,
  },
});