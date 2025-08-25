import {Text, KeyboardAvoidingView, SafeAreaView,
Platform,
Keyboard,
TouchableWithoutFeedback
} from "react-native";
import { styles } from "./styles";
import TextInputMAI from "./../../components/TextInputMAI"
import { useState } from "react";
import DeficienciaSelect from "../../components/PickerModal";
import ButtonMAI from "../../components/ButtonMAI";
import { useNavigation } from "@react-navigation/native";

export default function SignUp(){
const [dataNascimento,setDataNascimento] = useState("");
const [deficiencia, setDeficiencia] = useState("");
const [nome,setNome] = useState("");
const [email,setEmail] = useState("");
const [senha,setSenha] = useState("");
const [confSenha, setConfSenha] = useState("");

const formatarData = (text) => {
    const numeros = text.replace(/\D/g, '');
    
    let formatado = numeros;
    
    if (numeros.length >= 3) {
        formatado = numeros.slice(0, 2) + '/' + numeros.slice(2);
    }
    if (numeros.length >= 5) {
        formatado = numeros.slice(0, 2) + '/' + numeros.slice(2, 4) + '/' + numeros.slice(4, 8);
    }
    
    setDataNascimento(formatado);
};

const navegar = useNavigation();

return(
    <TouchableWithoutFeedback
    onPress={Keyboard.dismiss}
    >
    <KeyboardAvoidingView
     style={styles.container}
   behavior={Platform.OS === 'ios' ? 'padding': 'height'}
    >
        <SafeAreaView>
            <Text style={styles.titulo}>Cadastro</Text>
            <TextInputMAI
            texto="Nome Completo"
            value={nome}
            onChangeText={setNome}
            />

             <TextInputMAI
            texto="Data de nascimento"
            placeholder="dd/mm/aaaa"
            value={dataNascimento}
            onChangeText={formatarData}
            keyboardType="numeric"
            maxLength={10}
            />

           <DeficienciaSelect
           value={deficiencia}
           onChange={setDeficiencia}
           />

           <TextInputMAI
           texto="Email"
           value={email}
            onChangeText={setEmail}
           />

           <TextInputMAI
           texto="Senha"
           value={senha}
            onChangeText={setSenha}
           />

           <TextInputMAI
           texto="Confirme sua senha"
           value={confSenha}
            onChangeText={setConfSenha}
           />

           <ButtonMAI
           name="Cadastrar"
           limpo={true}
           />

           <ButtonMAI
           name="Ja tenho cadastro"
           onPress={() => navegar.goBack()}
           />
        </SafeAreaView>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
)
}