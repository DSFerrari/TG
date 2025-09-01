import { StyleSheet } from "react-native";
import theme from "../../theme";

export const styles = StyleSheet.create({
container:{
    flex:1,
    justifyContent: 'center',
    backgroundColor: theme.COLORS.WHITE3,
    paddingHorizontal: 24
},
titulo:{
    alignSelf: 'center',
    color: theme.COLORS.BLUE1,
    fontSize: 22,
},
subtitulo:{
    marginTop: 20,
    alignSelf: 'center',
    fontSize: 16,
    color: theme.COLORS.BLUE1
}
})