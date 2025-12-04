import { Text, TouchableOpacity, TouchableWithoutFeedback,Keyboard,KeyboardAvoidingView,Platform,FlatList,Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from "../../theme";
import { styles } from "./styles";
import { AuthContext } from "../../contexts/auth";
import { useContext, useState } from "react";
import ButtonMAI from "../../components/ButtonMAI";
import TermosUsoModal from "../../components/TermoUso";

export default function Configuration(){
    const [mostrarModalTermos, setMostrarModalTermos] = useState(false);

    const items = [
        { id: 'sair', name: 'Sair', limpo: false },
        { id: 'termos', name: 'Termos de Uso', limpo: true },
    ];

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
            <SafeAreaView>
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 10 }}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => (
                        <ButtonMAI
                            name={item.name}
                            limpo={item.limpo}
                            onPress={() => {
                                if (item.id === 'sair') return handleExit();
                                if (item.id === 'termos') return setMostrarModalTermos(true);
                            }}
                        />
                    )}
                />

                <TermosUsoModal
                    visible={mostrarModalTermos}
                    onClose={() => setMostrarModalTermos(false)}
                    apenasLeitura={true}
                />
            </SafeAreaView>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
)
}