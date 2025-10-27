import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
    return normalizedSelected.some(s => s.normalize('NFKD').replace(/\p{Diacritic}/gu, '').toLowerCase() === key);
  };

 const toggleAcessibilidade = (acessibilidade) => {
  const current = normalizeArray(selectedAcessibilidade);
  const already = current.findIndex(d => 
    d.normalize('NFKD').replace(/\p{Diacritic}/gu, '').toLowerCase() === 
    acessibilidade.normalize('NFKD').replace(/\p{Diacritic}/gu, '').toLowerCase()
  );

  let next;
  if (already >= 0) {
    next = current.filter((_, idx) => idx !== already);
  } else {
    next = [...current, acessibilidade];
  }

  onSelectionChange(next);
};

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Acessibilidade:</Text>
      {ACESSIBILIDADES_DISPONIVEIS.map((acessibilidade, index) => (
        <TouchableOpacity
          key={index}
          style={styles.checkboxContainer}
          onPress={() => toggleAcessibilidade(acessibilidade)}
        >
          <View style={[
            styles.checkbox,
            isSelected(acessibilidade) && styles.checkboxSelected
          ]}>
            {isSelected(acessibilidade) && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </View>
          <Text style={styles.label}>{acessibilidade}</Text>
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
