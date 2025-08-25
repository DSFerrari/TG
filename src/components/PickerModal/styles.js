import theme from "../../theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginTop: 32
  },
  label: {
    position: "absolute",
    top: -10,
    left: 12,
    backgroundColor: theme.COLORS.WHITE3,
    paddingHorizontal: 4,
    fontSize: 13,
    color: theme.COLORS.BLACK1,
    zIndex: 1,
  },
  dropdown: {
    height: 60,
    width: 350,
    borderColor: theme.COLORS.BLACK1,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 1,
    backgroundColor: theme.COLORS.WHITE3,
    fontSize: 16
},
  placeholderStyle: {
    fontSize: 16,
    color: theme.COLORS.BLACK1,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: theme.COLORS.BLACK1,
  },
});