import { useState } from "react";
import { View,Text, Alert} from "react-native";
import { KeyboardAvoidingView, Image, Platform, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ScrollView,FlatList,ActivityIndicator} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from "./styles";
import ButtonMAI from '../../components/ButtonMAI';
import SearchMAI from "../../components/SearchMAI";
import CardMAI from "../../components/CardMAI";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { AppContext } from "../../contexts/app";
import { useCallback,useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
export default function Home(){


const [search, setSearch] = useState("");
const navegar = useNavigation();
const { getEstablishments, loadingAuth,favoriteIds,toggleFavorite} = useContext(AppContext);
const [estabelecimentos, setEstabelecimentos] = useState([]);
const [filtrados, setFiltrados] = useState([]);


 useFocusEffect(
  useCallback(() => {
    async function carregar() {
      const data = await getEstablishments();
      setEstabelecimentos(data);
      setFiltrados(data);
    }
    carregar();
  }, [])
);


useEffect(() => {
  const delayDebounce = setTimeout(() => {
    if (search.trim() === "") {
      setFiltrados(estabelecimentos);
    } else {
      const filtro = estabelecimentos.filter(item =>
        item.nome
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(
            search
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          )
      );
      setFiltrados(filtro);
    }
  }, 400);

  return () => clearTimeout(delayDebounce);
}, [search, estabelecimentos]);

  if (loadingAuth) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Carregando estabelecimentos...</Text>
      </View>
    );
  }

return(
    <TouchableWithoutFeedback
       onPress={Keyboard.dismiss}
       >
       <KeyboardAvoidingView
       style={styles.container}
       behavior={Platform.OS === 'ios' ? 'padding': 'height'}
       >
        <SafeAreaView>
          <View style={{marginTop:-20}}>
            <SearchMAI
            value={search}
            onChangeText={setSearch}
            />
            </View>
            <ButtonMAI
            name="Filtros"
            icon={"menu"}
            />
            <View style={{marginTop: -10,marginBottom:20}}>
            <ButtonMAI
            name="Novo Estabelecimento"
            icon={"add"}
            limpo={true}
            onPress={() => navegar.navigate('Cadastrar Estabelecimento')}
            />
            </View>

            <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CardMAI
            nome={item.nome}
            distancia="1.2 km"
            categoria={item.categoria || "Sem categoria"}
            imagem={{ uri: item.url_foto }}
            avaliacao={item.avaliacao || 0}
            onPress={() => navegar.navigate("Detalhes", { estabelecimento: item })}
            isFavorite={favoriteIds.has(item.id)}
            onToggleFavorite={() => toggleFavorite(item.id)}
          />
        )}
        ListEmptyComponent={() => (
          <Text style={styles.empty}>Nenhum estabelecimento encontrado.</Text>
        )}
      />

        </SafeAreaView>
       </KeyboardAvoidingView>
       </TouchableWithoutFeedback>
)
}