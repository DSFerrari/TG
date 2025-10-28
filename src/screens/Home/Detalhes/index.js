import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; 
import ButtonMAI from '../../../components/ButtonMAI';
import theme from '../../../theme';
import { useLayoutEffect } from 'react';
import { styles } from './styles';

export default function Detalhes() {
    const route = useRoute();
    const navigation = useNavigation();
    const { estabelecimento } = route.params;
     useLayoutEffect(() => {
        navigation.setOptions({
            title: estabelecimento.nome,
        });
    }, [navigation, estabelecimento.nome]);




    const renderStars = (rating) => {
        let stars = [];
        const roundedRating = Math.round(rating);
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <MaterialIcons
                    key={i}
                    name={i <= roundedRating ? "star" : "star-border"}
                    size={28}
                    color="#FFD700"
                />
            );
        }
        return <View style={styles.ratingContainer}>{stars}</View>;
    };

    return (
        <SafeAreaView style={styles.container}>

            <ScrollView>
                
                <Image 
                    source={{ uri: estabelecimento.url_foto }} 
                    style={styles.image} 
                />

                <View style={styles.content}>
                    
                    {renderStars(estabelecimento.avaliacao || 0)}
                    <Text style={styles.category}>{estabelecimento.categoria || "Sem categoria"}</Text>

                    {typeof estabelecimento.acessibilidades === 'string' && estabelecimento.acessibilidades.trim() !== '' && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Recursos de acessibilidade</Text>
                            
                            {estabelecimento.acessibilidades.split(',').map((item, index) => (
                                item.trim() !== '' && (
                                  <Text key={index} style={styles.itemText}>• {item.trim()}</Text>
                                )
                            ))}
                        </View>
                    )}
                  
                    {estabelecimento.endereco && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Endereço</Text>
                            <Text style={styles.itemText}>{estabelecimento.endereco}</Text>
                        </View>
                    )}

                    <View style={{marginTop:-20 }}>
                        <ButtonMAI
                            name="Remover favorito"
                            onPress={() => Alert.alert("Aviso", "Função 'Remover favorito' ainda não implementada.")}
                        />
                            </View>
                            <View style={{marginTop:-20 }}>
                        <ButtonMAI
                            name="Avaliações"
                            onPress={() => Alert.alert("Aviso", "Navegação para 'Avaliações' ainda não implementada.")}
                        />
                        </View>
                        <View style={{marginTop:-20 }}>
                        <ButtonMAI
                            name="Editar estabelecimento"
                            onPress={() => Alert.alert("Aviso", "Navegação para 'Editar' ainda não implementada.")}
                        />

                    </View>
                    </View>
            </ScrollView>
        </SafeAreaView>
    );
}
