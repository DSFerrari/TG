import { View, Text, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";

export default function SearchMAI({ placeholder = "Pesquisar", value, onChangeText }) {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={18} color="#4B4B4B" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#4B4B4B"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}


