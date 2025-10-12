import { View,Text, TouchableWithoutFeedback,KeyboardAvoidingView,Keyboard,Platform} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

import TextInputMAI from "../../../components/TextInputMAI";
import ButtonMAI from "../../../components/ButtonMAI"
import { styles } from "../style";
import { useContext,useState } from "react";
import { AuthContext } from "../../../contexts/auth";
import { useNavigation, useRoute } from "@react-navigation/native";


export default function Confirm(){
const [token, setToken] = useState('');
    const { verifyPasswordResetOtp, loadingAuth } = useContext(AuthContext);
    const route = useRoute();
    const navegar = useNavigation();
    const { email } = route.params;


      async function handleVerifyCode() {
        if (!token.trim() || token.length < 6) {
            Alert.alert("Erro", "Insira um código válido.");
            return;
        }
        
        const success = await verifyPasswordResetOtp(email, token);
        if (success) {
                navegar.navigate('UpdatePassword');
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
                Insira o código enviado
            </Text>
            <TextInputMAI
            texto="Código"
             value={token}
            onChangeText={setToken}
            keyboardType="numeric"
            maxLength={6}
            />
            <ButtonMAI
            name="Confirmar"
            limpo={true}
            onPress={handleVerifyCode}
            />

            <ButtonMAI
            name="Voltar"
            onPress={navegar.goBack}
            />
            </SafeAreaView>
            </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
    )
}