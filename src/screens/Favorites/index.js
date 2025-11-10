import { useState, useEffect, useCallback, useContext } from "react";
import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";

import { styles } from "./styles";
import ButtonMAI from "../../components/ButtonMAI";
import SearchMAI from "../../components/SearchMAI";
import CardMAI from "../../components/CardMAI";
import theme from "../../theme";
import { AppContext } from "../../contexts/app";

export default function Favorites() {
  const navegar = useNavigation();

  const {
    getFavoriteEstablishments,
    loadingFavorites,
    toggleFavorite,
    favoriteIds,
  } = useContext(AppContext);

  const [favoritos, setFavoritos] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [search, setSearch] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  function toNumberOrNull(v) {
    if (v === null || v === undefined) return null;
    const s = String(v).trim().replace(",", ".");
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }

  function extractCoords(item) {
    let lat = toNumberOrNull(item?.latitude ?? item?.lat);
    let lon = toNumberOrNull(item?.longitude ?? item?.lng ?? item?.long);

    if ((lat === null || lon === null) && item?.estabelecimento) {
      lat = toNumberOrNull(item.estabelecimento.latitude ?? item.estabelecimento.lat);
      lon = toNumberOrNull(item.estabelecimento.longitude ?? item.estabelecimento.lng ?? item.estabelecimento.long);
    }

    if ((lat === null || lon === null) && item?.location) {
      lat = toNumberOrNull(
        item.location.latitude ??
        item.location.lat ??
        item.location?.coords?.latitude ??
        item.location?.coords?.lat
      );
      lon = toNumberOrNull(
        item.location.longitude ??
        item.location.lng ??
        item.location.long ??
        item.location?.coords?.longitude ??
        item.location?.coords?.lng ??
        item.location?.coords?.long
      );
    }

    return { lat, lon };
  }

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
      async function carregarFavoritos() {
         if (!userLocation) return;
        const data = await getFavoriteEstablishments();

        const normalizados = data.map((raw) => {
          const { lat, lon } = extractCoords(raw);
          return { ...raw, _lat: lat, _lon: lon };
        });

        let lista = normalizados;

        if (userLocation) {
          const { latitude: ulat, longitude: ulon } = userLocation;

          lista = normalizados.map((it) => {
            if (it._lat !== null && it._lon !== null) {
              return { ...it, _dist: calcularDistancia(ulat, ulon, it._lat, it._lon) };
            }
            return { ...it, _dist: Infinity };
          });

          lista.sort((a, b) => a._dist - b._dist);
        }

        setFavoritos(lista);
        setFiltrados(lista);
      }

      carregarFavoritos();
    }, [userLocation])
  );

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim() === "") {
        setFiltrados(favoritos);
      } else {
        const filtro = favoritos.filter((item) =>
          (item.nome ?? item?.estabelecimento?.nome ?? "")
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
  }, [search, favoritos]);

  if (loadingFavorites) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.COLORS.BLUE1} />
        <Text>Carregando seus favoritos...</Text>
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
            keyExtractor={(item) =>
              item.id?.toString() ||
              item?.estabelecimento_id?.toString() ||
              item?.estabelecimento?.id?.toString()
            }
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <>
                <View style={{ marginTop: 20, marginBottom: 10 }}>
                  <SearchMAI value={search} onChangeText={setSearch} />
                </View>

                <ButtonMAI name="Filtros" icon={"menu"} />
              </>
            }
            renderItem={({ item }) => {
              let distanciaTexto = "—";

              if (userLocation && item?._lat !== null && item?._lon !== null) {
                const dist =
                  typeof item._dist === "number"
                    ? item._dist
                    : calcularDistancia(
                      userLocation.latitude,
                      userLocation.longitude,
                      item._lat,
                      item._lon
                    );

                distanciaTexto =
                  dist < 1
                    ? `${(dist * 1000).toFixed(0)} m`
                    : `${dist.toFixed(1)} km`;
              }

              return (
                <CardMAI
                  nome={item.nome ?? item?.estabelecimento?.nome ?? "Sem nome"}
                  distancia={distanciaTexto}
                  categoria={item.categoria || item?.estabelecimento?.categoria || "Sem categoria"}
                  imagem={{ uri: item.url_foto ?? item?.estabelecimento?.url_foto }}
                  avaliacao={item.avaliacao_media ?? item?.estabelecimento?.avaliacao_media ?? 0}
                  onPress={() =>
                    navegar.navigate("Início", {
                      screen: "Detalhes",
                      params: { estabelecimento: item.estabelecimento ?? item }
                    })
                  }
                  isFavorite={favoriteIds.has(
                    item.id ?? item?.estabelecimento_id ?? item?.estabelecimento?.id
                  )}
                  onToggleFavorite={async () => {
                    const id = item.id ?? item?.estabelecimento_id ?? item?.estabelecimento?.id;
                    await toggleFavorite(id);

                    setFavoritos((prev) => prev.filter((f) =>
                      (f.id ?? f.estabelecimento_id ?? f.estabelecimento?.id) !== id
                    ));
                    setFiltrados((prev) => prev.filter((f) =>
                      (f.id ?? f.estabelecimento_id ?? f.estabelecimento?.id) !== id
                    ));
                  }}

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
  );
}