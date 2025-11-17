import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, AccessibilityInfo } from 'react-native';
import theme from '../../theme';

const ACESSIBILIDADES_DISPONIVEIS = [
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

const explodeAndClean = (value) => {
  if (!value) return [];
  const parts = String(value)
    .split(/[,;\/\|]|(\s+e\s+)/i)
    .map(s => s && String(s).trim())
    .filter(Boolean);
  return parts;
};

const normalizeArray = (input) => {
  if (!input) return [];
  const arr = Array.isArray(input) ? input : [input];

  const seen = new Set();
  const result = [];

  arr.flatMap(item => explodeAndClean(item)).forEach(item => {
    const key = item
      .normalize('NFKD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase();

    if (!seen.has(key)) {
      seen.add(key);

      const titleCase = item
        .toLowerCase()
        .split(' ')
        .filter(Boolean)
        .map(s => s[0].toUpperCase() + s.slice(1))
        .join(' ');
      result.push(titleCase);
    }
  });

  return result;
};

export default function CheckboxAcessibilidade({ selectedAcessibilidade = [], onSelectionChange }) {

  const normalizedSelected = useMemo(
    () => normalizeArray(selectedAcessibilidade),
    [selectedAcessibilidade]
  );

  const isSelected = (def) => {
    const key = def.normalize('NFKD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    return normalizedSelected.some(
      s => s.normalize('NFKD').replace(/\p{Diacritic}/gu, '').toLowerCase() === key
    );
  };

  const toggleAcessibilidade = (acessibilidade) => {
    const current = normalizeArray(selectedAcessibilidade);
    const already = current.findIndex(d =>
      d.normalize('NFKD').replace(/\p{Diacritic}/gu, '').toLowerCase() ===
      acessibilidade.normalize('NFKD').replace(/\p{Diacritic}/gu, '').toLowerCase()
    );

    let next;
    let ativado = false;

    if (already >= 0) {
      next = current.filter((_, idx) => idx !== already);
    } else {
      next = [...current, acessibilidade];
      ativado = true;
    }

    onSelectionChange(next);

    AccessibilityInfo.announceForAccessibility(
      ativado
        ? `${acessibilidade} marcada`
        : `${acessibilidade} desmarcada`
    );
  };

  return (
    <View style={styles.container} accessible={true}>
      <Text
        style={styles.titulo}
        accessibilityRole="header"
        accessibilityLabel="Opções de acessibilidade"
      >
        Acessibilidade
      </Text>

      {ACESSIBILIDADES_DISPONIVEIS.map((item, index) => {
        const selected = isSelected(item);

        return (
          <TouchableOpacity
            key={index}
            style={styles.checkboxContainer}
            onPress={() => toggleAcessibilidade(item)}
            accessibilityRole="checkbox"
            accessibilityLabel={item}
            accessibilityState={{ checked: selected }}
            accessibilityHint="Toque duas vezes para marcar ou desmarcar"
            focusable={true}
            activeOpacity={0.6}
          >
            <View style={[
              styles.checkbox,
              selected && styles.checkboxSelected
            ]}>
              {selected && (
                <Text
                  style={styles.checkmark}
                  accessibilityElementsHidden
                  importantForAccessibility="no"
                >
                  ✓
                </Text>
              )}
            </View>
            <Text
              style={styles.label}
              accessibilityElementsHidden
              importantForAccessibility="no"
            >
              {item}
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
    marginBottom: -20,
  },
  titulo: {
    fontSize: 16,
    marginBottom: 10,
    color: theme.COLORS.BLACK1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: theme.COLORS.BLACK3,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  checkboxSelected: {
    backgroundColor: theme.COLORS.BLUE1,
    borderColor: theme.COLORS.BLUE1,
  },
  checkmark: {
    color: theme.COLORS.WHITE3,
    fontSize: 14,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    color: theme.COLORS.BLACK1,
    flex: 1,
  },
});
