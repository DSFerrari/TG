import { View, TextInput, AccessibilityInfo } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";
import theme from "../../theme";
import React from "react";

export default function SearchMAI({
  placeholder = "Pesquisar",
  value,
  onChangeText
}) {
  
  function handleChange(text) {
    onChangeText?.(text);

    // Feedback verbal a cada atualização
    if (text.length === 1) {
      AccessibilityInfo.announceForAccessibility("Digitando...");
    }
  }

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel="Campo de busca"
      accessibilityRole="search"
      accessibilityHint="Digite para buscar estabelecimentos"
    >
      <Ionicons
        name="search-outline"
        size={18}
        color="#4B4B4B"
        style={styles.icon}
        accessibilityLabel="Ícone de busca"
        accessible={false}
      />
      
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={theme.COLORS.BLACK1}
        value={value}
        onChangeText={handleChange}
        returnKeyType="search"
        accessibilityLabel="Digite sua busca"
        accessibilityHint="Resultados são filtrados automaticamente"
        accessibilityRole="search"
        importantForAccessibility="yes"
      />
    </View>
  );
}
