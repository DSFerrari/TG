import { StyleSheet } from "react-native";
import theme from "../../theme";

export const styles = StyleSheet.create({
    container:{
        backgroundColor: theme.COLORS.WHITE1,
        marginTop: 20,
        borderBottomWidth: 1,
        borderColor: theme.COLORS.BLACK1,

    },
    campo:{
        fontSize: 12,
        color: theme.COLORS.BLACK3
    },
    dado:{
        fontSize: 16,
        color: theme.COLORS.BLACK1
    }
})