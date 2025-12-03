import { StyleSheet } from "react-native";
import theme from "../../theme";

export const styles = StyleSheet.create({
    container:{
        backgroundColor: theme.COLORS.WHITE3,
                flex: 1,
                alignItems: '100%',
                marginTop: -45
    },
    select:{
        backgroundColor: theme.COLORS.WHITE2,
        padding: 24,
        borderWidth:1,
        borderColor: theme.COLORS.WHITE1,
        borderRadius:12
    },
    textSelect:{
        marginLeft: 10,
        fontSize:16,
        color: theme.COLORS.BLACK1,
        fontWeight: 'bold'
    }
})