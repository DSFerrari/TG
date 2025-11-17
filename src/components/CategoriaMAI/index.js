import React, { useMemo } from 'react';
import { StyleSheet, View, Text, AccessibilityInfo } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Feather } from '@expo/vector-icons';
import theme from '../../theme';

export default function CategoriaMAI({
  items = [],
  value,
  onValueChange,
  placeholder = 'Selecione',
}) {
  const placeholderConfig = {
    label: placeholder,
    value: null,
    color: theme.COLORS.BLACK1,
  };

  const validItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return items
      .filter(item => item && item.label && item.value !== undefined)
      .map(item => ({
        ...item,
        color: theme.COLORS.BLACK1,
      }));
  }, [items]);

  const validValue = useMemo(() => {
    if (!value) return null;
    return validItems.some(i => i.value === value) ? value : null;
  }, [value, validItems]);

  const handleValueChange = (selectedValue) => {
    if (onValueChange && typeof onValueChange === 'function') {
      onValueChange(selectedValue);

      const labelSel = validItems.find(i => i.value === selectedValue)?.label;
      if (labelSel) {
        AccessibilityInfo.announceForAccessibility(
          `Categoria selecionada: ${labelSel}`
        );
      }
    }
  };

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel="Categoria, campo obrigatório"
      accessibilityHint="Toque duas vezes para escolher uma categoria"
      accessibilityRole="menu"
    >
      <Text
        style={styles.label}
        accessibilityElementsHidden={true}
        importantForAccessibility="no"
      >
        Categoria <Text style={{ color: theme.COLORS.RED1 }}>*</Text>
      </Text>

      <RNPickerSelect
        onValueChange={handleValueChange}
        items={validItems}
        value={validValue}
        placeholder={placeholderConfig}
        style={pickerSelectStyles}
        useNativeAndroidPickerStyle={false}
        Icon={() => (
          <Feather
            name="chevron-down"
            size={24}
            color="gray"
            accessibilityElementsHidden={true}
            importantForAccessibility="no"
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.WHITE3,
    borderWidth: 1,
    borderColor: theme.COLORS.BLACK1,
    borderRadius: 5,
    height: 60,
    justifyContent: 'center',
    marginBottom: -6,
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    position: 'absolute',
    top: -10,
    left: 12,
    zIndex: 1,
    backgroundColor: theme.COLORS.WHITE3,
    paddingHorizontal: 5,
    color: theme.COLORS.BLACK1,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    color: theme.COLORS.BLACK1,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: theme.COLORS.BLACK1,
  },
  iconContainer: {
    top: 18,
    right: 15,
  },
});
