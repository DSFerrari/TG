import { Text, View } from "react-native";
import theme from "../../theme";

export default function TextPrincipal(){
    return(
        <View style={{marginTop: 60}}>
            <Text style={{alignSelf: 'center', color: theme.COLORS.BLUE1,fontSize: 57}}>
                MAI
            </Text>
            <Text style={{marginTop:10,alignSelf: 'center', color: theme.COLORS.BLUE1,fontSize: 22}}>
                Mobilidade, Acessibilidade
            </Text>
            <Text style={{alignSelf: 'center', color: theme.COLORS.BLUE1,fontSize: 22}}>
                e Inclusão.</Text>
        </View>
    )
}