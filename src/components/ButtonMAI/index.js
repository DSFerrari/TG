import { TouchableOpacity, View, Text } from "react-native";
import { styles } from "./styles";
import theme from "../../theme";

export default function ButtonMAI({name, limpo, ...props}){
return(
    <View style={{marginTop: 32}}>
        <TouchableOpacity {...props} style={[styles.Button,{backgroundColor: limpo? theme.COLORS.BLUE1 : theme.COLORS.WHITE3}]}>
            <Text style={[styles.ButtonText,{color: limpo? theme.COLORS.WHITE3 : theme.COLORS.BLUE1}]}>
            {name}
            </Text>
        </TouchableOpacity>
    </View>
)
}