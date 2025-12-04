import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  AccessibilityInfo,
  findNodeHandle
} from "react-native";
import theme from "../../theme";
import { categoryItems } from "../../screens/Home/CadastrarEstabelecimento/categoryItems";

const ACESSIBILIDADES = [
  "Piso tátil",
  "Elevador",
  "Intérprete de Libras",
  "Fraldário",
  "Banheiro acessível",
  "Rampas de acesso",
  "Portas largas",
  "Sinalização em Braille",
  "Alarme visual e sonoro",
  "Balcão rebaixado",
];

export default function FilterModal({ visible, onClose, onApply }) {
  const [categoria, setCategoria] = useState(null);
  const [distancia, setDistancia] = useState(null);
  const [avaliacao, setAvaliacao] = useState(null);
  const [acessibilidades, setAcessibilidades] = useState([]);

  const titleRef = useRef(null);

  const distancias = ["0–2km", "2–5km", "5–10km", "10–20km", "20km+"];
  const avaliacoes = [
    { label: "5 estrelas", value: 5 },
    { label: "4 estrelas ou mais", value: 4 },
    { label: "3 estrelas ou mais", value: 3 },
    { label: "2 estrelas ou mais", value: 2 },
    { label: "1 estrela ou mais", value: 1 },
  ];

  useEffect(() => {
    if (visible && titleRef.current) {
      const reactTag = findNodeHandle(titleRef.current);
      if (reactTag) {
        setTimeout(() => {
          AccessibilityInfo.setAccessibilityFocus(reactTag);
          AccessibilityInfo.announceForAccessibility("Filtros abertos.");
        }, 50);
      }
    } else if (!visible) {
      AccessibilityInfo.announceForAccessibility("Filtros fechados.");
    }
  }, [visible]);

  function limparTudo() {
    setCategoria(null);
    setDistancia(null);
    setAvaliacao(null);
    setAcessibilidades([]);
    AccessibilityInfo.announceForAccessibility("Filtros limpos.");
  }

  function confirmar() {
    onApply({
      categoria,
      distancia,
      avaliacao,
      acessibilidades,
    });
    AccessibilityInfo.announceForAccessibility("Filtros aplicados.");
    onClose();
  }

  function toggleChip(previous, value) {
    const next = previous === value ? null : value;
    AccessibilityInfo.announceForAccessibility(
      next
        ? `Selecionado: ${value}`
        : `Removido: ${value}`
    );
    return next;
  }

  function toggleMultiChip(array, item) {
    const exists = array.includes(item);
    AccessibilityInfo.announceForAccessibility(
      exists
        ? `${item} removido`
        : `${item} selecionado`
    );
    return exists
      ? array.filter((i) => i !== item)
      : [...array, item];
  }

  function renderSingleSelector(label, selectedValue, list, setter) {
    return (
      <>
        <Text
          style={styles.sectionTitle}
          accessibilityRole="header"
        >
          {label}
        </Text>

        <FlatList
          horizontal
          data={list}
          keyExtractor={(item) =>
            typeof item === "object" ? item.value : item
          }
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 5 }}
          renderItem={({ item }) => {
            const isObj = typeof item === "object";
            const val = isObj ? item.value : item;
            const txt = isObj ? item.label : item;
            const active = selectedValue === val;

            return (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={txt}
                accessibilityHint="Toque para selecionar ou remover"
                accessibilityState={{ selected: active }}
                focusable={true}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setter(prev => toggleChip(prev, val))}
              >
                <Text
                  style={[
                    styles.chipText,
                    active && styles.chipTextActive
                  ]}
                >
                  {txt}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </>
    );
  }

  function renderMultiSelector(label, selectedArray, list, setter) {
    return (
      <>
        <Text
          style={styles.sectionTitle}
          accessibilityRole="header"
        >
          {label}
        </Text>

        <FlatList
          horizontal
          data={list}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 5 }}
          renderItem={({ item }) => {
            const active = selectedArray.includes(item);

            return (
              <TouchableOpacity
                accessibilityRole="checkbox"
                accessibilityState={{ checked: active }}
                accessibilityLabel={item}
                accessibilityHint="Toque para selecionar ou remover"
                focusable={true}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() =>
                  setter(prev => toggleMultiChip(prev, item))
                }
              >
                <Text
                  style={[
                    styles.chipText,
                    active && styles.chipTextActive
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      accessibilityViewIsModal={true}
    >
      <View
        style={styles.overlay}
        accessible={true}
        accessibilityLabel="Caixa de filtros"
      >
        <View style={styles.container}>
          <Text
            ref={titleRef}
            style={styles.title}
            accessibilityRole="header"
          >
            Filtros
          </Text>

          <TouchableOpacity
            style={styles.clearButton}
            accessibilityRole="button"
            accessibilityLabel="Limpar todos os filtros"
            accessibilityHint="Remove todas as seleções"
            onPress={limparTudo}
          >
            <Text style={styles.clearText}>Limpar tudo</Text>
          </TouchableOpacity>

          {renderSingleSelector("Categoria", categoria, categoryItems, setCategoria)}
          {renderSingleSelector("Distância", distancia, distancias, setDistancia)}
          {renderSingleSelector("Avaliação", avaliacao, avaliacoes, setAvaliacao)}
          {renderMultiSelector("Acessibilidades", acessibilidades, ACESSIBILIDADES, setAcessibilidades)}

          <TouchableOpacity
            style={styles.confirmButton}
            accessibilityRole="button"
            accessibilityLabel="Aplicar filtros"
            accessibilityHint="Confirma as opções escolhidas"
            onPress={confirmar}
          >
            <Text style={styles.confirmText}>Aplicar filtros</Text>
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Fechar filtros"
            accessibilityHint="Fecha a caixa de filtros sem aplicar"
            onPress={onClose}
          >
            <Text style={styles.closeText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: theme.COLORS.WHITE3,
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 35,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
    color: theme.COLORS.BLACK1,
  },
  clearButton: {
    borderWidth: 1,
    borderColor: theme.COLORS.BLUE1,
    borderRadius: 25,
    alignSelf: "center",
    paddingVertical: 6,
    paddingHorizontal: 25,
    marginVertical: 10,
  },
  clearText: {
    color: theme.COLORS.BLUE1,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 6,
    color: theme.COLORS.BLACK2,
  },
  chip: {
    borderWidth: 1,
    borderColor: theme.COLORS.WHITE1,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: theme.COLORS.BLUE1,
    borderColor: theme.COLORS.BLUE1,
  },
  chipText: {
    color: theme.COLORS.BLACK3,
    fontSize: 14,
  },
  chipTextActive: {
    color: theme.COLORS.WHITE3,
    fontWeight: "600",
  },
  confirmButton: {
    marginTop: 25,
    backgroundColor: theme.COLORS.BLUE1,
    paddingVertical: 12,
    borderRadius: 25,
  },
  confirmText: {
    color: theme.COLORS.WHITE3,
    textAlign: "center",
    fontWeight: "600",
  },
  closeText: {
    textAlign: "center",
    color: theme.COLORS.BLACK2,
    marginTop: 10,
    fontSize: 15,
  },
});