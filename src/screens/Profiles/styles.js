import { StyleSheet } from "react-native";
import theme from "../../theme";

export const styles = StyleSheet.create({
  container: { 
    paddingHorizontal:24,
    backgroundColor: theme.COLORS.WHITE3,
    flex: 1
  },
  avatar: {
    alignSelf: 'center', 
     width: 120,
     height: 120, 
     borderRadius: 60, 
     marginTop: 50 
    },
    campos:{
        backgroundColor: theme.COLORS.WHITE1
    }
});