import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { Linking } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { AppContext } from "../../../../contexts/app";
import { useContext } from "react";

import ButtonMAI from "../../../../components/ButtonMAI";
import theme from "../../../../theme";
import { styles } from "../../styles";
import { supabase } from "../../../../services/supabase";

export default function DetalhesEstabAdmin() {
  const { deleteEstablishment } = useContext(AppContext);
  const route = useRoute();
  const navigation = useNavigation();
  const { estab } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: estab.nome,
    });
  }, [navigation, estab.nome]);

  const abrirNoMapa = () => {
    if (!estab.endereco) return;
    const query = encodeURIComponent(estab.endereco);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    Linking.openURL(url);
  };

  async function updateStatus(novoStatus) {
    try {
      if (novoStatus === "rejeitado") {
        const { error } = await supabase
          .from("estabelecimentos")
          .delete()
          .eq("id", estab.id);

        if (error) throw error;
        Alert.alert("Removido", "O estabelecimento foi rejeitado e excluído.");
      } else {
        const { error } = await supabase
          .from("estabelecimentos")
          .update({ status: novoStatus })
          .eq("id", estab.id);

        if (error) throw error;
        Alert.alert("Aprovado!", "O estabelecimento foi aprovado e liberado.");
      }

      navigation.goBack();
    } catch (err) {
      Alert.alert("Erro", err.message);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image source={{ uri: estab.url_foto }} style={styles.image} />

        <Text style={styles.category}>
          {estab.categoria || "Sem categoria"}
        </Text>

        {estab.acessibilidades && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recursos de acessibilidade</Text>
            {estab.acessibilidades.split(",").map((item, index) =>
              item.trim() ? (
                <Text key={index} style={styles.itemText}>
                  • {item.trim()}
                </Text>
              ) : null
            )}
          </View>
        )}

        {estab.endereco && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Endereço</Text>
            <Text style={styles.itemText}>{estab.endereco}</Text>

            {estab.latitude && estab.longitude ? (
              <MapView
                style={{
                  width: "100%",
                  height: 200,
                  marginTop: 10,
                  borderRadius: 10,
                }}
                initialRegion={{
                  latitude: estab.latitude,
                  longitude: estab.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: estab.latitude,
                    longitude: estab.longitude,
                  }}
                  title={estab.nome}
                  description={estab.endereco}
                />
              </MapView>
            ) : (
              <TouchableOpacity onPress={abrirNoMapa}>
                <Text
                  style={{
                    marginTop: 8,
                    color: theme.COLORS.BLUE1,
                    textDecorationLine: "underline",
                  }}
                >
                  Ver no mapa
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={{ marginTop: -10 }}>
          <ButtonMAI
            name="Aprovar estabelecimento"
            icon="checkmark-circle"
            onPress={() => updateStatus("aprovado")}
          />
        </View>

        <View style={{ marginTop: -10 }}>
          <ButtonMAI
            name="Rejeitar estabelecimento"
            icon="close"
            limpo
            color="red"
            onPress={() =>
              Alert.alert(
                "Confirmar Rejeição",
                "Tem certeza que deseja rejeitar este estabelecimento?\n\nEle será removido permanentemente, incluindo foto e favoritos.",
                [
                  { text: "Cancelar", style: "cancel" },
                  {
                    text: "Rejeitar",
                    style: "destructive",
                    onPress: async () => {
                      const ok = await deleteEstablishment(estab);
                      if (ok) {
                        navigation.goBack();
                      }
                    },
                  },
                ]
              )
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
