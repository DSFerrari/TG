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

export default function Home() {
  const navegar = useNavigation();
  const { getEstablishments, loadingAuth, favoriteIds, toggleFavorite } =
    useContext(AppContext);

  const [search, setSearch] = useState("");
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState(null);

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

        const location = await Location.getCurrentPositionAsync({});
        if (location?.coords) {
          setUserLocation(location.coords);
        }
      } catch (_) {}
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        try {
          const data = await getEstablishments();
          setEstabelecimentos(Array.isArray(data) ? data : []);
        } catch {
          setEstabelecimentos([]);
        }
      }
      carregar();
    }, [])
  );

  function calcDist(item) {
    if (
      !userLocation ||
      !item ||
      !item.latitude ||
      !item.longitude
    )
      return Infinity;

    const R = 6371;
    const dLat = ((item.latitude - userLocation.latitude) * Math.PI) / 180;
    const dLon = ((item.longitude - userLocation.longitude) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((userLocation.latitude * Math.PI) / 180) *
        Math.cos((item.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  useEffect(() => {
    if (!Array.isArray(estabelecimentos) || estabelecimentos.length === 0) {
      setFiltrados([]);
      return;
    }

    let lista = [...estabelecimentos];

    if (search.trim() !== "") {
      const termo = normalize(search);
      lista = lista.filter((item) =>
        normalize(item?.nome).includes(termo)
      );
    }

    if (filters) {
      const { categoria, distancia, avaliacao, acessibilidades } = filters;

      if (categoria) {
        lista = lista.filter(
          (item) =>
            normalize(item?.categoria) === normalize(categoria)
        );
      }

      if (avaliacao) {
        lista = lista.filter(
          (item) => (item?.avaliacao_media ?? 0) >= avaliacao
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

    if (userLocation) {
      lista.sort((a, b) => calcDist(a) - calcDist(b));
    }

    setFiltrados(lista);
  }, [estabelecimentos, search, filters, userLocation]);

  function aplicarFiltros(f) {
    const semFiltros =
      !f.categoria &&
      !f.distancia &&
      !f.avaliacao &&
      (!f.acessibilidades || f.acessibilidades.length === 0);

    setFilters(semFiltros ? null : f);
    setFilterOpen(false);
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
            keyExtractor={(item) => String(item?.id)}
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

                <View style={{ marginTop: -10, marginBottom: 20 }}>
                  <ButtonMAI
                    name="Novo Estabelecimento"
                    icon="add"
                    limpo
                    onPress={() =>
                      navegar.navigate("Cadastrar Estabelecimento")
                    }
                  />
                </View>
              </>
            }
            renderItem={({ item }) => {
              const dist = calcDist(item);

              const distanciaTxt =
                dist === Infinity
                  ? "—"
                  : dist < 1
                  ? `${(dist * 1000).toFixed(0)} m`
                  : `${dist.toFixed(1)} km`;

              return (
                <CardMAI
                  nome={item?.nome}
                  distancia={distanciaTxt}
                  categoria={item?.categoria || "Sem categoria"}
                  imagem={{ uri: item?.url_foto }}
                  avaliacao={item?.avaliacao_media || 0}
                  onPress={() =>
                    navegar.navigate("Detalhes", { estabelecimento: item })
                  }
                  isFavorite={favoriteIds.has(item?.id)}
                  onToggleFavorite={() => toggleFavorite(item?.id)}
                />
              );
            }}
            ListEmptyComponent={() => (
              <Text style={styles.empty}>
                Nenhum estabelecimento encontrado.
              </Text>
            )}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
