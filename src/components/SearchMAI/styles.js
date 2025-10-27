import { StyleSheet } from "react-native";
import theme from "../../theme";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.COLORS.WHITE2,
    borderRadius: 25,
    height: 50,
    alignSelf: "center",
  },
  icon: {
    marginLeft: 10,
    marginRight: 20,
  },
  input: {
    flex: 1,
    color: theme.COLORS.BLACK1,
    fontSize: 16,
  },
});