import { View,Text, SafeAreaView,TouchableWithoutFeedback,KeyboardAvoidingView,Keyboard,Platform} from "react-native";
import TextInputMAI from "../../components/TextInputMAI";
import ButtonMAI from "../../components/ButtonMAI";
import { styles } from "./style";
import { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../contexts/auth";

export default function ForgetPassword(){

    const [email,setEmail] = useState("");

    const {sendPasswordResetOtp} = useContext(AuthContext);
    const navegar = useNavigation();

       async function handleSendCode() {
        if (!email.trim()) {
            Alert.alert("Erro", "Por favor, insira seu e-mail.");
            return;
        }
        
        const success = await sendPasswordResetOtp(email);
        if (success) {
            navegar.navigate('VerifyResetOtp', { email: email });
        }
    }
    return(

         <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          >
          <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding': 'height'}
          >
            <SafeAreaView>
            <Text style={styles.titulo}>
                Redefinir Senha
            </Text>
            <Text style={styles.subtitulo}>
                Enviaremos um código de{'\n'}
                confirmação no seu email.
            </Text>

            <TextInputMAI
            texto="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            />

<View style={{marginTop:10}}>
            <ButtonMAI
            name="Enviar"
            limpo={true}
            onPress={handleSendCode}
            />
            <ButtonMAI
            name="Voltar"
            onPress={navegar.goBack}
            />
    </View>      
            </SafeAreaView>
            </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
    )
}