import { StyleSheet } from "react-native"
import theme from '../../theme';

export const styles = StyleSheet.create({
    container:{
        backgroundColor: theme.COLORS.WHITE3,
        flex: 1,
        paddingHorizontal:24
    },
    titulo:{
        marginTop: 50,
        alignSelf: 'center',
        marginBottom: 24
    },
    forgotText:{
        textDecorationLine:'underline',
        alignSelf: 'center',
        color: theme.COLORS.BLACK3,
        fontSize: 14
    },
    forgot:{
        marginTop:32,
        alignSelf: 'center'
    },
    acessibilidade:{
        alignSelf: 'center'
    }
})