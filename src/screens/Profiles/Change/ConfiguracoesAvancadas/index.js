import { useContext } from "react";
import { View,Text, TouchableOpacity, TouchableWithoutFeedback,Keyboard,KeyboardAvoidingView,Platform,ScrollView,Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthContext } from "../../../../contexts/auth";
import theme from "../../../../theme";
import { styles } from "./styles";

export default function ConfiguracoesAvancadas(){

const {signOut,deleteAccount, loadingAuth } = useContext(AuthContext);
    const handleDelete = () => {
        Alert.alert(
            "Confirmar Exclusão",
            "Você tem certeza que deseja excluir sua conta permanentemente? Esta ação não pode ser desfeita.",
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Excluir', 
                    onPress: () => deleteAccount(),
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
               <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
                      showsVerticalScrollIndicator={false}
                      keyboardShouldPersistTaps="handled"
                      >
            <SafeAreaView>
        <TouchableOpacity onPress={handleDelete} style={styles.select}>
            <Text style={styles.textSelect}>Excluir Conta</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={signOut} style={styles.select}>
            <Text style={styles.textSelect}>Sair</Text>
        </TouchableOpacity>
    </SafeAreaView>
    </ScrollView>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
)
}