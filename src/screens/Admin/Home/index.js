import { Text, TouchableOpacity, TouchableWithoutFeedback,Keyboard,KeyboardAvoidingView,Platform,ScrollView,Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from "../../../theme";
import { styles } from "../styles";
import { useNavigation } from "@react-navigation/native";

export default function HomeAdmin(){
const  navegar = useNavigation();
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
        <TouchableOpacity onPress={()=> navegar.navigate('AdminUsers')} style={styles.select}>
            <Text style={styles.textSelect}>Usuários</Text>
            <Text style={{marginLeft: 10,marginTop:10, color: theme.COLORS.BLACK1}}>Lista de usuários</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> navegar.navigate('AdminEstabs')} style={styles.select}>
            <Text style={styles.textSelect}>Estabelecimento Pendentes</Text>
            <Text style={{marginLeft: 10,marginTop:10, color: theme.COLORS.BLACK1}}>Lista de estabelecimentos para aprovar</Text>
        </TouchableOpacity>
        
    </SafeAreaView>
    </ScrollView>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
)
}