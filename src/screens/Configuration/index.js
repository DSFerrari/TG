import { Text, TouchableOpacity, TouchableWithoutFeedback,Keyboard,KeyboardAvoidingView,Platform,ScrollView,Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from "../../theme";
import { styles } from "./styles";
import { AuthContext } from "../../contexts/auth";
import { useContext } from "react";

export default function Configuration(){

    const suport = () => {
    Alert.alert("Proximas Atualizações", 
        "Opcao será adicionada em atualizações futuras")
    }

    const {signOut, loadingAuth } = useContext(AuthContext);
    const handleExit = () => {
        Alert.alert(
            "Confirmar Saída",
            "Você tem certeza que deseja sair?",
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Sair', 
                    onPress: () => signOut(),
                    style: 'destructive' 
                },
            ]
        );
    };

    return(
         <TouchableWithoutFeedback
           onPress={Keyboard.dismiss}
           >
           <KeyboardAvoidingView
           style={styles.container}
           behavior={Platform.OS === 'ios' ? 'padding': 'height'}
           >
               <ScrollView
                      showsVerticalScrollIndicator={false}
                      keyboardShouldPersistTaps="handled"
                      >
            <SafeAreaView>
        <TouchableOpacity onPress={handleExit} style={styles.select}>
            <Text style={styles.textSelect}>Sair</Text>
        </TouchableOpacity>
        
    </SafeAreaView>
    </ScrollView>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
)
}