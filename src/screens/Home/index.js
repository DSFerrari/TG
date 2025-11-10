import { useState, useEffect, useCallback, useContext } from "react";
import { View, Text, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";

import { styles } from "./styles";
import ButtonMAI from "../../components/ButtonMAI";
import SearchMAI from "../../components/SearchMAI";
import CardMAI from "../../components/CardMAI";
import theme from "../../theme";
import { AppContext } from "../../contexts/app";

export default function Home() {
  const [search, setSearch] = useState("");
  const navegar = useNavigation();
  const { getEstablishments, loadingAuth, favoriteIds, toggleFavorite } = useContext(AppContext);
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permissão de localização negada");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
    })();
  }, []);
  
useFocusEffect(
  useCallback(() => {
    async function carregar() {
      if (!userLocation) return;

      const data = await getEstablishments();

      if (userLocation) {
        const ordenados = [...data].sort((a, b) => {
          const distA = a.latitude && a.longitude
            ? calcularDistancia(userLocation.latitude, userLocation.longitude, a.latitude, a.longitude)
            : Infinity;
          const distB = b.latitude && b.longitude
            ? calcularDistancia(userLocation.latitude, userLocation.longitude, b.latitude, b.longitude)
            : Infinity;
          return distA - distB;
        });
        setEstabelecimentos(ordenados);
        setFiltrados(ordenados);
      } else {
        setEstabelecimentos(data);
        setFiltrados(data);
      }
    }
    carregar();
  }, [userLocation])
);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim() === "") {
        setFiltrados(estabelecimentos);
      } else {
        const filtro = estabelecimentos.filter((item) =>
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

  function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  if (loadingAuth) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.COLORS.BLUE1} />
        <Text>Carregando estabelecimentos...</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView edges={["bottom"]}>
          <FlatList
            data={filtrados}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <>
                <View style={{ marginTop: 20, marginBottom: 10 }}>
                  <SearchMAI value={search} onChangeText={setSearch} />
                </View>

                <ButtonMAI name="Filtros" icon={"menu"} />

                <View style={{ marginTop: -10, marginBottom: 20 }}>
                  <ButtonMAI
                    name="Novo Estabelecimento"
                    icon={"add"}
                    limpo={true}
                    onPress={() => navegar.navigate("Cadastrar Estabelecimento")}
                  />
                </View>
              </>
            }
            renderItem={({ item }) => {
              let distancia = null;

             if (userLocation && item.latitude && item.longitude) {
  distancia = calcularDistancia(
    userLocation.latitude,
    userLocation.longitude,
    item.latitude,
    item.longitude
  );
}
              let distanciaTexto = "—";
              if (distancia !== null) {
                distanciaTexto =
                  distancia < 1
                    ? `${(distancia * 1000).toFixed(0)} m`
                    : `${distancia.toFixed(1)} km`;
              }

              return (
                <CardMAI
                  nome={item.nome}
                  distancia={distanciaTexto}
                  categoria={item.categoria || "Sem categoria"}
                  imagem={{ uri: item.url_foto }}
                  avaliacao={item.avaliacao_media || 0}
                  onPress={() =>
                    navegar.navigate("Detalhes", { estabelecimento: item })
                  }
                  isFavorite={favoriteIds.has(item.id)}
                  onToggleFavorite={() => toggleFavorite(item.id)}
                />
              );
            }}
            ListEmptyComponent={() => (
              <Text style={styles.empty}>Nenhum estabelecimento encontrado.</Text>
            )}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
