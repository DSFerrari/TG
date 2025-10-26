import { useState } from "react";
import { View,Text, Alert} from "react-native";
import { KeyboardAvoidingView, Image, Platform, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ScrollView} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from "./styles";
import ButtonMAI from '../../components/ButtonMAI';
import SearchMAI from "../../components/SearchMAI";
import CardMAI from "../../components/CardMAI";


export default function Home(){

const [search, setSearch] = useState("");


return(
    <TouchableWithoutFeedback
       onPress={Keyboard.dismiss}
       >
       <KeyboardAvoidingView
       style={styles.container}
       behavior={Platform.OS === 'ios' ? 'padding': 'height'}
       >
           <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  >
        <SafeAreaView>
            <SearchMAI
            value={search}
            onChangeText={setSearch}
            />
            <ButtonMAI
            name="Filtros"
            icon={"menu"}
            />
            <View style={{marginTop: -10}}>
            <ButtonMAI
            name="Novo Estabelecimento"
            icon={"add"}
            limpo={true}
            />
            </View>

      <CardMAI
        nome="Hopi Hari"
        distancia="~55 km"
        categoria="Parque"
        imagem={require('../../assets/images/hopi hari.jpg')}
        avaliacao={0.5}
        onPress={() => Alert.alert('Plaza Shopping Itu')}
      />

      <CardMAI
        nome="Hopi Hari"
        distancia="~55 km"
        categoria="Parque"
        imagem={require('../../assets/images/teste.jpg')}
        avaliacao={0.5}
        onPress={() => Alert.alert('Plaza Shopping Itu')}
      />

        </SafeAreaView>
        </ScrollView>
       </KeyboardAvoidingView>
       </TouchableWithoutFeedback>
)
}