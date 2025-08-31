import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import theme from '../../theme';

const deficienciasDisponiveis = [
    "Deficiência Visual",
    "Deficiência Auditiva",
    "Deficiência Física",
];

export default function CheckboxDeficiencias({ selectedDeficiencias, onSelectionChange }) {
    const toggleDeficiencia = (deficiencia) => {
        const isSelected = selectedDeficiencias.includes(deficiencia);
        
        if (isSelected) {
            onSelectionChange(selectedDeficiencias.filter(item => item !== deficiencia));
        } else {
            onSelectionChange([...selectedDeficiencias, deficiencia]);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Selecione suas deficiências:</Text>
            {deficienciasDisponiveis.map((deficiencia, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.checkboxContainer}
                    onPress={() => toggleDeficiencia(deficiencia)}
                >
                    <View style={[
                        styles.checkbox,
                        selectedDeficiencias.includes(deficiencia) && styles.checkboxSelected
                    ]}>
                        {selectedDeficiencias.includes(deficiencia) && (
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