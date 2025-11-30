import React, { useContext } from "react";
import { Image, FlatList, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from "@react-navigation/native";

import { AuthContext } from "../../contexts/auth";
import { styles } from "./styles";
import ButtonMAI from "../../components/ButtonMAI";
import Campget from "../../components/Campget";
import theme from "../../theme";

export default function ProfileScreen() {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  const formatDate = (dateString) => {
    if (!dateString) return "Não informado";
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatDisability = (disability) => {
    if (Array.isArray(disability) && disability.length > 0) {
      return disability.join(', ');
    }
    return disability || "Não informado";
  };

  const metadata = user?.user_metadata || {};
  
  const profileData = [
    { 
      id: '1', 
      label: 'Nome', 
      value: metadata.full_name 
    },
    { 
      id: '2', 
      label: 'Email', 
      value: metadata.email || user?.email 
    },
    { 
      id: '3', 
      label: 'Data de Nascimento', 
      value: formatDate(metadata.birth_date) 
    },
    { 
      id: '4', 
      label: 'Deficiência', 
      value: formatDisability(metadata.disability) 
    },
  ];

  const renderHeader = () => (
    <View>
      <Image
        source={{
          uri: metadata.avatar_url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
        }}
        style={styles.avatar}
      />

      <ButtonMAI
        name="Minhas Solicitações"
        onPress={() => navigation.navigate("MinhasSolicitacoes")}
      />

      <ButtonMAI
      name="Minhas Avaliações"
      onPress={() => navigation.navigate("MinhasAvaliacoes")}
      />
      
      <ButtonMAI
        name="Meus Estabelecimentos"
        onPress={() => navigation.navigate("MeusEstabelecimentos")}
      />

      <ButtonMAI
        name="Editar perfil"
        icon="pencil-outline"
        onPress={() => navigation.navigate("Editar Perfil")}
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, backgroundColor: theme.COLORS.WHITE3 }}>
      <FlatList
        data={profileData}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        
        ListHeaderComponent={renderHeader}
        
        renderItem={({ item }) => (
          <Campget
            campo={item.label}
            dado={item.value || "Não informado"}
          />
        )}
      />
    </SafeAreaView>
  );
}