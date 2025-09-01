import { useContext, useState } from "react";
import { View,Text, KeyboardAvoidingView, Image, Platform, SafeAreaView, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ScrollView} from "react-native";
import { styles } from "./styles";
import acessibilidade from "../../assets/images/acessibilidade.png"
import titulo from "../../assets/words/titulo.png"
import TextInputMAI from "../../components/TextInputMAI";
import ButtonMAI from "../../components/ButtonMAI";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../contexts/auth";

export default function SignIn(){
const [email,setEmail] = useState("");
const [senha,setSenha] = useState("");


const { signIn, loadingAuth} = useContext(AuthContext);
const navegar = useNavigation();

const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
        Alert.alert("Erro", "Por favor, preencha todos os campos!");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        Alert.alert("Erro", "Por favor, insira um email válido!");
        return;
    }

    try {
        await signIn(email, senha);
    } catch (error) {
        console.log("Erro no login:", error);
        Alert.alert("Erro", "Ocorreu um erro durante o login");
    }
};

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
    <Image style={styles.titulo}
    source={titulo}
    height={136}
    width={269}
    />
    <TextInputMAI 
    texto="Email"
    value={email}
    onChangeText={setEmail}
    keyboardType="email-address"
    />
    
    <TextInputMAI
    texto="Senha"
    secureTextEntry={true}
    value={senha}
    onChangeText={setSenha}
    />

   <TouchableOpacity style={styles.forgot} onPress={() => navegar.navigate("Esqueci minha senha")}>
      <Text style={styles.forgotText}>Esqueci minha senha</Text>
   </TouchableOpacity>
   <ButtonMAI 
   name="Entrar"
   onPress={handleLogin}
   limpo={true}/>

   <ButtonMAI 
   name="Não tenho cadastro"
   limpo={false}
   onPress={() => navegar.navigate("SignUp")}
   />

   <TouchableOpacity style={{alignSelf:'center',marginTop:34}}>
      <Image style={styles.acessibilidade}
      source={acessibilidade}
      width={64}
      height={64}
      />
   </TouchableOpacity>
    </SafeAreaView>
    </ScrollView>
   </KeyboardAvoidingView>
   </TouchableWithoutFeedback>
)
}