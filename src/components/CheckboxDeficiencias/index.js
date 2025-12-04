import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, AccessibilityInfo } from 'react-native';
import theme from '../../theme';

const DEFICIENCIAS_DISPONIVEIS = [
  "Deficiência Visual",
  "Deficiência Auditiva",
  "Deficiência Física",
  "Deficiência Intelectual",
];

export default function CheckboxDeficiencias({
  selectedDeficiencias,
  onSelectionChange
}) {

  const listaSegura = Array.isArray(selectedDeficiencias) ? selectedDeficiencias : [];

  const isSelected = (opcao) => {
    const termo = opcao.toLowerCase().replace("deficiência ", "").trim();
    
    return listaSegura.some(item => {
      const itemLimpo = String(item).toLowerCase().trim();
      return itemLimpo.includes(termo); 
    });
  };

  const toggleDeficiencia = (def) => {

    let novaLista;

    if (isSelected(def)) {
       const termo = def.toLowerCase().replace("deficiência ", "").trim();
       novaLista = listaSegura.filter(item => {
          const itemLimpo = String(item).toLowerCase().trim();
          return !itemLimpo.includes(termo);
       });
       AccessibilityInfo.announceForAccessibility(`${def} desmarcada.`);
    } 
    else {
      novaLista = [...listaSegura, def];
      AccessibilityInfo.announceForAccessibility(`${def} marcada.`);
    }
    
    if (onSelectionChange) {
      onSelectionChange(novaLista);
    }
  };

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityRole="tab"
      accessibilityLabel="Seleção de deficiências"
    >
      <Text
        style={styles.titulo}
        accessibilityRole="header"
      >
        Selecione suas deficiências
      </Text>

      {DEFICIENCIAS_DISPONIVEIS.map((def, index) => {
        const selected = isSelected(def);

        return (
          <TouchableOpacity
            key={index}
            style={styles.checkboxContainer}
            onPress={() => toggleDeficiencia(def)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: selected }}
            activeOpacity={0.6}
          >
            <View style={[
              styles.checkbox,
              selected && styles.checkboxSelected
            ]}>
              {selected && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>

            <Text style={styles.label}>
              {def}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: theme.COLORS.WHITE3,
    borderRadius: 8,
    marginBottom: 10, 
    shadowColor: theme.COLORS.BLACK1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  titulo: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
    color: theme.COLORS.BLACK1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    paddingVertical: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: theme.COLORS.BLACK3,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: theme.COLORS.WHITE3,
  },
  checkboxSelected: {
    backgroundColor: theme.COLORS.BLUE1,
    borderColor: theme.COLORS.BLUE1,
  },
  checkmark: {
    color: theme.COLORS.WHITE3,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: -2, 
  },
  label: {
    fontSize: 16,
    color: theme.COLORS.BLACK1,
    flex: 1,
  },
});