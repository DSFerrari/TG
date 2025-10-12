import { TouchableOpacity, View, Text } from "react-native";
import { styles } from "./styles";
import theme from "../../theme";
import { Ionicons } from '@expo/vector-icons';

export default function ButtonMAI({name, limpo,icon, ...props}){
return(
    <View style={{marginTop: 32}}>
        <TouchableOpacity {...props} style={[styles.Button,{backgroundColor: limpo? theme.COLORS.BLUE1 : theme.COLORS.WHITE3}]}>
            {icon && <Ionicons name={icon} size={20} color={theme.COLORS.BLACK1} style={styles.icon}/>}
            <Text style={[styles.ButtonText,{color: limpo? theme.COLORS.WHITE3 : theme.COLORS.BLUE1}]}>
            {name}
            </Text>
        </TouchableOpacity>
    </View>
)
}