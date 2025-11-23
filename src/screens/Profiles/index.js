import { useContext, useEffect, useState } from "react";
import {Image,TouchableWithoutFeedback,Keyboard,KeyboardAvoidingView,Platform,ScrollView,} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthContext } from "../../contexts/auth";
import { styles } from "./styles";
import ButtonMAI from "../../components/ButtonMAI"
import Campget from "../../components/Campget";
import { useNavigation } from "@react-navigation/native";


export default function ProfileScreen({ route }) {
  const { user } = useContext(AuthContext);

  const stack = useNavigation();

  const [profile, setProfile] = useState({
    nome: user?.user_metadata?.full_name || "",
    nascimento: user?.user_metadata?.birth_date || "",
    deficiencia: user?.user_metadata?.disability || [],
    avatar_url: user?.user_metadata?.avatar_url || "",
    email: user?.user_metadata?.email || "",
  });

  useEffect(() => {
    setProfile({
      nome: user?.user_metadata?.full_name || "",
      nascimento: user?.user_metadata?.birth_date || "",
      deficiencia: user?.user_metadata?.disability || [],
      avatar_url: user?.user_metadata?.avatar_url || "",
      email: user?.user_metadata?.email || "",
    });
  }, [user, route.params?.refreshUser]);

   const formatDate = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

  return (
       <TouchableWithoutFeedback
       onPress={Keyboard.dismiss}
       >
       <KeyboardAvoidingView
       style={styles.container}
       behavior={Platform.OS === 'ios' ? 'padding': 'height'}
       >
        <SafeAreaView style={{flex: 1}}>
           <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  style={{flex: 1}}
                  >
        {profile.avatar_url ? (
          <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
        ) : (
          <Image
  source={{
    uri: profile.avatar_url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  }}
  style={styles.avatar}
/>
        )}

        <ButtonMAI
        name="Minhas Solicitações"
        onPress={()=> stack.navigate("MinhasSolicitacoes")}
        />

        <ButtonMAI
        name="Editar perfil"
        icon="pencil-outline"
        onPress={()=> stack.navigate("Editar Perfil")}
        />

        <Campget
        campo="Nome"
        dado={profile.nome}
        />

        <Campget
        campo="Email"
        dado={profile.email}
        />

        <Campget
        campo="Data de Nascimento"
        dado={formatDate(profile.nascimento)}
        />

        <Campget
        campo="Deficiência"
        dado={profile.deficiencia && Array.isArray(profile.deficiencia) && profile.deficiencia.length > 0
      ? profile.deficiencia.join(', ')
      : profile.deficiencia || "Não informado"
  }
        />

     </ScrollView>
      </SafeAreaView>
     </KeyboardAvoidingView>
     </TouchableWithoutFeedback>
  );
}
