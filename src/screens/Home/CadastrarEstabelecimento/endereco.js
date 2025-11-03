import {
  FlatList,
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import TextInputMAI from "../../../components/TextInputMAI";

const GOOGLE_API_KEY = "AIzaSyByIa7Jw0mi4HGPjXQx8mzp_GH2QFvGsa8";

export default function EnderecoAutocomplete({ endereco, setEndereco, setCoords }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (endereco && endereco !== query) {
      setQuery(endereco);
    }
  }, [endereco]);

  const handleChange = (text) => {
    setQuery(text);
    setEndereco(text);
  };

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
            query
          )}&language=pt-BR&components=country:br&key=${GOOGLE_API_KEY}`
        );
        const data = await response.json();
        setResults(data.predictions || []);
      } catch (err) {
        console.log("Erro no autocomplete:", err);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchSuggestions, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = async (placeId, description) => {
    setEndereco(description);
    setQuery(description);
    setResults([]);

    try {
      const detailsRes = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}&language=pt-BR`
      );
      const details = await detailsRes.json();
      const location = details.result.geometry.location;

      setCoords({
        latitude: location.lat,
        longitude: location.lng,
      });
    } catch (error) {
      console.log("Erro ao buscar detalhes:", error);
    }
  };

  return (
    <View style={{ marginBottom: 10 }}>
      <TextInputMAI
        value={query}
        onChangeText={handleChange}
        texto="Digite o endereço"
      />

      {loading && <ActivityIndicator size="small" style={{ marginTop: 8 }} />}

      {results.length > 0 && (
        <FlatList
          data={results}
          scrollEnabled={false}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelect(item.place_id, item.description)}
              style={{
                backgroundColor: "#fff",
                padding: 10,
                borderBottomWidth: 1,
                borderColor: "#eee",
              }}
            >
              <Text>{item.description}</Text>
            </TouchableOpacity>
          )}
          style={{
            maxHeight: 150,
            marginTop: 5,
            borderRadius: 8,
            backgroundColor: "#fff",
          }}
        />
      )}
    </View>
  );
}
