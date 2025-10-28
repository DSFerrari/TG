import { useState } from "react";
import { View,Text, Alert} from "react-native";
import { KeyboardAvoidingView, Image, Platform, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ScrollView,ActivityIndicator,FlatList} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from "./styles";
import ButtonMAI from '../../components/ButtonMAI';
import SearchMAI from "../../components/SearchMAI";
import CardMAI from "../../components/CardMAI";
import { useNavigation,useFocusEffect } from "@react-navigation/native";
import { useContext,useCallback,useEffect } from "react";
import { AppContext } from "../../contexts/app";

export default function Favorites(){

    const navegar = useNavigation();
const { 
    getFavoriteEstablishments,
    loadingFavorites,
    toggleFavorite,
    favoriteIds,
  } = useContext(AppContext);

  const [favoritos, setFavoritos] = useState([]);
  
  const [search, setSearch] = useState("");
  const [filtrados, setFiltrados] = useState([]);

  useFocusEffect(
    useCallback(() => {
      async function carregarFavoritos() {
        const data = await getFavoriteEstablishments();
        setFavoritos(data);
        setFiltrados(data);
      }
      carregarFavoritos();
    }, [])
  );

  useEffect(() => {
    if (search.trim() === "") {
      setFiltrados(favoritos);
    } else {
      const filtro = favoritos.filter(item =>
        item.nome.toLowerCase().includes(search.toLowerCase())
      );
      setFiltrados(filtro);
    }
  }, [search, favoritos]);

  const handleRemoveFavorite = (idParaRemover) => {
    

    toggleFavorite(idParaRemover);

    setFavoritos(listaAntiga => 
      listaAntiga.filter(item => item.id !== idParaRemover)
    );
    
    setFiltrados(listaAntiga =>
      listaAntiga.filter(item => item.id !== idParaRemover)
    );
  };


  if (loadingFavorites) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Carregando seus favoritos...</Text>
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
            <SearchMAI
            value={search}
            onChangeText={setSearch}
            />
            <View style={{marginBottom:20}}>
            <ButtonMAI
            name="Filtros"
            icon={"menu"}
            />
            </View>

            <FlatList
            data={filtrados}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              
              const handleToggleFavorite = () => {
                toggleFavorite(item.id);
              };

              return (
                <CardMAI
                  nome={item.nome}
                  distancia="1.2 km"
                  categoria={item.categoria || "Sem categoria"}
                  imagem={{ uri: item.url_foto }}
                  avaliacao={item.avaliacao || 0}
                  onPress={() => navegar.navigate("Inicio", { 
    screen: "Detalhes", 
    params: { estabelecimento: item }
                  })}
                  
                  isFavorite={true}
                  onToggleFavorite={() => handleRemoveFavorite(item.id)}
                />
              );
            }}
            ListEmptyComponent={() => (
              <Text style={styles.empty}>Você ainda não favoritou nenhum local.</Text>
            )}
          />
        </SafeAreaView>
       </KeyboardAvoidingView>
       </TouchableWithoutFeedback>
)
}