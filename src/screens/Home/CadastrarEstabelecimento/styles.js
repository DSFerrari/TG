import { StyleSheet } from "react-native";
import theme from "../../../theme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        backgroundColor: theme.COLORS.WHITE3,
    },
    chip: {
  borderWidth: 1,
  borderColor: theme.COLORS.BLACK1,
  paddingVertical: 8,
  paddingHorizontal: 14,
  borderRadius: 18,
  marginRight: 8,
},
chipActive: {
  backgroundColor: theme.COLORS.BLUE1,
  borderColor: theme.COLORS.BLUE1,
},
chipText: {
  color: theme.COLORS.BLACK1,
  fontSize: 14,
},
chipTextActive: {
  color: "#fff",
  fontWeight: "600",
},

});