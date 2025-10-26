import { useState } from "react";
import { View,Text, Alert} from "react-native";
import { KeyboardAvoidingView, Image, Platform, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ScrollView} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from "./styles";
import ButtonMAI from '../../components/ButtonMAI';
import SearchMAI from "../../components/SearchMAI";
import CardMAI from "../../components/CardMAI";


export default function Favorites(){

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
        </SafeAreaView>
        </ScrollView>
       </KeyboardAvoidingView>
       </TouchableWithoutFeedback>
)
}