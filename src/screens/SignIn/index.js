import { useState } from "react";
import { View,Text, KeyboardAvoidingView, Image, Platform, SafeAreaView, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard} from "react-native";
import { styles } from "./styles";
import acessibilidade from "../../assets/images/acessibilidade.png"
import titulo from "../../assets/words/titulo.png"
import theme from "../../theme";
import TextInputMAI from "../../components/TextInputMAI";
import ButtonMAI from "../../components/ButtonMAI";
import { useNavigation } from "@react-navigation/native";

export default function SignIn(){
const [email,setEmail] = useState("");
const [senha,setSenha] = useState("");

const navegar = useNavigation()
return(
   <TouchableWithoutFeedback
   onPress={Keyboard.dismiss}
   >
   <KeyboardAvoidingView
   style={styles.container}
   behavior={Platform.OS === 'ios' ? 'padding': 'height'}
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

   <TouchableOpacity style={styles.forgot}>
      <Text style={styles.forgotText}>Esqueci minha senha</Text>
   </TouchableOpacity>
   <ButtonMAI 
   name="Entrar"
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
   </KeyboardAvoidingView>
   </TouchableWithoutFeedback>
)
}