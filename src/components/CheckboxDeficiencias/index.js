import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import theme from '../../theme';

const DEFICIENCIAS_DISPONIVEIS = [
  "Deficiência Visual",
  "Deficiência Auditiva",
  "Deficiência Física",
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

export default function CheckboxDeficiencias({ selectedDeficiencias = [], onSelectionChange }) {

  const normalizedSelected = useMemo(
    () => normalizeArray(selectedDeficiencias),
    [selectedDeficiencias]
  );

  const isSelected = (def) => {

    const key = def.normalize('NFKD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    return normalizedSelected.some(s => s.normalize('NFKD').replace(/\p{Diacritic}/gu, '').toLowerCase() === key);
  };

 const toggleDeficiencia = (deficiencia) => {
  const current = normalizeArray(selectedDeficiencias);
  const already = current.findIndex(d => 
    d.normalize('NFKD').replace(/\p{Diacritic}/gu, '').toLowerCase() === 
    deficiencia.normalize('NFKD').replace(/\p{Diacritic}/gu, '').toLowerCase()
  );

  let next;
  if (already >= 0) {
    next = current.filter((_, idx) => idx !== already);
  } else {
    next = [...current, deficiencia];
  }

  onSelectionChange(next);
};

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Selecione suas deficiências:</Text>
      {DEFICIENCIAS_DISPONIVEIS.map((deficiencia, index) => (
        <TouchableOpacity
          key={index}
          style={styles.checkboxContainer}
          onPress={() => toggleDeficiencia(deficiencia)}
        >
          <View style={[
            styles.checkbox,
            isSelected(deficiencia) && styles.checkboxSelected
          ]}>
            {isSelected(deficiencia) && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </View>
          <Text style={styles.label}>{deficiencia}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: theme.COLORS.WHITE3,
    borderRadius: 8,
    marginBottom: -20
  },
  titulo: {
    fontSize: 16,
    marginBottom: 10,
    color: theme.COLORS.BLACK1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: theme.COLORS.BLACK3,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
  },
  checkboxSelected: {
    backgroundColor: theme.COLORS.BLUE1,
    borderColor: theme.COLORS.BLUE1,
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    color: theme.COLORS.BLACK1,
    flex: 1,
  },
});
