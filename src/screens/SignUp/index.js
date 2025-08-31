import {Text, KeyboardAvoidingView, SafeAreaView,
Platform,
Keyboard,
TouchableWithoutFeedback,
ScrollView,
Alert
} from "react-native";
import { styles } from "./styles";
import TextInputMAI from "./../../components/TextInputMAI"
import { useContext, useState } from "react";
import ButtonMAI from "../../components/ButtonMAI";
import { useNavigation } from "@react-navigation/native";
import CheckboxDeficiencias from "../../components/CheckboxDeficiencias";
import { AuthContext } from "../../contexts/auth";


export default function SignUp(){
const [dataNascimento,setDataNascimento] = useState("");
const [nome,setNome] = useState("");
const [email,setEmail] = useState("");
const [senha,setSenha] = useState("");
const [confSenha, setConfSenha] = useState("");
const [deficienciasMultiplas, setDeficienciasMultiplas] = useState([]);

const { signUp, loadingAuth } = useContext(AuthContext);

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

const handleCadastro = async () => {
    if (!nome.trim() || !email.trim() || !senha.trim() || !confSenha.trim() || !dataNascimento.trim()) {
        Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios!");
        return;
    }

    if (senha !== confSenha) {
        Alert.alert("Erro", "As senhas não coincidem!");
        return;
    }

    const dataFormatada = converterData(dataNascimento);
    if (!dataFormatada) {
        Alert.alert("Erro", "Data de nascimento inválida!");
        return;
    }

    const deficienciasString = deficienciasMultiplas.length > 0 ? deficienciasMultiplas.join(',') : null;
try{
    await signUp(email, senha, confSenha, nome, dataFormatada, deficienciasString);
} catch (error){
    console.log(error)
}
};

const converterData = (dataInput) => {
    if (dataInput.length !== 10) return null;
    
    const [dia, mes, ano] = dataInput.split('/');
    const data = new Date(ano, mes - 1, dia);
    
    if (isNaN(data.getTime())) return null;
    
    return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
};

const handleDeficienciaChange = (value) => {
    console.log("Deficiência selecionada:", value); // Debug
    setDeficiencia(value);
    if (value !== "multipla") {
        setDeficienciasMultiplas([]);
    }
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
        <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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

               <CheckboxDeficiencias
                   selectedDeficiencias={deficienciasMultiplas}
                   onSelectionChange={setDeficienciasMultiplas}
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
           onPress={handleCadastro}
           />

           <ButtonMAI
           name="Ja tenho cadastro"
           onPress={() => navegar.goBack()}
           /> 
        </SafeAreaView>
        </ScrollView>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
)
}