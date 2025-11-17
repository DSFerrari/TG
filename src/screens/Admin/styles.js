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
        backgroundColor: theme.COLORS.BLUE3,
        padding: 20,
        borderWidth:1,
        borderColor: theme.COLORS.WHITE1,
        borderRadius:12
    },
    textSelect:{
        marginLeft: 10,
        fontSize:16,
        color: theme.COLORS.BLACK1,
        fontWeight: 'bold'
    },
    image: {
        width: '100%',
        height: 250, 
        resizeMode: 'cover',
    },
    content: {
        padding: 20, 
    },
    ratingContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    category: {
        fontSize: 18,
        fontWeight: '400',
        color: theme.COLORS.BLACK1,
        marginBottom: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.COLORS.BLACK1,
        marginBottom: 8,
    },
    itemText: {
        fontSize: 15,
        color: theme.COLORS.BLACK1,
        lineHeight: 24,
    },
})