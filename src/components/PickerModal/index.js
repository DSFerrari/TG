import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { styles } from "./styles";
const data = [
  { label: "Deficiência Visual", value: "visual" },
  { label: "Deficiência Auditiva", value: "auditiva" },
  { label: "Deficiência Física", value: "fisica" },
  { label: "Deficiência Intelectual", value: "intelectual" },
  { label: "Deficiência Múltipla", value: "multipla" },
];

export default function DeficienciaSelect({ value, onChange }) {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={styles.container}>
      {/* Label acima do select */}
      <Text style={[styles.label, isFocus && { color: "#6200ee" }]}>
        Deficiência
      </Text>

      {/* Dropdown */}
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "#6200ee" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={data}
        maxHeight={250}
        labelField="label"
        valueField="value"
        placeholder={!isFocus && !value ? "Selecione" : ""}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          onChange(item.value);
          setIsFocus(false);
        }}
      />
    </View>
  );
}