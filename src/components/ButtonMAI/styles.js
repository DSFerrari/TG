import { StyleSheet } from "react-native"
import theme from "../../theme"

export const styles = StyleSheet.create({
    Button:{
        padding: 10,
        borderColor: theme.COLORS.BLUE1,
        borderWidth:1,
        borderRadius:40
    },
    ButtonText:{
        alignSelf:'center',
        fontSize:14,
        fontWeight: 'bold'
    }
})