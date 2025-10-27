import { StyleSheet } from "react-native";
import theme from "../../theme";

export const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: theme.COLORS.WHITE3,
        paddingHorizontal:24,
    },
  center:{ 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center" 
},

  empty: { textAlign: "center",
     marginTop: 40, 
     color: "#999" },
});