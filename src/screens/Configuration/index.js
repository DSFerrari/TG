import { useContext } from "react";
import { View,Text, TouchableOpacity } from "react-native";
import { AuthContext } from "../../contexts/auth";

export default function Configuration(){

const {signOut} = useContext(AuthContext);

    return(
    <View>
        <TouchableOpacity onPress={signOut}>
            <Text>Sair</Text>
        </TouchableOpacity>
    </View>
)
}