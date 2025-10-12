import { Text, TouchableOpacity, TouchableWithoutFeedback,Keyboard,KeyboardAvoidingView,Platform,ScrollView,Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from "../../theme";
import { styles } from "./styles";

export default function Configuration(){

    const suport = () => {
    Alert.alert("Proximas Atualizações", 
        "Opcao será adicionada em atualizações futuras")
    }

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
        <TouchableOpacity onPress={suport} style={styles.select}>
            <Text style={styles.textSelect}>Solicitar suporte</Text>
            <Text style={{marginLeft: 10,marginTop:10, color: theme.COLORS.BLACK1}}>Fale com nossa equipe</Text>
        </TouchableOpacity>
    </SafeAreaView>
    </ScrollView>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
)
}