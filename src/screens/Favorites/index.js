import { useState, useEffect, useCallback, useContext } from "react";
import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  ActivityIndicator,
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

import FilterModal from "../../components/FilterModal/FilterModal";

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
  const [filters, setFilters] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  function normalize(str) {
    if (!str) return "";
    return String(str)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;

        const loc = await Location.getCurrentPositionAsync({});
        if (loc?.coords) {
          setUserLocation(loc.coords);
        }
      } catch {}
    })();
  }, []);

  function calcDist(item) {
    const lat = Number(item?.latitude) || null;
    const lon = Number(item?.longitude) || null;
    if (!lat || !lon || !userLocation) return Infinity;

    const R = 6371;
    const dLat = ((lat - userLocation.latitude) * Math.PI) / 180;
    const dLon = ((lon - userLocation.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((userLocation.latitude * Math.PI) / 180) *
        Math.cos((lat * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        try {
          const data = await getFavoriteEstablishments();

          const lista = data.map((raw) => {
            const base = raw.estabelecimento ?? raw;
            return {
              id: base.id,
              nome: base.nome,
              categoria: base.categoria,
              url_foto: base.url_foto,
              avaliacao_media: base.avaliacao_media,
              latitude: base.latitude,
              longitude: base.longitude,
              acessibilidades: base.acessibilidades,
            };
          });

          setFavoritos(lista);
          setFiltrados(lista);
        } catch {
          setFavoritos([]);
          setFiltrados([]);
        }
      }

      carregar();
    }, [])
  );

  useEffect(() => {
    let lista = [...favoritos];

    if (search.trim() !== "") {
      const termo = normalize(search);
      lista = lista.filter((item) => normalize(item.nome).includes(termo));
    }

    if (filters) {
      const { categoria, distancia, avaliacao, acessibilidades } = filters;

      if (categoria) {
        lista = lista.filter(
          (item) => normalize(item.categoria) === normalize(categoria)
        );
      }

      if (avaliacao) {
        lista = lista.filter(
          (item) => (item.avaliacao_media ?? 0) >= avaliacao
        );
      }

      if (distancia && userLocation) {
        const nums = distancia.match(/\d+/g) || [];

        let minDist = 0;
        let maxDist = Infinity;

        if (distancia.includes("km+")) {
          minDist = Number(nums[0] || 0);
          maxDist = Infinity;
        } else if (nums.length >= 2) {
          minDist = Number(nums[0]);
          maxDist = Number(nums[1]);
        } else if (nums.length === 1) {
          minDist = 0;
          maxDist = Number(nums[0]);
        }

        lista = lista.filter((item) => {
          const dist = calcDist(item);
          return dist >= minDist && dist <= maxDist;
        });
      }

      if (acessibilidades?.length > 0) {
        lista = lista.filter((item) => {
          const texto = normalize(item?.acessibilidades);
          if (!texto) return false;
          return acessibilidades.every((ac) =>
            texto.includes(normalize(ac))
          );
        });
      }
    }

    // Ordena por distância
    if (userLocation) {
      lista.sort((a, b) => calcDist(a) - calcDist(b));
    }

    setFiltrados(lista);
  }, [favoritos, search, filters, userLocation]);

  function aplicarFiltros(f) {
    const vazio =
      !f.categoria &&
      !f.distancia &&
      !f.avaliacao &&
      (!f.acessibilidades || f.acessibilidades.length === 0);

    setFilters(vazio ? null : f);
    setFilterOpen(false);
  }

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
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <>
                <View style={{ marginTop: 20, marginBottom: 10 }}>
                  <SearchMAI value={search} onChangeText={setSearch} />
                </View>

                <ButtonMAI
                  name="Filtros"
                  icon="menu"
                  onPress={() => setFilterOpen(true)}
                />

                <FilterModal
                  visible={filterOpen}
                  onClose={() => setFilterOpen(false)}
                  onApply={aplicarFiltros}
                />
              </>
            }
            renderItem={({ item }) => {
              const dist = userLocation ? calcDist(item) : Infinity;

              const distTxt =
                dist === Infinity
                  ? "—"
                  : dist < 1
                  ? `${(dist * 1000).toFixed(0)} m`
                  : `${dist.toFixed(1)} km`;

              return (
                <CardMAI
                  nome={item.nome}
                  distancia={distTxt}
                  categoria={item.categoria || "Sem categoria"}
                  imagem={{ uri: item.url_foto }}
                  avaliacao={item.avaliacao_media || 0}
                  onPress={() =>
                    navegar.navigate("Início", {
                      screen: "Detalhes",
                      params: { estabelecimento: item },
                    })
                  }
                  isFavorite={favoriteIds.has(item.id)}
                  onToggleFavorite={async () => {
                    await toggleFavorite(item.id);

                    // Remove imediatamente
                    setFavoritos((prev) => prev.filter((f) => f.id !== item.id));
                    setFiltrados((prev) => prev.filter((f) => f.id !== item.id));
                  }}
                />
              );
            }}
            ListEmptyComponent={() => (
              <Text style={styles.empty}>
                Você ainda não favoritou nenhum local.
              </Text>
            )}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
