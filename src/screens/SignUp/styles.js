import { StyleSheet } from "react-native";
import theme from "../../theme";

export const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingHorizontal: 24,
        backgroundColor: theme.COLORS.WHITE3
    },
    titulo:{
        marginTop:10,
        color: theme.COLORS.BLUE1,
        fontSize:22,
        alignSelf: 'center'
    },
})