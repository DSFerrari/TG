import { StyleSheet } from "react-native";
import theme from "../../theme";

export const styles = StyleSheet.create({
    input:{
        borderWidth: 1,
        borderColor: theme.COLORS.BLACK1,
        borderRadius: 5,
        paddingHorizontal: 16,
        paddingVertical: 1,
        fontSize: 16,
        height: 60,
        width: "100%",
        borderStyle: 'solid'
        },
        textwithinput:{
        backgroundColor: theme.COLORS.WHITE3,
        position: 'absolute',
        top: -10,
        left: 12,
        paddingHorizontal: 5,
        color: theme.COLORS.BLACK1,
        fontSize: 14,
        zIndex: 1,
        },
        viewtoinput:{
            marginTop: 32,
        },
        inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
},
inputWithIcon: {
    paddingRight: 50,
},
eyeIcon: {
    position: 'absolute',
    right: 15,
    padding: 5,
},
})