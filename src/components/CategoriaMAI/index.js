import React from 'react';
import { StyleSheet, View,Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Feather } from '@expo/vector-icons';
import theme from '../../theme';

export default function CategoriaMAI({ items, value, onValueChange, placeholder = "Selecione" }) {
  

  const placeholderConfig = {
    label: placeholder,
    value: null,
    color: theme.COLORS.BLACK1,
  };

  return (
    <View style={styles.container}>

        <Text style={styles.textCategoria}>Categoria
            <Text style={{color: theme.COLORS.RED1}}> *</Text>
        </Text>
      <RNPickerSelect
        onValueChange={onValueChange}
        items={items}
        value={value}
        placeholder={placeholderConfig}
        style={pickerSelectStyles}
        useNativeAndroidPickerStyle={false}
        Icon={() => {
          return <Feather name="chevron-down" size={24} color="gray" style={styles.icon} />;
        }}
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
  icon: {
    top: 12,
    right: 15,
  },
  textCategoria:{
    fontSize: 14,
    fontWeight: '400',
    position: 'absolute',
    top: -10,
    left: 12,
    color: theme.COLORS.BLACK1,
    zIndex: 1,
    backgroundColor: theme.COLORS.WHITE3,
    paddingHorizontal: 5,
  }
});


const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    color: 'black',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: 'black',
  },
});