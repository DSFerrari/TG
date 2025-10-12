import { View,Text, TouchableWithoutFeedback,KeyboardAvoidingView,Keyboard,Platform,Alert} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

import TextInputMAI from "../../../components/TextInputMAI";
import ButtonMAI from "../../../components/ButtonMAI";
import { styles } from "../style";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/auth";

export default function Change(){
  const [senha,setSenha] = useState("");
  const [confSenha,setConfSenha] = useState("");
  const navegar = useNavigation();
  const {updateUserPassword,setLoadingAuth} = useContext(AuthContext)

  async function handleUpdatePassword() {
        if (senha !== confSenha) {
            Alert.alert("Erro", "As senhas não coincidem.");
            return;
        }
        if (senha.length < 6) {
             Alert.alert("Erro", "A senha deve ter no mínimo 6 caracteres.");
            return;
        }
        
        const success = await updateUserPassword(senha);
        if (success) {
            Alert.alert(
                "Sucesso",
                "Sua senha foi redefinida! Faça o login com sua nova senha.",
                [{ text: "OK", onPress: () => navegar.navigate('SignIn') }]
            );
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
            <TextInputMAI
            texto="Nova senha"
            value={senha}
            onChangeText={setSenha}
            />
            <TextInputMAI
            texto="Confirme a nova senha"
            value={confSenha}
            onChangeText={setConfSenha}
            />
            <View style={{marginTop:20}}>
            <ButtonMAI
            name="Confirmar"
            limpo={true}
            onPress={handleUpdatePassword}
            />
            <ButtonMAI
            name="Voltar"
            onPress={navegar.canGoBack}
            />
            </View>
            </SafeAreaView>
            </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
    )
}