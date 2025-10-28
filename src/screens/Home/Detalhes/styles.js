import { StyleSheet } from "react-native";
import theme from "../../../theme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.COLORS.WHITE3, 
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
});